// src/hooks/useFCM.js
import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { db, app } from "@/firebase/config"; // agora "app" está exportado

export function useFCM(user) {
  useEffect(() => {
    if (!user?.uid) return;
    const requestFCMPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const messaging = getMessaging(app);
          const swRegistration = await navigator.serviceWorker.ready;
          const fcmToken = await getToken(messaging, {
            vapidKey:
              "BBgiPw5ZOzoG9cZf2ZKOUf79f1Cu_OavyxtvGV9gP5wfUdVq3nSVat5j4gkyh6stpy7Hakx6t_U6si9WhQb9LG4",
            serviceWorkerRegistration: swRegistration,
          });

          if (fcmToken) {
            await setDoc(doc(db, "userFcmTokens", fcmToken), {
              userId: user.uid, // Necessário para passar nas Regras
              token: fcmToken,
              createdAt: new Date(),
            });
          }
        }
      } catch (error) {
        console.error("Erro ao obter token FCM:", error);
      }
    };
    requestFCMPermission();
  }, [user]);

  useEffect(() => {
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Recebeu mensagem no foreground:", payload);
      // Aqui você pode exibir um toast ou outra UI para notificar o usuário.
    });
    return unsubscribe;
  }, []);
}
