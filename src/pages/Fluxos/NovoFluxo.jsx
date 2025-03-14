import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { db } from "@/firebase/config";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Tags comuns usadas para o ponto de partida
const tagsComuns = [
  "Boleto Gerado",
  "Cadastro Feito",
  "Pagamento Recusado",
  "Compra Realizada",
];

export default function NovoFluxo() {
  const [step, setStep] = useState(1); // Controla a etapa atual
  const [nomeFluxo, setNomeFluxo] = useState("");
  const [tagInicial, setTagInicial] = useState(tagsComuns[0]); // Valor inicial para a tag
  const navigate = useNavigate();
  const { user } = useAuthContext(); // Pega o usuário autenticado

  // Função para salvar o fluxo no Firestore
  const salvarFluxo = async () => {
    if (user && nomeFluxo.trim()) {
      try {
        // Cria o fluxo e pega o ID do documento recém-criado
        const docRef = await addDoc(collection(db, "fluxos"), {
          nome: nomeFluxo,
          userId: user.uid,
          tagInicial, // Tag inicial selecionada
          tipo: "", // Tipo de fluxo, caso adicione isso
          pontos: [], // Fluxo será criado com pontos posteriormente
        });

        // Redireciona para a página de configuração do fluxo com o ID do documento
        navigate(`/fluxos/config/${docRef.id}`);
      } catch (e) {
        console.error("Erro ao salvar fluxo: ", e);
      }
    }
  };

  // Renderizar o conteúdo baseado na etapa
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Nome do Fluxo
            </h2>
            <Input
              value={nomeFluxo}
              onChange={(e) => setNomeFluxo(e.target.value)}
              placeholder="Nome do fluxo"
              className="mb-6 w-72"
            />
            <Button
              onClick={() => setStep(2)} // Avança para a próxima etapa
              className="w-72"
              disabled={!nomeFluxo.trim()}
            >
              Próximo
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Selecione a Tag Inicial
            </h2>
            <Select value={tagInicial} onValueChange={setTagInicial}>
              <SelectTrigger className="w-72 mb-6">
                <SelectValue placeholder="Tag de Público-Alvo" />
              </SelectTrigger>
              <SelectContent>
                {tagsComuns.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-between w-72">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-[48%]"
              >
                Voltar
              </Button>
              <Button onClick={salvarFluxo} className="w-[48%]">
                Criar Fluxo
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-lg p-6 rounded-md w-full sm:w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Crie um novo fluxo
        </h1>
        {renderStepContent()}
      </div>
    </div>
  );
}
