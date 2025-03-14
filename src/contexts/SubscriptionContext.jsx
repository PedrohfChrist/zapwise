import React, { createContext, useContext, useEffect, useState } from "react";
import { useDocument } from "@/hooks/useDocument";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { differenceInDays } from "date-fns";

export const SubscriptionContext = createContext();

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider."
    );
  }
  return context;
};

export function SubscriptionProvider({ children, user }) {
  const { document: subscriptionDoc } = useDocument("subscriptions", user?.uid);

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    status: "LOADING",
    plan: "",
    renewalDate: null,
    wordsGenerated: 0,
    planLimit: 100000, // Mensal ou Anual => ambos 100k
    isExpired: false,
    daysLeft: 0,
  });

  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (!subscriptionDoc) return;

    const { status, plan, renewalDate, wordsGenerated = 0 } = subscriptionDoc;

    let planLimit = 100000; // p/ ambos

    let renewalDt;
    if (renewalDate?.toDate) {
      renewalDt = renewalDate.toDate();
    } else {
      renewalDt = renewalDate ? new Date(renewalDate) : null;
    }

    const now = new Date();
    let isExpired = false;
    let daysLeft = 0;

    if (status !== "ACTIVE" || !renewalDt || renewalDt < now) {
      isExpired = true;
    }
    if (renewalDt) {
      const diff = differenceInDays(renewalDt, now);
      daysLeft = diff > 0 ? diff : 0;
    }

    setSubscriptionStatus({
      status,
      plan,
      renewalDate: renewalDt,
      wordsGenerated,
      planLimit,
      isExpired,
      daysLeft,
    });
  }, [subscriptionDoc]);

  // Se expirada => criar notificação 1x
  useEffect(() => {
    if (!user?.uid) return;
    if (subscriptionStatus.status === "LOADING") return;

    if (subscriptionStatus.isExpired && !notificationSent) {
      createExpirationNotification(user.uid);
      setNotificationSent(true);
    }
  }, [subscriptionStatus, user?.uid, notificationSent]);

  const createExpirationNotification = async (uid) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: uid,
        message: "Sua assinatura está expirada. Clique aqui para renovar.",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
