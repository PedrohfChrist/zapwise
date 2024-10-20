// PersonaContext.jsx
import React, { createContext, useContext, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Certifique-se de que o db esteja importado corretamente

const PersonaContext = createContext();

export const usePersonas = () => {
  return useContext(PersonaContext);
};

export const PersonaProvider = ({ children }) => {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const addDocument = async (persona) => {
    try {
      const docRef = await addDoc(collection(db, "personas"), persona);
      setPersonas((prev) => [...prev, { id: docRef.id, ...persona }]);
      return { type: "SUCCESS", payload: docRef };
    } catch (error) {
      return { type: "ERROR", payload: error };
    }
  };

  const updateDocument = async (id, updatedPersona) => {
    try {
      const docRef = doc(db, "personas", id);
      await updateDoc(docRef, updatedPersona);
      setPersonas((prev) =>
        prev.map((persona) =>
          persona.id === id ? { ...persona, ...updatedPersona } : persona
        )
      );
      return { type: "SUCCESS", payload: id };
    } catch (error) {
      return { type: "ERROR", payload: error };
    }
  };

  const deleteDocument = async (id) => {
    try {
      const docRef = doc(db, "personas", id);
      await deleteDoc(docRef);
      setPersonas((prev) => prev.filter((persona) => persona.id !== id));
      return { type: "SUCCESS", payload: id };
    } catch (error) {
      return { type: "ERROR", payload: error };
    }
  };

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
        addDocument, // Adicione essas funções aqui
        updateDocument,
        deleteDocument,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};
