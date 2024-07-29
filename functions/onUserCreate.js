const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Para gerar identificador único

if (admin.apps.length === 0) {
  admin.initializeApp();
}

async function sendWebhook(payload) {
  // URL do webhook no formato fixo fornecido
  const url =
    "https://webhook.sellflux.app/webhook/custom/lead/2ee5d020b7e8a31c99797b4798825dc6?name=name&email=email&phone=phone";
  console.log("URL do Webhook:", url); // Log da URL do Webhook

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Webhook enviado com sucesso para Sellflux:", response.data);
  } catch (error) {
    console.error(
      "Erro ao enviar webhook para Sellflux:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Falha ao enviar webhook para Sellflux");
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
      transaction_id: uuidv4(), // Adicionando um identificador único ao payload
    };

    // Log do payload para verificação
    console.log("Payload enviado:", payload);

    await sendWebhook(payload);

    try {
      await snap.ref.update({
        fbc: admin.firestore.FieldValue.delete(),
        fbp: admin.firestore.FieldValue.delete(),
        user_agent: admin.firestore.FieldValue.delete(),
      });
    } catch (error) {
      console.error("Erro ao deletar campos do usuário", error);
    }

    return null;
  });
