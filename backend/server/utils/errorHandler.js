// src/server/utils/errorHandler.js

/**
 * handleError - Centraliza e padroniza retorno de erros
 * @param {object} res - objeto response do Express
 * @param {Error} error - objeto de erro capturado
 * @param {string} customMessage - mensagem customizada para contexto
 * @param {number} status - status code (opcional, default 500)
 */
export function handleError(
  res,
  error,
  customMessage = "Erro no servidor",
  status = 500
) {
  console.error(`[ERROR] ${customMessage}`, error); // Log detalhado
  return res.status(status).json({
    error: customMessage,
    details: error?.message || String(error),
  });
}
