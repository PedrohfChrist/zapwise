// backend/server/controllers/metricsController.js
import { admin, dbAdmin } from "../firebaseAdmin.js"; // Precisamos do admin p/ Timestamp
import { handleError } from "../utils/errorHandler.js";
import {
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subDays,
} from "date-fns";

/**
 * Conta docs de automacoes com ativa=true
 */
export async function getActiveAutomacoesCount(userId) {
  const snap = await dbAdmin
    .collection("automacoes")
    .where("userId", "==", userId)
    .where("ativa", "==", true)
    .get();
  return snap.size;
}

/**
 * Conta quantos leads do user (coleção "leads", field userId)
 */
export async function getLeadsCount(userId) {
  const snap = await dbAdmin
    .collection("leads")
    .where("userId", "==", userId)
    .get();
  return snap.size;
}

/**
 * Distinct leads que mandaram mensagem (role="user") no período [start, end]
 */
export async function getAtendimentosByRange(userId, start, end) {
  // Converte as datas JS => admin.firestore.Timestamp
  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  const snap = await dbAdmin
    .collection("messageHistory")
    .where("userId", "==", userId)
    .where("role", "==", "user") // "user" => lead
    .where("timestamp", ">=", startTimestamp)
    .where("timestamp", "<=", endTimestamp)
    // .orderBy("timestamp")  // orderBy antes do where pode dar erro se não tiver index
    .get();

  const leadSet = new Set();
  snap.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.leadId) {
      leadSet.add(data.leadId);
    }
  });
  return leadSet.size; // quantos leads distintos
}

/**
 * Total de mensagens (role = "user" ou "assistant") no período
 */
export async function getMessagesCountByRange(userId, start, end) {
  const startTimestamp = admin.firestore.Timestamp.fromDate(start);
  const endTimestamp = admin.firestore.Timestamp.fromDate(end);

  const snap = await dbAdmin
    .collection("messageHistory")
    .where("userId", "==", userId)
    .where("timestamp", ">=", startTimestamp)
    .where("timestamp", "<=", endTimestamp)
    .get();
  return snap.size;
}

/**
 * Controller principal que retorna as métricas
 */
export async function getMetrics(req, res) {
  try {
    const { userId, period = "diario" } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId" });
    }

    // 1) automacoesAtivas e leadsCount
    const [automacoesAtivas, leadsCount] = await Promise.all([
      getActiveAutomacoesCount(userId),
      getLeadsCount(userId),
    ]);

    // 2) Range de datas
    const now = new Date();
    let start, end;

    if (period === "mensal") {
      // Exemplo: este mês
      start = startOfMonth(now);
      end = endOfMonth(now);
    } else {
      // "diario" => últimos 7 dias
      end = endOfDay(now);
      start = subDays(end, 6);
      start = startOfDay(start);
    }

    // 3) Distinct leads + total msgs
    const [atendimentos, messagesCount] = await Promise.all([
      getAtendimentosByRange(userId, start, end),
      getMessagesCountByRange(userId, start, end),
    ]);

    return res.json({
      automacoesAtivas,
      leadsCount,
      atendimentos,
      messagesCount,
    });
  } catch (error) {
    return handleError(res, error, "Erro ao obter métricas.");
  }
}
