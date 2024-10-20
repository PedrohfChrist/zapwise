import { auth } from "@/firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const authenticateWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    return user;
  } catch (error) {
    // Verifica se o erro é do tipo popup fechado pelo usuário
    if (error.code === "auth/popup-closed-by-user") {
      console.warn("O usuário fechou o popup antes de completar o login.");
      // Você pode exibir uma mensagem de feedback para o usuário aqui
      alert("O login foi cancelado. Por favor, tente novamente.");
    } else {
      console.error("Erro na autenticação com Google: ", error);
      throw error;
    }
  }
};
