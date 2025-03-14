// backend/server/controllers/automacaoController.js
import { dbAdmin } from "../firebaseAdmin.js"; // Importa o admin, dbAdmin
import { handleError } from "../utils/errorHandler.js";

/**
 * POST /api/automacoes
 * Body: {
 *   userId,
 *   nome,
 *   contexto,
 *   perguntasRespostas,
 *   estiloLinguagem,
 *   idioma,
 *   ativa (opcional)
 * }
 */
export async function criarAutomacaoRoot(req, res) {
  try {
    const {
      userId,
      nome,
      contexto,
      perguntasRespostas,
      estiloLinguagem,
      idioma,
      ativa,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Falta userId no body." });
    }

    // Montamos o objeto que vamos salvar
    const data = {
      userId,
      nome: nome || "Minha Automação",
      contexto: contexto || "",
      perguntasRespostas: perguntasRespostas || [],
      estiloLinguagem: estiloLinguagem || "Amigável",
      idioma: idioma || "Português",
      ativa: ativa || false,
    };

    // Usamos dbAdmin, não firebase/firestore
    const colRef = dbAdmin.collection("automacoes");
    const newDocRef = await colRef.add(data);

    return res.status(201).json({ id: newDocRef.id, ...data });
  } catch (error) {
    return handleError(res, error, "Erro ao criar automação.");
  }
}

/**
 * GET /api/automacoes?userId=xxx
 * Retorna todas as automacoes desse user
 */
export async function listarAutomacoesRoot(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId na query." });
    }

    const snap = await dbAdmin
      .collection("automacoes")
      .where("userId", "==", userId)
      .get();

    const list = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return res.json(list);
  } catch (error) {
    return handleError(res, error, "Erro ao listar automações.");
  }
}

/**
 * PUT /api/automacoes/:autoId
 * Body: { ...campos a atualizar... }
 */
export async function atualizarAutomacaoRoot(req, res) {
  try {
    const { autoId } = req.params;
    const atualizacoes = req.body;

    if (!autoId) {
      return res.status(400).json({ error: "Falta autoId na URL." });
    }

    const docRef = dbAdmin.collection("automacoes").doc(autoId);
    await docRef.update(atualizacoes);

    return res.json({ id: autoId, ...atualizacoes });
  } catch (error) {
    return handleError(res, error, "Erro ao atualizar automação.");
  }
}

/**
 * DELETE /api/automacoes/:autoId
 */
export async function deletarAutomacaoRoot(req, res) {
  try {
    const { autoId } = req.params;
    if (!autoId) {
      return res.status(400).json({ error: "Falta autoId na URL." });
    }

    const docRef = dbAdmin.collection("automacoes").doc(autoId);
    await docRef.delete();

    return res.json({
      success: true,
      message: "Automação deletada com sucesso.",
    });
  } catch (error) {
    return handleError(res, error, "Erro ao deletar automação.");
  }
}

/**
 * PUT /api/automacoes/toggle-ia
 * Body: { userId }
 * -> Acha a primeira automacao do user e inverte o campo "ativa"
 */
export async function toggleIA(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId no body." });
    }

    const colRef = dbAdmin.collection("automacoes");
    const snap = await colRef.where("userId", "==", userId).get();

    if (snap.empty) {
      return res
        .status(404)
        .json({ error: "Nenhuma automação encontrada para este user." });
    }

    // Pegamos a primeira doc
    const firstDoc = snap.docs[0];
    const oldData = firstDoc.data();
    const newValue = !oldData.ativa;

    await firstDoc.ref.update({ ativa: newValue });

    return res.json({
      success: true,
      message: `Automação agora está ${newValue ? "ativada" : "desativada"}.`,
      ativa: newValue,
    });
  } catch (error) {
    return handleError(res, error, "Erro ao togglear IA.");
  }
}

export async function retomarIA(req, res) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Falta userId no body." });
    }

    const snap = await dbAdmin
      .collection("automacoes")
      .where("userId", "==", userId)
      .get();
    if (snap.empty) {
      return res
        .status(404)
        .json({ error: "Nenhuma automação encontrada para este user." });
    }
    const docSnap = snap.docs[0];
    await docSnap.ref.update({ pausada: false });

    return res.json({ success: true, message: "IA retomada com sucesso." });
  } catch (error) {
    return handleError(res, error, "Erro ao retomar IA.");
  }
}
