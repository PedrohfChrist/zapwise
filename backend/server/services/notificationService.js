// src/server/services/notificationService.js
import { dbAdmin } from "../firebaseAdmin.js";

export async function createNotification(userId, message) {
  try {
    const ref = dbAdmin.collection("notifications");
    await ref.add({
      userId,
      message,
      read: false,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Erro ao criar notificação:", err);
  }
}
