// src/server/services/whatsappService.js

import axios from "axios";
import { dbAdmin } from "../firebaseAdmin.js";

/**
 * Envia mensagem via Cloud API do Facebook (WhatsApp).
 * - Lê phoneNumberId e accessToken do doc "userWhatsAppCloud/{userId}" OU do .env
 * - Faz POST em "https://graph.facebook.com/v17.0/<phoneNumberId>/messages"
 */
export async function enviarMensagemWhatsApp(userId, toNumber, body) {
  try {
    // 1) Buscar doc userWhatsAppCloud/{userId}, caso você salve phoneNumberId + accessToken lá
    const docRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    const snap = await docRef.get();

    let phoneNumberId = process.env.FB_PHONE_NUMBER_ID;
    let accessToken = process.env.FB_ACCESS_TOKEN;

    if (snap.exists) {
      const data = snap.data();
      if (data.cloudPhoneNumberId) phoneNumberId = data.cloudPhoneNumberId;
      if (data.cloudAccessToken) accessToken = data.cloudAccessToken;
    }

    if (!phoneNumberId || !accessToken) {
      console.error("❌ Faltam phoneNumberId ou accessToken p/ Cloud API");
      return;
    }

    // 2) Montar payload
    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    const finalNumber = `+${toNumber.replace(/\D/g, "")}`;

    const payload = {
      messaging_product: "whatsapp",
      to: finalNumber,
      text: { body },
    };

    // 3) Chamar a API da Meta
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (resp.data && resp.data.messages) {
      console.log(
        "✅ Cloud API -> Mensagem Enviada. ID:",
        resp.data.messages[0].id
      );
    } else {
      console.error("⚠️ Resposta inesperada Cloud API:", resp.data);
    }
  } catch (error) {
    console.error(
      "❌ Erro ao enviar mensagem via Cloud API:",
      error.message || error
    );
  }
}
