// src/server/services/automacaoService.js
import { dbAdmin } from "../firebaseAdmin.js";

export async function getActiveAutomacaoByUserId(userId) {
  const ref = dbAdmin.collection("automacoes");
  const snap = await ref
    .where("userId", "==", userId)
    .where("ativa", "==", true)
    .get();
  if (!snap.empty) {
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}
