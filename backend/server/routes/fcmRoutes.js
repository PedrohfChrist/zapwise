// src/server/routes/fcmRoutes.js
import express from "express";
import { sendFCMNotification } from "../services/fcmService.js";

const router = express.Router();

/**
 * POST /api/fcm/send
 * Body: { userId, title, body }
 */
router.post("/send", async (req, res) => {
  try {
    const { userId, title, body } = req.body;
    if (!userId || !title || !body) {
      return res.status(400).json({ error: "Faltam userId, title e body." });
    }

    await sendFCMNotification(userId, title, body);
    return res.json({ success: true });
  } catch (error) {
    console.error("Erro /fcm/send:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao enviar notificação." });
  }
});

export default router;
