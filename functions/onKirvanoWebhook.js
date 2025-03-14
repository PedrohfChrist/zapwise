// onKirvanoWebhook.js
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const generatePassword = require("./utils/generatePassword");

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const auth = admin.auth();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smtpUser = process.env.SMTP_EMAIL;
const smtpPass = process.env.SMTP_PASSWORD;
logger.info("SMTP_USER:", smtpUser);

// Cria transporter com Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

app.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).send("Webhook vazio.");
    }

    logger.info("📩 Recebendo webhook da Kirvano:", payload);

    // Salva o payload no Firestore para depuração
    await db.collection("webhooks").add({
      source: "kirvano",
      createdAt: new Date(),
      payload,
    });

    const event = payload.event; // Ex: "SALE_APPROVED", "SUBSCRIPTION_RENEWED", ...
    const status = payload.status; // Ex: "APPROVED", "PENDING", ...
    const buyerEmail = payload.customer?.email || "";
    const buyerName = payload.customer?.name || "Cliente";

    await processKirvanoEvent(event, status, payload, buyerEmail, buyerName);

    return res.status(200).send("Webhook processado com sucesso!");
  } catch (err) {
    logger.error("❌ Erro no Kirvano Webhook:", err);
    return res.status(500).send("Erro interno ao processar webhook.");
  }
});

async function processKirvanoEvent(
  event,
  status,
  payload,
  buyerEmail,
  buyerName
) {
  try {
    if (!buyerEmail) {
      logger.warn("⚠️ Webhook recebido sem e-mail de comprador. Ignorando.");
      return;
    }

    // event => "ABANDONED_CART", "SALE_APPROVED", "SUBSCRIPTION_RENEWED", ...
    // status => "APPROVED", "PENDING", "CANCELED", ...
    const planName = payload.plan?.name || "Plano Indefinido";

    // 1) Abandoned cart
    if (event === "ABANDONED_CART") {
      logger.info("🛒 Carrinho abandonado. Sem ação.");
      // Se quiser mandar e-mail de "carrinho abandonado", crie aqui.
      return;
    }

    // 2) PENDING
    if (status === "PENDING") {
      logger.info("💰 Pagamento pendente. Status: PENDING");
      await ensureUserSubscription(buyerEmail, buyerName, payload, "PENDING");
      // Envia email de "Pagamento Pendente"
      await sendPaymentPendingEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 3) REFUSED, CANCELED
    if (["REFUSED", "CANCELED"].includes(status)) {
      logger.info("🚫 Pagamento recusado/cancelado => status=CANCELED");
      await setSubscriptionStatus(buyerEmail, "CANCELED");
      // E-mail de pagamento cancelado
      await sendPaymentCanceledEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 4) CHARGEBACK / REFUNDED
    if (["SALE_CHARGEBACK", "REFUNDED"].includes(event)) {
      logger.info("💳 Chargeback/Reembolso => status=REFUNDED");
      await setSubscriptionStatus(buyerEmail, "REFUNDED");
      // E-mail de reembolso
      await sendRefundedEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 5) SUBSCRIPTION_CANCELED
    if (event === "SUBSCRIPTION_CANCELED") {
      logger.info("❌ Assinatura cancelada => status=CANCELED");
      await setSubscriptionStatus(buyerEmail, "CANCELED");
      // E-mail de assinatura cancelada
      await sendSubscriptionCanceledEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 6) SUBSCRIPTION_EXPIRED
    if (event === "SUBSCRIPTION_EXPIRED") {
      logger.info("⌛ Assinatura expirada => status=EXPIRED");
      await setSubscriptionStatus(buyerEmail, "EXPIRED");
      // E-mail de assinatura expirada
      await sendSubscriptionExpiredEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 7) SUBSCRIPTION_RENEWED + APPROVED
    if (event === "SUBSCRIPTION_RENEWED" && status === "APPROVED") {
      logger.info("🔄 Assinatura renovada => status=ACTIVE");
      await ensureUserSubscription(
        buyerEmail,
        buyerName,
        payload,
        "ACTIVE",
        true
      );
      // E-mail de renovação
      await sendSubscriptionRenewedEmail(buyerEmail, buyerName, planName);
      return;
    }

    // 8) SALE_APPROVED + APPROVED (compra inicial)
    if (event === "SALE_APPROVED" && status === "APPROVED") {
      logger.info("✅ Venda aprovada => status=ACTIVE");
      const isNew = await ensureUserSubscription(
        buyerEmail,
        buyerName,
        payload,
        "ACTIVE",
        true
      );
      // Se for user novo => e-mail de boas-vindas com senha
      if (isNew?.newUserPassword) {
        await sendWelcomeEmail(buyerEmail, buyerName, isNew.newUserPassword);
      } else {
        // senão => e-mail de compra aprovada para user antigo
        await sendSaleApprovedEmail(buyerEmail, buyerName, planName);
      }
      return;
    }

    logger.warn("⚠️ Evento não tratado:", event, status);
  } catch (err) {
    logger.error("❌ Erro ao processar evento da Kirvano:", err);
  }
}

/**
 * Cria ou atualiza assinatura:
 *   - Se user nao existe, cria com senha e retorna { newUserPassword }
 *   - Ajusta doc "subscriptions/{userId}"
 *   - Se resetTokens=true => zera wordsGenerated e define renewalDate
 *
 * Retorna:
 *   { newUserPassword: "abc123..." } caso tenha criado user
 *   ou null caso seja user antigo
 */
async function ensureUserSubscription(
  buyerEmail,
  buyerName,
  payload,
  newStatus,
  resetTokens = false
) {
  let result = null;
  try {
    // Tenta achar user no Firebase Auth
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(buyerEmail);
    } catch (err) {
      logger.warn(`Usuário ${buyerEmail} não encontrado, criando novo...`);
    }

    let newUserPassword = null;
    if (!userRecord) {
      // user nao existe => criar
      const password = generatePassword(8);
      newUserPassword = password;

      userRecord = await auth.createUser({
        email: buyerEmail,
        displayName: buyerName,
        password,
        emailVerified: false,
      });

      // Cria doc em /users
      await db.collection("users").doc(userRecord.uid).set({
        email: buyerEmail,
        name: buyerName,
        createdAt: new Date(),
        origin: "kirvanoWebhook",
      });
    }

    const uid = userRecord.uid;
    const subRef = db.collection("subscriptions").doc(uid);

    const now = new Date();
    const purchaseDate = new Date(payload.created_at || now);
    const planName = payload.plan?.name || "Plano Indefinido";

    // define renewalDate
    let renewalDate = new Date(now);
    if (planName.toLowerCase().includes("anual")) {
      renewalDate.setDate(renewalDate.getDate() + 365);
    } else {
      renewalDate.setDate(renewalDate.getDate() + 30);
    }

    let updateData = {
      status: newStatus,
      plan: planName,
      purchaseDate,
      updatedAt: now,
    };

    if (resetTokens) {
      updateData.wordsGenerated = 0;
      updateData.lastResetMonth = -1;
      updateData.renewalDate = renewalDate;
    }

    await subRef.set(updateData, { merge: true });

    if (newUserPassword) {
      result = { newUserPassword };
    }
  } catch (err) {
    logger.error("❌ Erro ao garantir assinatura:", err);
  }

  return result;
}

/** Altera status=xxx para quem já existe no Auth */
async function setSubscriptionStatus(buyerEmail, newStatus) {
  try {
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(buyerEmail);
    } catch (err) {
      logger.warn(`Usuário ${buyerEmail} não encontrado ao setar status.`, err);
      return;
    }

    const subRef = db.collection("subscriptions").doc(userRecord.uid);
    await subRef.set(
      {
        status: newStatus,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (err) {
    logger.error("❌ Erro em setSubscriptionStatus:", err);
  }
}

/** E-mails ESPECÍFICOS para cada situação */
/** 1) Usuário novo => manda email com senha */
async function sendWelcomeEmail(email, name, password) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Bem-vindo ao ZapWise!",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Sua conta no ZapWise foi criada e sua compra foi aprovada.</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Senha:</strong> ${password}</li>
        </ul>
        <p>Acesse: <a href="https://zapwise.com.br/login">Fazer Login</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de boas-vindas enviado a ${email}`);
  } catch (err) {
    logger.error("❌ Erro ao enviar e-mail (sendWelcomeEmail):", err);
  }
}

/** 2) Usuário antigo => Compra aprovada */
async function sendSaleApprovedEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Pagamento Aprovado - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Seu pagamento do <strong>${planName}</strong> foi aprovado com sucesso!</p>
        <p>Agora você já pode acessar o ZapWise normalmente:</p>
        <p><a href="https://zapwise.com.br/login">Entrar</a></p>
        <p>Qualquer dúvida, estamos à disposição.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de pagamento aprovado enviado a ${email}`);
  } catch (err) {
    logger.error("❌ Erro ao enviar e-mail (sendSaleApprovedEmail):", err);
  }
}

/** 3) Pagamento PENDENTE */
async function sendPaymentPendingEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Pagamento Pendente - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Seu pagamento para o <strong>${planName}</strong> está pendente.</p>
        <p>Assim que for aprovado, você receberá outro e-mail de confirmação.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de pagamento pendente enviado a ${email}`);
  } catch (err) {
    logger.error("❌ Erro ao enviar e-mail (sendPaymentPendingEmail):", err);
  }
}

/** 4) Pagamento Cancelado */
async function sendPaymentCanceledEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Pagamento Cancelado - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Seu pagamento para o <strong>${planName}</strong> foi cancelado ou recusado.</p>
        <p>Se achar que é um engano, entre em contato conosco.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de pagamento cancelado enviado a ${email}`);
  } catch (err) {
    logger.error("❌ Erro ao enviar e-mail (sendPaymentCanceledEmail):", err);
  }
}

/** 5) Reembolso/Chargeback */
async function sendRefundedEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Reembolso/Chargeback - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Seu pagamento para o <strong>${planName}</strong> foi estornado (chargeback) ou reembolsado.</p>
        <p>Caso tenha alguma dúvida, nos contate.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de refund/chargeback enviado a ${email}`);
  } catch (err) {
    logger.error("❌ Erro ao enviar e-mail (sendRefundedEmail):", err);
  }
}

/** 6) Assinatura Cancelada */
async function sendSubscriptionCanceledEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Assinatura Cancelada - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Sua assinatura <strong>${planName}</strong> foi cancelada.</p>
        <p>Sentiremos sua falta. Caso queira retornar, estamos aqui!</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de assinatura cancelada enviado a ${email}`);
  } catch (err) {
    logger.error(
      "❌ Erro ao enviar e-mail (sendSubscriptionCanceledEmail):",
      err
    );
  }
}

/** 7) Assinatura Expirada */
async function sendSubscriptionExpiredEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Assinatura Expirada - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Sua assinatura <strong>${planName}</strong> expirou.</p>
        <p>Para reativá-la, faça o pagamento novamente.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de assinatura expirada enviado a ${email}`);
  } catch (err) {
    logger.error(
      "❌ Erro ao enviar e-mail (sendSubscriptionExpiredEmail):",
      err
    );
  }
}

/** 8) Assinatura Renovada */
async function sendSubscriptionRenewedEmail(email, name, planName) {
  try {
    const mailOptions = {
      from: '"ZapWise" <equipe@zapwise.com.br>',
      to: email,
      subject: "Assinatura Renovada - ZapWise",
      html: `
        <h2>Olá, ${name}!</h2>
        <p>Sua assinatura <strong>${planName}</strong> foi renovada com sucesso!</p>
        <p>Obrigado por continuar conosco. Bom uso do ZapWise!</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`✉️ E-mail de assinatura renovada enviado a ${email}`);
  } catch (err) {
    logger.error(
      "❌ Erro ao enviar e-mail (sendSubscriptionRenewedEmail):",
      err
    );
  }
}

exports.onKirvanoWebhook = onRequest(app);
