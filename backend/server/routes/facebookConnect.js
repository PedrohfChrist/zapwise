// src/server/routes/facebookConnect.js
import express from "express";
import axios from "axios";
import { dbAdmin } from "../firebaseAdmin.js";

const router = express.Router();

/**
 * GET /api/facebook/connect?userId=xxxx
 *   1) Recebe userId
 *   2) Redireciona para a URL de autorização da Meta (o pop-up)
 */
router.get("/connect", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).send("Falta userId.");
  }

  // Monta a URL de onboarding do WhatsApp (Embedded Signup).
  // *Você precisa usar a doc oficial do WhatsApp Cloud* para o link exato.
  // Exemplo:
  const metaOnboardingUrl = `https://www.facebook.com/v14.0/dialog/whatsapp_onboarding
    ?app_id=${process.env.FB_APP_ID}
    &redirect_uri=${encodeURIComponent(process.env.FB_REDIRECT_URI)}
    &state=${userId}`;

  // Redireciona o usuário
  return res.redirect(metaOnboardingUrl);
});

/**
 * GET /api/facebook/callback
 *   - A Meta redireciona para essa rota com `code` e `state` (state = userId)
 *   - Trocamos `code` por `access_token` e pegamos `phone_number_id`
 *   - Salvamos no Firestore e retornamos uma tela de sucesso
 */
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send("Faltam parâmetros code/state.");
  }

  const userId = state;

  try {
    // Faz POST no endpoint de token do Facebook
    // De acordo com a doc oficial do WhatsApp Cloud
    const tokenResp = await axios.post(
      "https://graph.facebook.com/v14.0/oauth/access_token",
      {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        redirect_uri: process.env.FB_REDIRECT_URI,
        code,
      }
    );

    const accessToken = tokenResp.data.access_token;
    // Supondo que a API retorne "whatsapp_account": { phone_number_id: "1234" }
    const phoneNumberId = tokenResp.data.whatsapp_account?.phone_number_id;

    if (!accessToken || !phoneNumberId) {
      return res
        .status(500)
        .send("Não obtivemos accessToken e phoneNumberId corretamente.");
    }

    // Salva no Firestore => doc (ou renomeie p/ userWhatsAppCloud)
    const docRef = dbAdmin.collection("userWhatsAppCloud").doc(userId);
    await docRef.set(
      {
        userId,
        phoneNumberId,
        cloudPhoneNumberId: phoneNumberId,
        cloudAccessToken: accessToken,
      },
      { merge: true }
    );

    // Exibe tela de sucesso (pop-up). E fecha após alguns seg.
    return res.send(`
      <html>
        <body style="font-family: sans-serif; text-align:center; margin-top: 50px;">
          <h1>WhatsApp conectado com sucesso!</h1>
          <p>Pode fechar esta janela e voltar ao painel.</p>
          <script>setTimeout(() => { window.close(); }, 3000)</script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Erro callback FB:", err.response?.data || err.message);
    return res.status(500).send("Falha ao trocar code por token.");
  }
});

export default router;
