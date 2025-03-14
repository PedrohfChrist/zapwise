// src/utils/openaiApi.js
import axios from "axios";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/firebase/config";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 2000;

/**
 * Função não utilizada atualmente no projeto.
 * Se quiser chamá-la, basta importá-la no front ou no back.
 */
export const callOpenAIApi = async (
  prompt,
  userId,
  maxTokens = 2000,
  temperature = 0.7
) => {
  if (!userId) {
    throw new Error("O ID do usuário não foi fornecido.");
  }

  let retryDelay = INITIAL_RETRY_DELAY;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const generatedText = response.data.choices[0].message.content;

      // Exemplo simples de contagem (palavras, não tokens):
      const wordCount = generatedText.split(" ").length;

      // Atualizar contagem no Firestore (client side)
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        wordsGenerated: increment(wordCount),
      });

      return generatedText;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 429 &&
        attempt < MAX_RETRIES
      ) {
        console.warn(
          `Tentativa ${attempt} falhou com 429. Retentativa em ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
      } else {
        console.error("Erro ao chamar a API do OpenAI:", error);
        throw new Error("Erro ao gerar a copy. Tente novamente.");
      }
    }
  }
};
