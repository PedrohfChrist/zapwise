import { createContext, useContext } from "react";
import { useDocument } from "@/hooks/useDocument";

export const UserDocContext = createContext();

export function UserDocProvider({ children, user }) {
  const { document: userDoc } = useDocument("users", user.uid);

  return (
    <UserDocContext.Provider value={{ userDoc }}>
      {children}
    </UserDocContext.Provider>
  );
}

// Hook personalizado para usar o contexto UserDocContext
export const useUserDocContext = () => {
  const context = useContext(UserDocContext);
  if (!context) {
    throw new Error("useUserDocContext must be used within a UserDocProvider");
  }
  return context;
};
