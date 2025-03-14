import { useState } from "react";
import axios from "axios";

export default function useChatGPT(config = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarMensagem = async ({
    historico = [],
    mensagem,
    contexto,
    perguntasRespostas,
    estiloLinguagem = "Amigável",
    idioma = "Português",
    model = "gpt-4o-mini",
    maxTokens = 150,
    temperature = 0.7,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/chat/interagir", {
        historico,
        mensagem,
        contexto,
        perguntasRespostas,
        estiloLinguagem,
        idioma,
        model,
        maxTokens,
        temperature,
      });
      return response.data.resposta;
    } catch (error) {
      setError("Erro ao se comunicar com a IA");
      console.error("Erro:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { enviarMensagem, loading, error };
}
