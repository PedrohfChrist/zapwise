// src/server/routes/twilioWebhook.js
import express from "express";
import { handleError } from "../utils/errorHandler.js";
import { admin, dbAdmin } from "../firebaseAdmin.js";

import { getLeadByWhatsAppNumber, saveLead } from "../services/leadService.js";
import { saveMessageHistory } from "../services/messageService.js";
import { getActiveAutomacaoByUserId } from "../services/automacaoService.js";
import { gerarRespostaIA } from "../services/iaService.js";
import { enviarMensagemWhatsApp } from "../services/whatsappService.js";
import { createNotification } from "../services/notificationService.js";

const router = express.Router();

router.post("/incoming", async (req, res) => {
  try {
    const { From, To, Body } = req.body;
    console.log("Inbound Twilio Avançado:", { From, To, Body });

    if (!From || !To || !Body) {
      return res.status(400).send("Faltam campos (From,To,Body)");
    }

    // 1) Identificar user
    const toNumber = To.replace("whatsapp:", "").replace("+", "");
    const userId = await findUserIdByPhoneNumber(toNumber);
    if (!userId) {
      console.log("Nenhum userId para esse número:", toNumber);
      return res.status(200).end();
    }

    // 2) Obter ou criar lead
    let lead = await getLeadByWhatsAppNumber(From);
    if (!lead) {
      lead = await saveLead({ userId, whatsappNumber: From });
      console.log("Lead criado:", lead.id);
    }

    // 3) Pegar automação ativa
    const activeAutomacao = await getActiveAutomacaoByUserId(userId);
    if (!activeAutomacao) {
      // sem automação => user responde manual
      return res.status(200).end();
    }

    // 4) Se estiver pausada, não responde IA
    if (activeAutomacao.pausada) {
      return res.status(200).end();
    }

    // 5) Se lead pede “falar com atendente”
    if (Body.trim().toLowerCase() === "falar com atendente") {
      const autoRef = dbAdmin.collection("automacoes").doc(activeAutomacao.id);
      await autoRef.update({ pausada: true });

      await createNotification(
        userId,
        "IA pausada a pedido do lead. Intervenção humana."
      );
      await enviarMensagemWhatsApp(
        userId,
        From.replace("whatsapp:", ""),
        "Certo, em breve um atendente humano responderá."
      );
      await saveMessageHistory(lead.id, userId, "assistant", "IA pausada.");
      return res.status(200).end();
    }

    // 6) Gerar resposta IA
    const respostaIA = await gerarRespostaIA(
      Body,
      activeAutomacao,
      userId,
      lead
    );

    // 7) Enviar a resposta
    await enviarMensagemWhatsApp(
      userId,
      From.replace("whatsapp:", ""),
      respostaIA
    );

    // 8) Salvar histórico
    await saveMessageHistory(lead.id, userId, "user", Body);
    await saveMessageHistory(lead.id, userId, "assistant", respostaIA);

    return res.status(200).end();
  } catch (error) {
    return handleError(res, error, "Erro inbound Twilio Avançado");
  }
});

/** Achar userId pelo phoneNumber (sem +). */
async function findUserIdByPhoneNumber(numSemPlus) {
  const userTwilioRef = dbAdmin.collection("userTwilio");
  const snap = await userTwilioRef.where("phoneNumber", "==", numSemPlus).get();
  if (!snap.empty) {
    return snap.docs[0].data().userId;
  }
  return null;
}

export default router;
