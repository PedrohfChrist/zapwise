// src/utils/openaiApi.js
import axios from "axios";

// Obtenha a chave da API do OpenAI a partir das variáveis de ambiente
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 2000; // 2 segundos

// Função para chamar a API do OpenAI com o modelo GPT-4o
export const callOpenAIApi = async (
  prompt,
  maxTokens = 2000, // Aumentado para 500 tokens
  temperature = 0.7
) => {
  let retryDelay = INITIAL_RETRY_DELAY;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o", // Alterado para GPT-4o
          messages: [{ role: "user", content: prompt }],
          max_tokens: maxTokens,
          temperature: temperature,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 429 &&
        attempt < MAX_RETRIES
      ) {
        console.warn(
          `Attempt ${attempt} failed with status 429. Retrying after ${retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2; // Aumenta o tempo de retry exponencialmente
      } else {
        console.error("Erro ao chamar a API do OpenAI:", error);
        throw new Error("Erro ao gerar a copy. Tente novamente.");
      }
    }
  }
};
