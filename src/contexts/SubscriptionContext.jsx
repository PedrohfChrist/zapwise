import React, { createContext, useContext, useState, useEffect } from "react";
import { useDocument } from "@/hooks/useDocument";

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

  const defaultSubscriptionStatus = {
    isFreeTrial: false,
    isPaid: false,
    daysLeft: 0,
  };

  const subscriptionStatus = subscriptionDoc || defaultSubscriptionStatus;

  return (
    <SubscriptionContext.Provider value={{ subscriptionStatus }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
