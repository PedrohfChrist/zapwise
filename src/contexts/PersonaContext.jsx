// PersonaContext.jsx
import React, { createContext, useContext, useState } from "react";

const PersonaContext = createContext();

export const usePersonas = () => {
  return useContext(PersonaContext);
};

export const PersonaProvider = ({ children }) => {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const selectPersona = (id) => {
    const persona = personas.find((p) => p.id === id);
    setSelectedPersona(persona);
  };

  const clearSelectedPersona = () => {
    setSelectedPersona(null);
  };

  return (
    <PersonaContext.Provider
      value={{
        personas,
        selectedPersona,
        selectPersona,
        clearSelectedPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};
