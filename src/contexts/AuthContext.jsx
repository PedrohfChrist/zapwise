import { createContext, useReducer, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import axios from "axios";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: JSON.parse(localStorage.getItem("user")) || null,
    authIsReady: false,
  });

  const setUser = useCallback((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "AUTH_IS_READY", payload: user });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          await axios.post("https://createuser-sfveflcfxq-uc.a.run.app", {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
        } catch (error) {
          console.error("Erro ao criar usuário no Firestore:", error);
        }
      }
    });

    return () => unsub();
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
