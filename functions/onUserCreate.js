const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

async function sendWebhook(payload) {
  // URL do webhook sem parâmetros na URL
  const url =
    "https://webhook.sellflux.app/webhook/custom/lead/22872122c6be252e15c87a7da83312a5?name=name&email=email&phone=phone";

  console.log("URL do Webhook:", url); // Log da URL do Webhook

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Webhook enviado com sucesso:", response.data);
  } catch (error) {
    console.error(
      "Erro ao enviar webhook:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Falha ao enviar webhook");
  }
}

exports.onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const userId = context.params.userId;

    console.log("Novo usuário criado:", userId);

    const payload = {
      name: data.name || "Nome não fornecido",
      email: data.email || "email@exemplo.com",
      phone: data.phone || "(99) 99999-9999",
    };

    // Log do payload para verificação
    console.log("Payload enviado:", payload);

    await sendWebhook(payload);

    return null;
  });
