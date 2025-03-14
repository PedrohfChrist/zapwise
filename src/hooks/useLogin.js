// hooks/useLogin.js

import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { getCookie } from "@/utils/getCookie";
import { useQuery } from "./useQuery";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const queryParams = useQuery();

  const checkUserDoc = async (uid) => {
    const userRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(userRef);

    return docSnapshot.exists();
  };

  const authenticateWithGoogle = async (action) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await signInWithPopup(auth, googleProvider);

      if (action === "login") {
        const userRef = doc(db, "users", res.user.uid);
        await updateDoc(userRef, { online: true });
        dispatch({ type: "LOGIN", payload: res.user });
      } else {
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          const exists = await checkUserDoc(res.user.uid);

          if (exists) {
            const userRef = doc(db, "users", res.user.uid);
            await updateDoc(userRef, {
              online: true,
              user_agent: navigator.userAgent,
              origin: window.location.href.split("?")[0],
              fbp: getCookie("_fbp"),
              fbc: getCookie("_fbc"),
              utm: {
                source:
                  queryParams.get("utm_source") || getCookie("utm_source"),
                medium:
                  queryParams.get("utm_medium") || getCookie("utm_medium"),
                campaign:
                  queryParams.get("utm_campaign") || getCookie("utm_campaign"),
                term: queryParams.get("utm_term") || getCookie("utm_term"),
                content:
                  queryParams.get("utm_content") || getCookie("utm_content"),
              },
              sck: queryParams.get("sck") || getCookie("sck"),
            });
            dispatch({ type: "LOGIN", payload: res.user });
            break;
          }

          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera 1 segundo entre tentativas
        }

        if (attempts === maxAttempts) {
          throw new Error("Max attempts reached. User doc was not created.");
        }
      }

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      console.error(err.message);
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  const login = async (identifier, password) => {
    setError(null);
    setIsPending(true);

    try {
      let email = identifier.trim().toLowerCase();

      // Verificar se o identificador é um número de WhatsApp
      const isPhoneNumber = /^[\d+]{8,15}$/.test(email.replace(/\s+/g, ""));

      if (isPhoneNumber) {
        // Normalizar o número de telefone
        const whatsappNumber = email.replace(/\s+/g, "").replace("+", "");

        // Buscar o usuário pelo número de WhatsApp no Firestore
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("whatsappNumber", "==", whatsappNumber)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          email = userDoc.data().email;
        } else {
          throw new Error("WhatsApp number not found");
        }
      }

      // Prosseguir com o login usando email e senha
      const res = await signInWithEmailAndPassword(auth, email, password);

      const userRef = doc(db, "users", res.user.uid);

      await updateDoc(userRef, { online: true });

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      console.error(err.message);
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { login, authenticateWithGoogle, error, isPending };
};
