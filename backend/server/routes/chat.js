// src/server/routes/chat.js
import express from "express";
import { OpenAI } from "openai";
import { handleError } from "../utils/errorHandler.js";
import { admin, dbAdmin } from "../firebaseAdmin.js";
import { getEmbedding } from "../services/embeddingService.js";
import { countTextTokens } from "../utils/tokenCounter.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/interagir", async (req, res) => {
  try {
    const {
      userId,
      historico = [],
      mensagem,
      contexto,
      perguntasRespostas,
      estiloLinguagem = "Amigável",
      idioma = "Português",
      model = "gpt-4o-mini",
      maxTokens = 150,
      temperature = 0.8,
    } = req.body;

    if (!userId) {
      return res.status(403).json({ error: "Necessário userId no body." });
    }

    // 1) Buscar subscription
    const subRef = dbAdmin.collection("subscriptions").doc(userId);
    const subSnap = await subRef.get();
    if (!subSnap.exists) {
      return res.status(403).json({ error: "Assinatura não encontrada." });
    }

    const subData = subSnap.data();
    if (subData.status !== "ACTIVE") {
      return res
        .status(403)
        .json({ error: "Assinatura inativa ou expirada. Renovar?" });
    }

    const now = new Date();
    const renewalDate = subData.renewalDate
      ? new Date(subData.renewalDate)
      : null;
    if (!renewalDate || renewalDate < now) {
      return res
        .status(403)
        .json({ error: "Assinatura expirada. Por favor, renovar." });
    }

    // 2) Checar tokens
    const usedTokens = subData.wordsGenerated ?? 0;
    const planLimit = 100000; // único plano: 100k tokens/mês
    if (usedTokens >= planLimit) {
      return res.status(403).json({
        error: "Você atingiu o limite de tokens mensais (100k).",
      });
    }

    if (!mensagem) {
      return res.status(400).json({
        error: "Campo 'mensagem' é obrigatório para interação com a IA.",
      });
    }

    //3) Preparar prompt
    let resumoHistorico = "";
    if (historico.length > 10) {
      const ultimasMensagens = historico
        .slice(-5)
        .map((m) => m.content)
        .join(" ");
      const embedding = await getEmbedding(ultimasMensagens);
      resumoHistorico =
        "Resumo do histórico (embedding parcial): " +
        JSON.stringify(embedding.slice(0, 5)) +
        "...";
    }

    const systemMessageContent = `
Você é um assistente virtual altamente capacitado, especialista em copywriting e estratégias persuasivas.
Utilize o seguinte contexto para auxiliar o usuário: ${contexto}
${resumoHistorico}
Responda de forma ${estiloLinguagem} e em ${idioma}.
Perguntas/Respostas de apoio: ${JSON.stringify(perguntasRespostas)}
(Seu prompt fixo aprimorado...)
    `.trim();

    const messages = [
      { role: "system", content: systemMessageContent },
      ...historico,
      { role: "user", content: mensagem },
    ];

    // 4) Chamar OpenAI
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    });
    const resposta = response.choices[0].message.content.trim() || "";

    // 5) Contar tokens gerados
    const tokenCount = countTextTokens(resposta, model);
    await subRef.update({
      wordsGenerated: admin.firestore.FieldValue.increment(tokenCount),
    });

    return res.json({ resposta });
  } catch (error) {
    console.error("Erro ao interagir com a IA:", error);
    return handleError(res, error, "Erro ao processar solicitação de chat.");
  }
});

export default router;
