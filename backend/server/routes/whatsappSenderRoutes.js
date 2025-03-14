// src/server/routes/whatsappSenderRoutes.js
import express from "express";
import axios from "axios";
import { handleError } from "../utils/errorHandler.js";
import { dbAdmin } from "../firebaseAdmin.js";

// Ajuste conforme o .env
const MAIN_TWILIO_ACCOUNT_SID = process.env.TWILIO_MAIN_ACCOUNT_SID;
const MAIN_TWILIO_AUTH_TOKEN = process.env.TWILIO_MAIN_AUTH_TOKEN;

// Endpoint base do v2: https://messaging.twilio.com/v2/Channels/Senders
// https://www.twilio.com/docs/whatsapp/api/whatsapp-senders-api
const TWILIO_SENDERS_BASE_URL =
  "https://messaging.twilio.com/v2/Channels/Senders";

const router = express.Router();

/**
 * 1) Iniciar cadastro de WhatsApp Sender (v2)
 * - Cria um Sender "XE..." ou "DG..." e dispara a verificação (SMS ou voz)
 */
router.post("/init-whatsapp-sender", async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;
    if (!userId || !phoneNumber) {
      return res.status(400).json({ error: "Faltam userId ou phoneNumber." });
    }

    // Body para criar Sender em /v2/Channels/Senders
    // "sender_id": "whatsapp:+5511999999999"
    // "profile.name": ex.: "Minha Empresa"
    const payload = {
      sender_id: `whatsapp:${phoneNumber}`, // e.g. "whatsapp:+5511..."
      profile: {
        name: `MeuApp - ${phoneNumber}`, // Nome visível no WhatsApp
      },
    };

    const credentials = Buffer.from(
      `${MAIN_TWILIO_ACCOUNT_SID}:${MAIN_TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    // POST https://messaging.twilio.com/v2/Channels/Senders
    const twilioResp = await axios.post(TWILIO_SENDERS_BASE_URL, payload, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    // Exemplo de resp:
    // { sid: "XE...", sender_id: "whatsapp:+55...", status: "CREATING", phone_number_sid: null, ... }
    const senderSid = twilioResp.data.sid;
    const status = twilioResp.data.status;
    // phone_number_sid provavelmente será null até finalizar verificação
    const phoneNumberSid = twilioResp.data.phone_number_sid ?? null;

    // Salvar no Firestore
    const userRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    await userRef.set(
      {
        userId,
        phoneNumber,
        whatsAppSenderSid: senderSid,
        phoneNumberSid: phoneNumberSid,
        senderStatus: status,
      },
      { merge: true }
    );

    return res.json({
      success: true,
      senderSid,
      status,
      phoneNumberSid,
      message: `Número em processo de criação/registro no WhatsApp. Verifique logs no Twilio e aguarde o código de verificação.`,
    });
  } catch (error) {
    return handleError(res, error, "Erro ao iniciar WhatsApp Sender (v2)");
  }
});

/**
 * 2) Confirmar código de verificação (v2)
 * - Precisamos chamar o /v2/Channels/Senders/{Sid} com "configuration.verification_code"
 */
router.post("/verify-whatsapp-sender", async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) {
      return res.status(400).json({ error: "Faltam userId ou code." });
    }

    // Buscar doc do Firestore
    const userRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res
        .status(404)
        .json({ error: "Config Twilio não encontrada p/ esse userId" });
    }

    const data = snap.data();
    const senderSid = data.whatsAppSenderSid; // ex: "XE..." ou "DG..."
    if (!senderSid) {
      return res
        .status(400)
        .json({ error: "whatsAppSenderSid não encontrado no Firestore." });
    }

    // Monta payload p/ verificação
    const payload = {
      configuration: {
        verification_code: code,
      },
    };

    const credentials = Buffer.from(
      `${MAIN_TWILIO_ACCOUNT_SID}:${MAIN_TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    // POST https://messaging.twilio.com/v2/Channels/Senders/{SenderSid}
    const verifyUrl = `${TWILIO_SENDERS_BASE_URL}/${senderSid}`;
    const verifyResp = await axios.post(verifyUrl, payload, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    // Ex.: { sid: "XE...", status: "ONLINE"|"VERIFYING", phone_number_sid: "PN..." }
    const newStatus = verifyResp.data.status;
    const verifiedPhoneNumberSid = verifyResp.data.phone_number_sid ?? null;

    // Se a verificação estiver concluída, status costuma ser "ONLINE".
    // Pode ficar "VERIFYING" por uns instantes. Se for outro status, alertamos.
    if (!["ONLINE", "VERIFYING"].includes(newStatus)) {
      return res.json({
        success: false,
        status: newStatus,
        message: `Código verificado, mas status final é ${newStatus}.`,
      });
    }

    // Atualiza no Firestore, substituindo undefined por null
    await userRef.update({
      phoneNumberSid: verifiedPhoneNumberSid,
      senderStatus: newStatus,
    });

    // Configurar inbound webhook se "PN..."
    let inboundMsg = "";
    if (verifiedPhoneNumberSid && verifiedPhoneNumberSid.startsWith("PN")) {
      try {
        await axios.post(
          "https://zapwise.com.br/api/twilio/set-inbound-webhook",
          {
            userId,
          }
        );
        inboundMsg = "Webhook inbound configurado com sucesso.";
      } catch (err) {
        inboundMsg = "Falha ao configurar inbound: " + err.message;
      }
    } else {
      inboundMsg = "phoneNumberSid não inicia com 'PN', inbound pode falhar.";
    }

    return res.json({
      success: true,
      status: newStatus,
      phoneNumberSid: verifiedPhoneNumberSid,
      message: `Verificação finalizada. Status: ${newStatus}. ${inboundMsg}`,
    });
  } catch (error) {
    return handleError(res, error, "Erro ao confirmar WhatsApp Sender (v2)");
  }
});

export default router;
