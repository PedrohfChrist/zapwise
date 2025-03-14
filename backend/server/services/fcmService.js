import { admin, dbAdmin } from "../firebaseAdmin.js";

/**
 * Envia notificação FCM e salva no Firestore
 */
export async function sendFCMNotification(userId, title, body) {
  try {
    const tokens = await getUserFCMTokens(userId);
    if (!tokens.length) {
      console.log("Nenhum token FCM para user:", userId);
      return;
    }

    const payload = {
      notification: {
        title,
        body,
      },
      data: {
        userId, // Pode ser útil para outras ações
      },
    };

    // Envia push
    await admin.messaging().sendToDevice(tokens, payload);
    console.log("Notificação FCM enviada com sucesso!");

    // Agora, salvamos a notificação no Firestore
    const notificationRef = dbAdmin.collection("notifications").doc();
    await notificationRef.set({
      userId: userId,
      message: body,
      title: title,
      read: false, // Notificação começa como não lida
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Notificação salva no Firestore!");
  } catch (error) {
    console.error("Erro ao enviar FCM:", error);
  }
}

async function getUserFCMTokens(userId) {
  const tokensRef = dbAdmin.collection("userFcmTokens");
  const snap = await tokensRef.where("userId", "==", userId).get();
  if (snap.empty) return [];
  return snap.docs.map((doc) => doc.data().token);
}
