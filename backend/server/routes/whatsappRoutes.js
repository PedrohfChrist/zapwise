// routes/whatsappRoutes.js
import express from "express";
import axios from "axios";
import { handleError } from "../utils/errorHandler.js";

const router = express.Router();

router.post("/test-connection", async (req, res) => {
  const { phoneNumberId, accessToken, testNumber } = req.body;
  if (!phoneNumberId || !accessToken || !testNumber) {
    return res.status(400).send({ success: false, error: "Faltam dados" });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: testNumber,
        type: "text",
        text: { body: "Teste de conexão bem-sucedido!" },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.messages) {
      return res.send({ success: true });
    } else {
      return res
        .status(500)
        .send({ success: false, error: "Resposta inesperada da API" });
    }
  } catch (error) {
    console.error(
      "Erro no test-connection:",
      error.response?.data || error.message
    );
    return handleError(res, error, "Falha ao enviar mensagem de teste.");
  }
});

export default router;
