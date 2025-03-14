import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import { useParams } from "react-router-dom";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

// Opções de ações e regras
const regras = [
  { label: "Se/Senão", value: "se_senao" },
  { label: "Atraso de Tempo", value: "atraso_tempo" },
];

const acoes = [
  { label: "Enviar Mensagem", value: "enviar_mensagem" },
  { label: "Adicionar Tag", value: "adicionar_tag" },
  { label: "Remover Tag", value: "remover_tag" },
];

const NovoFluxoConfig = () => {
  const { fluxoId } = useParams(); // Pega o ID do fluxo da URL
  const [blocos, setBlocos] = useState([]);
  const [exibirOpcoes, setExibirOpcoes] = useState(false); // Controla a exibição das opções de regras e ações

  const adicionarBloco = (tipo) => {
    const novoBloco = {
      id: blocos.length + 1,
      tipo,
      configurado: false, // O bloco começa sem estar configurado
    };
    setBlocos([...blocos, novoBloco]);
    setExibirOpcoes(false); // Esconde as opções após adicionar um bloco
  };

  const abrirConfiguracaoBloco = (id) => {
    const bloco = blocos.find((bl) => bl.id === id);
    if (bloco.tipo === "enviar_mensagem") {
      // Abrir um campo para o usuário configurar a mensagem
    }
  };

  const salvarPonto = async () => {
    try {
      const fluxoRef = doc(db, "fluxos", fluxoId);
      await updateDoc(fluxoRef, {
        pontos: arrayUnion(...blocos),
      });
      // Mensagem de sucesso
    } catch (error) {
      console.error("Erro ao salvar pontos:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Configurar Fluxo</h1>

      {/* Bloco inicial mostrando a tag inicial */}
      <div className="mb-6 bg-gray-100 border border-gray-300 p-4 rounded-md w-full sm:w-3/4 lg:w-1/2 text-center">
        <p className="font-semibold">
          Contato marcado com a tag: <strong>customer</strong>
        </p>
      </div>

      {/* Exibição dos blocos criados */}
      <div className="relative flex flex-col items-center gap-4 w-full sm:w-3/4 lg:w-1/2">
        {blocos.map((bloco, index) => (
          <div key={bloco.id} className="relative w-full">
            <div
              className="bg-white border border-gray-300 p-4 rounded-md w-full text-center cursor-pointer hover:shadow-md"
              onClick={() => abrirConfiguracaoBloco(bloco.id)}
            >
              <p>
                {bloco.tipo === "enviar_mensagem"
                  ? "Enviar Mensagem"
                  : bloco.tipo === "se_senao"
                  ? "Se/Senão"
                  : "Outro"}
              </p>
            </div>
            {/* Linhas de conexão */}
            {index < blocos.length - 1 && (
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-400 top-full"></div>
            )}
          </div>
        ))}

        {/* Adicionar novo ponto de jornada */}
        <div
          className="mb-4 border-dashed border-2 border-gray-400 p-4 rounded-md w-full text-center cursor-pointer"
          onClick={() => setExibirOpcoes(!exibirOpcoes)} // Alterna a exibição das opções
        >
          + Adicionar um ponto de jornada
        </div>

        {/* Seleção de regras e ações, só aparece ao clicar */}
        {exibirOpcoes && (
          <div className="mb-6 w-full sm:w-3/4 lg:w-1/2 bg-white p-4 rounded-md shadow-md">
            <p className="font-semibold mb-4 text-center">
              Selecione uma regra ou ação
            </p>
            <div className="grid grid-cols-2 gap-4">
              {regras.map((regra) => (
                <Button
                  key={regra.value}
                  onClick={() => adicionarBloco(regra.value)}
                  className="w-full"
                >
                  {regra.label}
                </Button>
              ))}
              {acoes.map((acao) => (
                <Button
                  key={acao.value}
                  onClick={() => adicionarBloco(acao.value)}
                  className="w-full"
                >
                  {acao.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botão para salvar pontos */}
      <Button onClick={salvarPonto} className="mt-6 w-full sm:w-3/4 lg:w-1/2">
        Salvar Fluxo
      </Button>
    </div>
  );
};

export default NovoFluxoConfig;
