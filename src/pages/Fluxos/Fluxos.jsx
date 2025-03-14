import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Fluxos() {
  const [fluxos, setFluxos] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Função para redirecionar para a criação de um novo fluxo
  const criarNovoFluxo = () => {
    navigate("/fluxos/novo");
  };

  // Carregar fluxos do usuário
  useEffect(() => {
    const carregarFluxos = async () => {
      if (user) {
        const fluxosRef = collection(db, "fluxos");
        const q = query(fluxosRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fluxosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFluxos(fluxosData);
      }
    };

    carregarFluxos();
  }, [user]);

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Fluxos</h1>

      {/* Botão para criar novo fluxo */}
      <Button onClick={criarNovoFluxo} className="mb-6 flex items-center">
        <PlusIcon className="mr-2" />
        Criar Novo Fluxo
      </Button>

      {/* Listagem de fluxos criados */}
      {fluxos.length === 0 ? (
        <p className="text-gray-500">Nenhum fluxo criado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fluxos.map((fluxo) => (
            <Card
              key={fluxo.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/fluxos/config/${fluxo.id}`)}
              style={{ height: "100px", padding: "" }} 
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-md font-semibold">
                  {fluxo.nome}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p
                  className={`text-sm ${
                    fluxo.ativo ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {fluxo.ativo ? "Ativado" : "Ainda não foi ativado"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
