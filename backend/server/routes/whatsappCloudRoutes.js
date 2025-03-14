import express from "express";
import axios from "axios";
import { dbAdmin } from "../firebaseAdmin.js";
import { handleError } from "../utils/errorHandler.js";

const router = express.Router();

/**
 * 1) Enviar mensagem WhatsApp Cloud
 */
router.post("/send-message", async (req, res) => {
  try {
    const { userId, toNumber, message } = req.body;
    if (!userId || !toNumber || !message) {
      return res
        .status(400)
        .json({ error: "Faltam userId, toNumber, message." });
    }

    // Buscar doc no Firestore que contém as infos do Cloud (phoneNumberId, accessToken, etc.)
    const userRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res
        .status(404)
        .json({ error: "Nenhuma config Cloud p/ esse userId" });
    }

    const data = snap.data();
    const phoneNumberId = data.phoneNumberId; // ex: "123456789..."
    const accessToken = data.accessToken; // Token gerado no App do FB
    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({
        error: "Dados incompletos (phoneNumberId ou accessToken) no Firestore.",
      });
    }

    // Monta requisição
    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      to: toNumber, // ex: "5511987654321"
      text: { body: message },
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.json({
      success: true,
      responseData: response.data,
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro ao enviar mensagem via WhatsApp Cloud"
    );
  }
});

/**
 * 2) Webhook de Inbound (receber mensagens do lead)
 */
router.post("/incoming", async (req, res) => {
  try {
    // O body depende do que o Facebook manda. Normalmente vem algo como:
    // { "entry": [{ "changes": [{ "value": { "messages": [{...}] }} ]}] }
    // Você deve parsear e extrair a mensagem, phone, etc.
    const data = req.body;

    // Exemplo simplificado:
    const entry = data.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages || [];
    if (messages.length > 0) {
      const incoming = messages[0];
      const from = incoming.from; // "5511999999999"
      const msgBody = incoming.text?.body || "";
      const phoneNumberId = value.metadata?.phone_number_id; // p.ex "10987654321"

      // Descobrir qual userId está associado a esse phoneNumberId
      const userId = await findUserIdByPhoneNumberId(phoneNumberId);
      if (!userId) {
        console.log("Nenhum userId para phoneNumberId:", phoneNumberId);
        return res.sendStatus(200);
      }

      // Chamar sua lógica de:
      // 1) leadService => getLeadByWhatsAppNumber, save if not exists
      // 2) check automacao
      // 3) gerarRespostaIA, etc.
      // 4) Enviar de volta via /send-message endpoint

      console.log("Recebemos msg do lead:", from, "Conteúdo:", msgBody);
      // ...
    }

    return res.sendStatus(200);
  } catch (error) {
    return handleError(res, error, "Erro no inbound WhatsApp Cloud");
  }
});

/**
 * 3) GET/POST para registrar ou atualizar token, phoneNumberId
 */
router.post("/register-number", async (req, res) => {
  try {
    const { userId, phoneNumberId, accessToken } = req.body;
    if (!userId || !phoneNumberId || !accessToken) {
      return res
        .status(400)
        .json({ error: "Faltam userId, phoneNumberId, accessToken." });
    }

    // Salva no Firestore
    const ref = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    await ref.set(
      {
        userId,
        phoneNumberId,
        accessToken,
      },
      { merge: true }
    );

    return res.json({
      success: true,
      message: "Número WhatsApp Cloud registrado com sucesso.",
    });
  } catch (error) {
    return handleError(
      res,
      error,
      "Erro ao registrar número do WhatsApp Cloud"
    );
  }
});

/** Helper para achar userId a partir do phoneNumberId */
async function findUserIdByPhoneNumberId(phoneNumberId) {
  const colRef = dbAdmin.collection("userWhatsAppCloud");
  const snap = await colRef.where("phoneNumberId", "==", phoneNumberId).get();
  if (!snap.empty) {
    return snap.docs[0].data().userId;
  }
  return null;
}

export default router;
