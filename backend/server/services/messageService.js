// src/server/services/messageService.js
import { dbAdmin } from "../firebaseAdmin.js";

export async function saveMessageHistory(leadId, userId, role, content) {
  try {
    const ref = dbAdmin.collection("messageHistory");
    await ref.add({
      leadId,
      userId,
      role,
      content,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Erro ao salvar histórico:", err);
  }
}

export async function getMessageHistory(leadId) {
  const ref = dbAdmin.collection("messageHistory");
  const snap = await ref
    .where("leadId", "==", leadId)
    .orderBy("timestamp")
    .get();
  const arr = [];
  snap.forEach((docSnap) => {
    arr.push({
      role: docSnap.data().role,
      content: docSnap.data().content,
    });
  });
  return arr;
}
