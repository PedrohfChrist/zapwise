// hooks/useSignup.js

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db, timestamp } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useQuery } from "./useQuery";
import { getCookie } from "@/utils/getCookie";

export const useSignup = () => {
  const queryParams = useQuery();
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, whatsappNumber, name) => {
    setError(null);
    setIsPending(true);

    try {
      // Verificar se o número de WhatsApp já está em uso
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("whatsappNumber", "==", whatsappNumber.replace("+", ""))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("WhatsApp number already in use");
      }

      // Criar o usuário
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res || !res.user) {
        setIsPending(false);
        throw new Error("Não foi possível realizar o cadastro.");
      }

      // Adicionar o nome de exibição ao usuário
      await updateProfile(res.user, { displayName: name });

      // Criar um documento do usuário no Firestore
      const createdAt = timestamp;

      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        online: true,
        createdAt,
        email: email,
        name: name,
        whatsappNumber: whatsappNumber.replace("+", ""), // Salvar o número normalizado
        user_agent: navigator.userAgent,
        origin: window.location.href.split("?")[0],
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        utm: {
          source: queryParams.get("utm_source") || getCookie("utm_source"),
          medium: queryParams.get("utm_medium") || getCookie("utm_medium"),
          campaign:
            queryParams.get("utm_campaign") || getCookie("utm_campaign"),
          term: queryParams.get("utm_term") || getCookie("utm_term"),
          content: queryParams.get("utm_content") || getCookie("utm_content"),
        },
        sck: queryParams.get("sck") || getCookie("sck"),
      });

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      // Update state
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

  return { error, isPending, signup };
};
