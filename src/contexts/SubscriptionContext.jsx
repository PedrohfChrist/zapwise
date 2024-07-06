import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useAuthContext } from "@/hooks/useAuthContext";

const SubscriptionContext = createContext();

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

const SubscriptionProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isFreeTrial: true,
    isPaid: false,
    daysLeft: 3,
  });

  useEffect(() => {
    if (user) {
      const fetchSubscriptionStatus = async () => {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setSubscriptionStatus({
            isFreeTrial: data.isFreeTrial ?? true,
            isPaid: data.isPaid ?? false,
            daysLeft: data.daysLeft ?? 3,
          });
        } else {
          // Set initial subscription status for new users
          const initialStatus = {
            isFreeTrial: true,
            isPaid: false,
            daysLeft: 3,
            name: user.displayName || "",
            email: user.email || "",
          };
          await setDoc(userRef, initialStatus);
          setSubscriptionStatus(initialStatus);
        }
      };

      fetchSubscriptionStatus();
    }
  }, [user]);

  useEffect(() => {
    if (
      user &&
      subscriptionStatus.isFreeTrial &&
      subscriptionStatus.daysLeft > 0
    ) {
      const interval = setInterval(async () => {
        setSubscriptionStatus((prevStatus) => {
          const newDaysLeft = prevStatus.daysLeft - 1;
          if (newDaysLeft <= 0) {
            clearInterval(interval);
            return { ...prevStatus, isFreeTrial: false, daysLeft: 0 };
          }
          return { ...prevStatus, daysLeft: newDaysLeft };
        });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          daysLeft: subscriptionStatus.daysLeft - 1,
          isFreeTrial: subscriptionStatus.daysLeft - 1 > 0,
        });
      }, 24 * 60 * 60 * 1000); // Decrementa a cada 24 horas

      return () => clearInterval(interval);
    }
  }, [user, subscriptionStatus]);

  const handlePaymentSuccess = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isPaid: true,
        isFreeTrial: false,
      });
      setSubscriptionStatus((prevStatus) => ({
        ...prevStatus,
        isPaid: true,
        isFreeTrial: false,
      }));
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptionStatus,
        setSubscriptionStatus,
        handlePaymentSuccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
