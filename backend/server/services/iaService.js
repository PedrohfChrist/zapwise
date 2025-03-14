// src/server/services/iaService.js
import axios from "axios";
import { getMessageHistory } from "./messageService.js";

export async function gerarRespostaIA(receivedMsg, automacao, userId, lead) {
  // Carrega histórico do lead
  const historico = await getMessageHistory(lead.id);

  try {
    const resp = await axios.post("https://zapwise.com.br/api/chat/interagir", {
      userId,
      historico,
      mensagem: receivedMsg,
      contexto: automacao.contexto,
      perguntasRespostas: automacao.perguntasRespostas,
      estiloLinguagem: automacao.estiloLinguagem,
      idioma: automacao.idioma,
    });
    return resp.data.resposta || "Desculpe, não entendi.";
  } catch (err) {
    console.error("Erro ao chamar IA:", err.message);
    return "Desculpe, houve um erro no servidor de IA.";
  }
}
