import React, { createContext, useContext, useEffect, useState } from "react";
import { useDocument } from "@/hooks/useDocument";
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
  const { document: subscriptionDoc } = useDocument("subscriptions", user.uid);

  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isAdmin: false,
    isFreeTrial: false,
    isPaid: false,
    daysLeft: 0,
    wordsGenerated: 0,
    planLimit: 0,
  });

  useEffect(() => {
    if (user.uid === "Y05s3draE8NnHgOLPlUbqLeOdlH2") {
      // Se for a conta de administrador, definir acesso total
      setSubscriptionStatus({
        isAdmin: true,
        isPaid: true,
        daysLeft: Infinity,
        wordsGenerated: 0,
        planLimit: Infinity,
      });
    } else if (subscriptionDoc) {
      const { status, plan, renewalDate, wordsGenerated } = subscriptionDoc;

      const today = new Date();
      const renewal = renewalDate.toDate();
      const isPaid = status === "ACTIVE";

      const planLimit =
        plan === "Plano Starter"
          ? 20000
          : plan === "Plano Premium"
          ? 100000
          : plan === "Plano Pro"
          ? 300000
          : 0;

      const daysLeft = differenceInDays(renewal, today);

      setSubscriptionStatus({
        isAdmin: false,
        isPaid,
        daysLeft: daysLeft > 0 ? daysLeft : 0,
        wordsGenerated: wordsGenerated || 0,
        planLimit,
      });
    }
  }, [subscriptionDoc, user.uid]);

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
