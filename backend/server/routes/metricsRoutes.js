// src/server/routes/metricsRoutes.js
import express from "express";
import { getMetrics } from "../controllers/metricsController.js";

const router = express.Router();

/**
 * GET /api/metrics?userId=xxx&period=diario
 * ou GET /api/metrics?userId=xxx&period=mensal
 */
router.get("/", getMetrics);

export default router;
