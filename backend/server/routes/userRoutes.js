// src/server/routes/userRoutes.js
import express from "express";
import { handleError } from "../utils/errorHandler.js";
import { dbAdmin } from "../firebaseAdmin.js";

const router = express.Router();

/**
 * GET /api/user/cloud-config?userId=xxx
 *  - Retorna {cloudPhoneNumberId, cloudAccessToken}, se existir
 */
router.get("/cloud-config", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId." });
    }

    const docRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    const snap = await docRef.get();
    if (!snap.exists) {
      // Nenhuma config
      return res.json({ success: true, config: null });
    }

    const data = snap.data();
    return res.json({
      success: true,
      config: {
        cloudPhoneNumberId: data.cloudPhoneNumberId || "",
        cloudAccessToken: data.cloudAccessToken || "",
      },
    });
  } catch (error) {
    return handleError(res, error, "Erro ao buscar config Cloud");
  }
});

/**
 * POST /api/user/save-whatsapp-cloud
 * Body: { userId, phoneNumberId, cloudAccessToken }
 *  - Salva no doc userWhatsAppCloud/{userId} (sem apagar nada).
 */
router.post("/save-whatsapp-cloud", async (req, res) => {
  try {
    const { userId, phoneNumberId, cloudAccessToken } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId." });
    }
    if (!phoneNumberId || !cloudAccessToken) {
      return res
        .status(400)
        .json({ error: "Falta phoneNumberId ou cloudAccessToken." });
    }

    const docRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    await docRef.set(
      {
        userId,
        phoneNumberId,
        cloudPhoneNumberId: phoneNumberId,
        cloudAccessToken,
      },
      { merge: true }
    );

    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Erro ao salvar config WhatsApp Cloud");
  }
});

export default router;
