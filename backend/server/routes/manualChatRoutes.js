// src/server/routes/manualChatRoutes.js

import express from "express";
import { saveMessageHistory } from "../services/messageService.js";
import { enviarMensagemWhatsApp } from "../services/whatsappService.js";
import { handleError } from "../utils/errorHandler.js";

const router = express.Router();

/**
 * POST /api/manual-chat/send
 * Body: { userId, leadId, toNumber, content }
 */
router.post("/send", async (req, res) => {
  try {
    const { userId, leadId, toNumber, content } = req.body;
    if (!userId || !toNumber || !content) {
      return res.status(400).json({
        error: "Faltam dados: userId, toNumber, content (leadId é opcional).",
      });
    }

    // 1) Envia via Cloud API
    await enviarMensagemWhatsApp(userId, toNumber, content);

    // 2) Salva histórico (se tiver leadId)
    if (leadId) {
      await saveMessageHistory(leadId, userId, "human", content);
    }

    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Erro ao enviar mensagem manual.");
  }
});

export default router;
