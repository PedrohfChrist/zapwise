import express from "express";
import { queryRelevantDocuments } from "../services/embeddingService.js";
import { handleError } from "../utils/errorHandler.js";

const router = express.Router();

/**
 * [1] Buscar documentos relevantes para a query
 */
router.post("/query", async (req, res) => {
  try {
    const { queryText } = req.body;
    if (!queryText) {
      return res.status(400).json({ error: "Falta queryText no body." });
    }
    const results = await queryRelevantDocuments(queryText, 3);
    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    return handleError(res, error, "Erro ao buscar documentos relevantes.");
  }
});

export default router;
