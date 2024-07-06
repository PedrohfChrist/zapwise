import React, { createContext, useContext, useState } from "react";
import { useCollection } from "@/hooks/useCollection";
import { useFirestore } from "@/hooks/useFirestore";

const PersonaContext = createContext();

export const usePersonas = () => {
  return useContext(PersonaContext);
};

const PersonaProvider = ({ children }) => {
  const { documents: personas, error } = useCollection("personas");
  const { addDocument, updateDocument, deleteDocument } =
    useFirestore("personas");
  const [selectedPersona, setSelectedPersona] = useState(null);

  const selectPersona = (personaId) => {
    const selected = personas.find((persona) => persona.id === personaId);
    setSelectedPersona(selected || null);
  };

  const clearSelectedPersona = () => {
    setSelectedPersona(null);
  };

  return (
    <PersonaContext.Provider
      value={{
        personas,
        addDocument,
        updateDocument,
        deleteDocument,
        selectedPersona,
        selectPersona,
        clearSelectedPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};

export default PersonaProvider;
