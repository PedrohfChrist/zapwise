// src/server/routes/automacoesRoutes.js
import express from "express";
import {
  criarAutomacaoRoot,
  listarAutomacoesRoot,
  atualizarAutomacaoRoot,
  deletarAutomacaoRoot,
  toggleIA,
  retomarIA,
} from "../controllers/automacaoController.js";

const router = express.Router();

// Rota para retomar IA (deve vir antes de rotas dinâmicas)
router.put("/retomar-ia", retomarIA);
/**
 * POST /api/automacoes
 * Body: { userId, nome, ... }
 */
router.post("/", criarAutomacaoRoot);

/**
 * GET /api/automacoes?userId=xxx
 */
router.get("/", listarAutomacoesRoot);

/**
 * CUIDADO NA ORDEM:
 * Coloque a ROTA FIXA "/toggle-ia" ANTES DA ROTA DINÂMICA "/:autoId"
 */
router.put("/toggle-ia", toggleIA);

/**
 * PUT /api/automacoes/:autoId
 */
router.put("/:autoId", atualizarAutomacaoRoot);

/**
 * DELETE /api/automacoes/:autoId
 */
router.delete("/:autoId", deletarAutomacaoRoot);

export default router;
