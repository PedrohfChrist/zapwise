// functions/index.js

const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// Se ainda não inicializou, inicializa
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ===== Importar Funções Auxiliares =====
const { createUser } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { facebookCapi } = require("./facebookCapi");
const { onKirvanoWebhook } = require("./onKirvanoWebhook");
// const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");

/**
 * ─────────────────────────────────────────────────────────────────
 *  1) Função HTTP (Exemplo: createUser)
 * ─────────────────────────────────────────────────────────────────
 */
exports.createUser = createUser;

/**
 * ─────────────────────────────────────────────────────────────────
 *  2) Gatilho Firestore: onMessageCreated
 * ─────────────────────────────────────────────────────────────────
 */
exports.onMessageCreated = onDocumentCreated(
  "messageHistory/{msgId}",
  async (event) => {
    try {
      const snap = event.data;
      if (!snap) {
        console.log("Nenhum documento criado, ignorando...");
        return;
      }

      const data = snap.data();
      if (!data || !data.leadId) {
        console.log("Documento sem leadId, ignorando...");
        return;
      }

      const leadId = data.leadId;
      const lastMessageText = data.content || "";
      const lastMessageAt = data.timestamp || new Date(); // Evita erro se o timestamp é serverTimestamp

      // Atualiza lead com último msg
      const leadRef = db.collection("leads").doc(leadId);
      await leadRef.set(
        {
          lastMessageText,
          lastMessageAt,
        },
        { merge: true }
      );

      console.log(
        `✅ Atualizado lead ${leadId} => Última Msg: "${lastMessageText}"`
      );
    } catch (err) {
      console.error("❌ Erro no onMessageCreated:", err);
    }
  }
);

/**
 * ─────────────────────────────────────────────────────────────────
 *  3) Função HTTP: onKirvanoWebhook
 * ─────────────────────────────────────────────────────────────────
 */
exports.onKirvanoWebhook = onKirvanoWebhook;

/**
 * ─────────────────────────────────────────────────────────────────
 *  4) Scheduled Function: Reset Tokens Mensal do Plano Anual
 * ─────────────────────────────────────────────────────────────────
 */
exports.scheduledCheckAndResetTokens = onSchedule(
  { schedule: "0 3 * * *" }, // todo dia às 3h da manhã
  async () => {
    logger.info("Iniciando check de assinaturas e reset mensal...");

    const snapshot = await db
      .collection("subscriptions")
      .where("status", "==", "ACTIVE")
      .get();

    const now = new Date();

    for (const docSnap of snapshot.docs) {
      const sub = docSnap.data();

      // 1) Se `renewalDate` existe e já passou => expira
      if (sub.renewalDate) {
        let renewal = sub.renewalDate;
        if (renewal.toDate) renewal = renewal.toDate();
        if (renewal < now) {
          await docSnap.ref.update({
            status: "EXPIRED",
            updatedAt: now,
          });
          logger.info(`Expirando sub ${docSnap.id} => renewalDate=${renewal}`);
          continue; // pula para o próximo
        }
      }

      // 2) Reset mensal de tokens
      //    Calcula quantos dias desde a purchaseDate
      const purchaseDate = sub.purchaseDate?.toDate
        ? sub.purchaseDate.toDate()
        : new Date(sub.purchaseDate || null);

      if (!purchaseDate) {
        // se não tiver purchaseDate, pula
        continue;
      }

      const diffDays = Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24));
      // mesCorrente => quantas vezes 30 dias se passaram
      const mesCorrente = Math.floor(diffDays / 30);

      const lastResetMonth = sub.lastResetMonth ?? -1;

      if (mesCorrente > lastResetMonth) {
        // Precisamos resetar tokens
        await docSnap.ref.update({
          wordsGenerated: 0,
          lastResetMonth: mesCorrente,
          updatedAt: now,
        });
        logger.info(
          `✅ Reset de tokens do user ${docSnap.id}. mesCorrente=${mesCorrente}`
        );
      }
    }

    logger.info("✔️ Fim do scheduledCheckAndResetTokens.");
  }
);

/**
 * ─────────────────────────────────────────────────────────────────
 *  5) Outras Funções / Exports
 * ─────────────────────────────────────────────────────────────────
 */
exports.changePassword = changePassword;
exports.facebookCapi = facebookCapi;

// Se quiser reativar:
// exports.onUserCreate = onUserCreate;
// exports.initiateCheckout = initiateCheckout;
