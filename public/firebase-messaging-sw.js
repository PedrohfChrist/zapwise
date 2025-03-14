/// public/firebase-messaging-sw.js

/* global self, firebase */

importScripts(
  "https://www.gstatic.com/firebasejs/9.17.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.17.2/firebase-messaging-compat.js"
);

// A mesma config do seu projeto
firebase.initializeApp({
  apiKey: "AIzaSyAy8DyXVX1SBBwInhtf448tYJJznBGOqsU",
  authDomain: "whatbot-ai.firebaseapp.com",
  projectId: "whatbot-ai",
  storageBucket: "whatbot-ai.firebasestorage.app",
  messagingSenderId: "723461466098",
  appId: "1:723461466098:web:228933fd768f088855ad6b",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Recebeu msg background: ", payload);
  const notificationTitle = payload.notification.title || "Notificação";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
