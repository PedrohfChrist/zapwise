import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useFirestore } from "./useFirestore";

export const useSubcollection = (coll, id, subcoll) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const { addDocument: logError } = useFirestore("errors");

  useEffect(() => {
    if (!coll || !id || !subcoll) return;

    const q = query(collection(db, `${coll}/${id}/${subcoll}`));

    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        let results = [];
        querySnapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        setDocuments(results);
        setError(null);
      },
      (err) => {
        setError(err.message);
        console.log(err.message);
        logError({
          error: err.message,
          documentId: id,
          collection: coll,
          where: "useSubcollection",
        });
      }
    );

    return () => unsub();
  }, [coll, id, subcoll]);

  return { documents, error };
};
