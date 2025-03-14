// src/server/routes/facebookWebhook.js
import express from "express";
import { handleError } from "../utils/errorHandler.js";
import { dbAdmin } from "../firebaseAdmin.js";

import { getLeadByWhatsAppNumber, saveLead } from "../services/leadService.js";
import { saveMessageHistory } from "../services/messageService.js";
import { getActiveAutomacaoByUserId } from "../services/automacaoService.js";
import { gerarRespostaIA } from "../services/iaService.js";
import { enviarMensagemWhatsApp } from "../services/whatsappService.js";
import { createNotification } from "../services/notificationService.js";

const router = express.Router();

/**
 * GET /api/facebook/webhook
 *  - Validação do Webhook (Verify Token).
 */
router.get("/webhook", (req, res) => {
  try {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    // Compare com seu token do .env => FB_VERIFY_TOKEN
    if (mode === "subscribe" && token === process.env.FB_VERIFY_TOKEN) {
      console.log("✅ Webhook validado, challenge =", challenge);
      return res.status(200).send(challenge);
    } else {
      console.log("❌ Falha na verificação do webhook");
      return res.sendStatus(403);
    }
  } catch (error) {
    return handleError(res, error, "Erro GET verificação Webhook", 500);
  }
});

/**
 * POST /api/facebook/webhook
 *  - Recebe mensagens inbound da Cloud API (WhatsApp).
 */
router.post("/webhook", async (req, res) => {
  try {
    const body = req.body;
    if (!body.entry) {
      return res.sendStatus(200);
    }

    for (const entry of body.entry) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value;
        if (!value || !value.messages) {
          // Pode ser status de entrega, read, etc. Se não é "messages", ignoramos
          continue;
        }

        // phone_number_id: ID do número que recebeu a mensagem
        const phoneNumberId = value.metadata?.phone_number_id;

        // Itera sobre as mensagens
        for (const msg of value.messages) {
          const from = msg.from; // ex.: "5511999999999"
          const text = msg.text?.body || "";

          console.log(
            `➡️ Recebemos msg de ${from}: "${text}" (phoneNumberId=${phoneNumberId})`
          );

          // 1) Identificar userId vinculado ao phoneNumberId
          const userId = await findUserIdByPhoneNumberId(phoneNumberId);
          if (!userId) {
            console.log("Nenhum userId p/ phoneNumberId:", phoneNumberId);
            continue;
          }

          // 2) Obter ou criar lead no Firestore
          let lead = await getLeadByWhatsAppNumber(from);
          if (!lead) {
            lead = await saveLead({ userId, whatsappNumber: from });
            console.log("Lead criado:", lead.id);
          }

          // 3) Salvar histórico => role="user"
          await saveMessageHistory(lead.id, userId, "user", text);

          // 4) Ver automação (IA)
          const activeAutomacao = await getActiveAutomacaoByUserId(userId);
          if (!activeAutomacao || activeAutomacao.pausada) {
            // Se não há automação ou está pausada => user responde manual
            continue;
          }

          // 5) Se lead pede "falar com atendente"
          if (text.trim().toLowerCase() === "falar com atendente") {
            const autoRef = dbAdmin
              .collection("automacoes")
              .doc(activeAutomacao.id);
            await autoRef.update({ pausada: true });

            await createNotification(
              userId,
              "IA pausada a pedido do lead. Intervenção humana."
            );

            const manualMsg = "Certo, em breve um atendente humano responderá.";
            await enviarMensagemWhatsApp(userId, from, manualMsg);
            await saveMessageHistory(lead.id, userId, "assistant", manualMsg);
            continue;
          }

          // 6) Caso normal: Gera resposta IA
          const respostaIA = await gerarRespostaIA(
            text,
            activeAutomacao,
            userId,
            lead
          );

          // 7) Envia a resposta
          await enviarMensagemWhatsApp(userId, from, respostaIA);

          // 8) Salva histórico => role="assistant"
          await saveMessageHistory(lead.id, userId, "assistant", respostaIA);
        }
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleError(res, error, "Erro inbound Facebook Webhook", 500);
  }
});

/**
 * Mapeia phoneNumberId => userId
 */
async function findUserIdByPhoneNumberId(phoneNumberId) {
  if (!phoneNumberId) return null;
  const colRef = dbAdmin.collection("userWhatsAppCloud"); // ou "userWhatsAppCloud"
  const snap = await colRef.where("phoneNumberId", "==", phoneNumberId).get();
  if (!snap.empty) {
    return snap.docs[0].data().userId;
  }
  return null;
}

export default router;
