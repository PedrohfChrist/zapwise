// src/server/routes/twilioRoutes.js
import express from "express";
import twilio from "twilio";
import { admin, dbAdmin } from "../firebaseAdmin.js";
import { handleError } from "../utils/errorHandler.js";

// Use as variáveis que você tem no .env:
// TWILIO_MAIN_ACCOUNT_SID e TWILIO_MAIN_AUTH_TOKEN
const MAIN_TWILIO_ACCOUNT_SID = process.env.TWILIO_MAIN_ACCOUNT_SID;
const MAIN_TWILIO_AUTH_TOKEN = process.env.TWILIO_MAIN_AUTH_TOKEN;

const twilioClient = twilio(MAIN_TWILIO_ACCOUNT_SID, MAIN_TWILIO_AUTH_TOKEN);

const router = express.Router();

/**
 * 1) Enviar mensagem (OUTBOUND)
 */
router.post("/send-message", async (req, res) => {
  try {
    const { userId, toNumber, body } = req.body;
    if (!userId || !toNumber || !body) {
      return res.status(400).json({ error: "Faltam userId, toNumber, body." });
    }

    // Pega config user do Firestore
    const userRef = dbAdmin.collection("userTwilio").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res
        .status(404)
        .json({ error: "Nenhuma config Twilio p/ esse userId" });
    }
    const data = snap.data();
    const phoneNumber = data.phoneNumber;
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: "Usuário não tem phoneNumber salvo" });
    }

    // Se for SANDBOX ou outro condicional, faça a checagem
    const phoneNumberSid = data.phoneNumberSid;
    let fromWhatsApp;
    if (phoneNumberSid === "SANDBOX") {
      // Sandbox
      fromWhatsApp = "whatsapp:+14155238886";
    } else {
      // Normal
      fromWhatsApp = `whatsapp:+${phoneNumber.replace(/\D/g, "")}`;
    }

    const toWhatsApp = `whatsapp:${toNumber}`;

    const msg = await twilioClient.messages.create({
      from: fromWhatsApp,
      to: toWhatsApp,
      body,
    });

    return res.json({
      success: true,
      sid: msg.sid,
      message: "Mensagem enviada com sucesso!",
    });
  } catch (error) {
    return handleError(res, error, "Erro ao enviar mensagem via Twilio");
  }
});

/**
 * 2) Reconfigurar inbound webhook
 */
router.post("/set-inbound-webhook", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId." });
    }

    const userRef = dbAdmin.collection("userTwilio").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Config Twilio não encontrada." });
    }
    const data = snap.data();
    const phoneNumberSid = data.phoneNumberSid;
    if (!phoneNumberSid) {
      return res.status(400).json({
        error: "Usuário não possui phoneNumberSid salvo.",
      });
    }

    // Se for SANDBOX, retornamos sem configurar no Twilio
    if (phoneNumberSid === "SANDBOX") {
      return res.json({
        success: true,
        phoneNumberSid: "SANDBOX",
        message:
          "Sandbox não requer inbound webhook configurado. Nenhuma ação necessária.",
      });
    }

    const webhookUrl = "https://zapwise.com.br/api/twilio/incoming";

    const updated = await twilioClient
      .incomingPhoneNumbers(phoneNumberSid)
      .update({
        smsUrl: webhookUrl,
        smsMethod: "POST",
      });

    return res.json({
      success: true,
      phoneNumberSid: updated.sid,
      message: "Webhook inbound atualizado!",
    });
  } catch (error) {
    return handleError(res, error, "Erro ao setar inbound webhook");
  }
});

/**
 * 3) Remover número
 */
router.post("/remove-number", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    const userRef = dbAdmin.collection("userTwilio").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res
        .status(404)
        .json({ error: "Config Twilio não encontrada p/ userId" });
    }

    const data = snap.data();
    const phoneNumberSid = data.phoneNumberSid;
    if (!phoneNumberSid) {
      return res
        .status(400)
        .json({ error: "Usuário não tem phoneNumberSid salvo." });
    }

    // Se for SANDBOX, apenas removemos no Firestore
    if (phoneNumberSid === "SANDBOX") {
      await userRef.update({
        phoneNumberSid: admin.firestore.FieldValue.delete(),
        phoneNumber: admin.firestore.FieldValue.delete(),
      });
      return res.json({
        success: true,
        message: "Número (SANDBOX) removido do Firestore com sucesso.",
      });
    }

    // Caso normal, remove do Twilio
    await twilioClient.incomingPhoneNumbers(phoneNumberSid).remove();

    // Remove do Firestore
    await userRef.update({
      phoneNumberSid: admin.firestore.FieldValue.delete(),
      phoneNumber: admin.firestore.FieldValue.delete(),
    });

    return res.json({ success: true, message: "Número removido com sucesso." });
  } catch (error) {
    return handleError(res, error, "Erro ao remover número Twilio");
  }
});

export default router;
