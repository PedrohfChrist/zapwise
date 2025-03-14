import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/shadcn/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shadcn/components/ui/accordion";
import { PlusIcon, Cross1Icon } from "@radix-ui/react-icons";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/hooks/useAuthContext";

// HOOK useDocument APENAS LÊ, sem criar automaticamente
import { useDocument } from "@/hooks/useDocument";

export default function Automacoes() {
  const { user } = useAuthContext();

  // Lê doc userWhatsAppCloud/{uid}, se existir, exibe phoneNumber
  const { document: userWhatsAppCloudDoc } = useDocument(
    "userWhatsAppCloud",
    user?.uid
  );
  const userPhoneNumber = userWhatsAppCloudDoc?.userPhoneNumber || "";

  // Lista de automações e automação ativa
  const [automacoes, setAutomacoes] = useState([]);
  const [activeAutomacao, setActiveAutomacao] = useState(null);

  // Controle do modal/config
  const [mostrarConfiguracao, setMostrarConfiguracao] = useState(false);
  const [etapa, setEtapa] = useState(1);

  // Campos de automação
  const [nomeAutomacao, setNomeAutomacao] = useState("");
  const [contexto, setContexto] = useState("");
  const [perguntasRespostas, setPerguntasRespostas] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Auxiliares de Pergunta/Resposta
  const [novaPergunta, setNovaPergunta] = useState("");
  const [novaResposta, setNovaResposta] = useState("");

  // Caso seja edição, guardamos a automacao atual
  const [currentAutomacao, setCurrentAutomacao] = useState(null);

  // ─────────────────────────────────────────────────────────
  // 1) Carrega automacoes do Firestore
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const carregarAutomacoes = async () => {
      const ref = collection(db, "automacoes");
      const qRef = query(ref, where("userId", "==", user.uid));
      const snap = await getDocs(qRef);
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAutomacoes(list);

      // Se já tem alguma ativa
      const ativa = list.find((auto) => auto.ativa);
      setActiveAutomacao(ativa || null);
    };
    carregarAutomacoes();
  }, [user]);

  // ─────────────────────────────────────────────────────────
  // 2) Funções de criar/editar automacao
  // ─────────────────────────────────────────────────────────
  const resetFormulario = () => {
    setEtapa(1);
    setNomeAutomacao("");
    setContexto("");
    setNovaPergunta("");
    setNovaResposta("");
    setPerguntasRespostas([]);
    setEditIndex(null);
    setCurrentAutomacao(null);
  };

  const handleAbrirConfig = (auto) => {
    // Clicou numa automação existente => editar
    setNomeAutomacao(auto.nome || "");
    setContexto(auto.contexto || "");
    setPerguntasRespostas(auto.perguntasRespostas || []);
    setCurrentAutomacao(auto);
    setEtapa(1);
    setMostrarConfiguracao(true);
  };

  const salvarAutomacao = async () => {
    if (!user) return;
    const data = {
      nome: nomeAutomacao,
      contexto,
      perguntasRespostas,
      ativa: false, // sempre inicia inativa
      userId: user.uid,
    };

    try {
      if (currentAutomacao) {
        // Edição
        const docRef = doc(db, "automacoes", currentAutomacao.id);
        await updateDoc(docRef, data);
        setAutomacoes((prev) =>
          prev.map((a) =>
            a.id === currentAutomacao.id ? { ...a, ...data } : a
          )
        );
      } else {
        // Nova
        const newDocRef = await addDoc(collection(db, "automacoes"), data);
        const newAuto = { id: newDocRef.id, ...data };
        setAutomacoes((prev) => [...prev, newAuto]);
      }
    } catch (err) {
      console.error("Erro ao salvar automação:", err);
    } finally {
      setMostrarConfiguracao(false);
      resetFormulario();
    }
  };

  // ─────────────────────────────────────────────────────────
  // 3) Ativar/Desativar automação
  // ─────────────────────────────────────────────────────────
  const ativarAutomacao = async (autoId) => {
    if (!user) return;

    // Se já tiver outra ativa, exija desativar antes
    if (activeAutomacao && activeAutomacao.id !== autoId) {
      alert(
        "Você já tem uma automação ativa. Desative-a antes de ativar outra."
      );
      return;
    }

    try {
      const docRef = doc(db, "automacoes", autoId);
      await updateDoc(docRef, { ativa: true });
      const updated = automacoes.map((a) =>
        a.id === autoId ? { ...a, ativa: true } : { ...a, ativa: false }
      );
      setAutomacoes(updated);
      const newActive = updated.find((a) => a.ativa);
      setActiveAutomacao(newActive || null);
    } catch (err) {
      console.error("Erro ao ativar automacao:", err);
    }
  };

  const desativarAutomacao = async (autoId) => {
    if (!user) return;
    try {
      const docRef = doc(db, "automacoes", autoId);
      await updateDoc(docRef, { ativa: false });
      const updated = automacoes.map((a) =>
        a.id === autoId ? { ...a, ativa: false } : a
      );
      setAutomacoes(updated);
      if (activeAutomacao && activeAutomacao.id === autoId) {
        setActiveAutomacao(null);
      }
    } catch (err) {
      console.error("Erro ao desativar automacao:", err);
    }
  };

  // ─────────────────────────────────────────────────────────
  // 4) Gerenciar Perguntas/Respostas
  // ─────────────────────────────────────────────────────────
  const salvarPerguntaResposta = () => {
    if (!novaPergunta || !novaResposta) return;
    let updated = [...perguntasRespostas];

    if (editIndex !== null) {
      updated[editIndex] = { pergunta: novaPergunta, resposta: novaResposta };
      setEditIndex(null);
    } else {
      updated.push({ pergunta: novaPergunta, resposta: novaResposta });
    }
    setPerguntasRespostas(updated);
    setNovaPergunta("");
    setNovaResposta("");
  };

  const editarPerguntaResposta = (idx) => {
    const item = perguntasRespostas[idx];
    setNovaPergunta(item.pergunta);
    setNovaResposta(item.resposta);
    setEditIndex(idx);
  };

  const excluirPerguntaResposta = (idx) => {
    setPerguntasRespostas(perguntasRespostas.filter((_, i) => i !== idx));
  };

  // ─────────────────────────────────────────────────────────
  // 5) Navegação do Wizard
  // ─────────────────────────────────────────────────────────
  const handleProximo = () => setEtapa((prev) => prev + 1);
  const handleVoltar = () => setEtapa((prev) => prev - 1);

  return (
    <div className="p-6 w-full">
      {/* Título principal */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Automações por I.A
      </h1>

      {/* Botão criar nova automação */}
      <Button
        onClick={() => {
          setMostrarConfiguracao(true);
          setEtapa(1);
          resetFormulario();
        }}
        className="mb-6 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <PlusIcon className="mr-2" />
        Criar Nova Automação
      </Button>

      {/* Se existe automacao ativa */}
      {!mostrarConfiguracao && activeAutomacao && (
        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 rounded">
          <p className="text-green-700 font-medium">
            <strong>Automação ativa:</strong> {activeAutomacao.nome}
          </p>
        </div>
      )}

      {/* Wizard de Configuração */}
      {mostrarConfiguracao && (
        <div className="p-6 w-full max-w-4xl mx-auto bg-white shadow-md rounded-md relative">
          <button
            onClick={() => setMostrarConfiguracao(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <Cross1Icon width={24} height={24} />
          </button>

          <h2 className="text-xl font-semibold mb-6 text-center">
            {currentAutomacao
              ? "Editar Automação"
              : "Configuração da Nova Automação"}
          </h2>

          {/* Botões de step */}
          <div className="flex justify-center space-x-2 mb-6">
            {["Configurações", "Contexto", "Perguntas", "Salvar"].map(
              (label, index) => (
                <Button
                  key={index}
                  onClick={() => setEtapa(index + 1)}
                  variant={etapa === index + 1 ? "primary" : "outline"}
                >
                  {label}
                </Button>
              )
            )}
          </div>

          <Card className="p-6">
            {/* STEP 1 */}
            {etapa === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="block text-gray-700 font-medium">
                    Nome da Automação
                    <input
                      type="text"
                      className="w-full mt-2 p-2 border rounded"
                      placeholder="Digite um nome"
                      value={nomeAutomacao}
                      onChange={(e) => setNomeAutomacao(e.target.value)}
                    />
                  </label>

                  {/* Exemplo de mostrar phoneNumber do user, se existir */}
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Número WhatsApp:</strong>{" "}
                    {userPhoneNumber || "(nenhum cadastrado no config)"}
                  </p>
                </CardContent>
              </>
            )}

            {/* STEP 2 */}
            {etapa === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Contexto da Empresa/Produto</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="w-full p-2 border rounded h-32"
                    placeholder="Descreva o contexto que a IA deve saber..."
                    value={contexto}
                    onChange={(e) => setContexto(e.target.value)}
                  />
                </CardContent>
              </>
            )}

            {/* STEP 3 */}
            {etapa === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Perguntas e Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <label className="block text-sm font-medium">
                    Pergunta
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded"
                      value={novaPergunta}
                      onChange={(e) => setNovaPergunta(e.target.value)}
                      placeholder="Ex: Qual é o prazo de entrega?"
                    />
                  </label>
                  <label className="block text-sm font-medium mt-3">
                    Resposta
                    <Textarea
                      type="text"
                      value={novaResposta}
                      onChange={(e) => setNovaResposta(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                      placeholder="Digite a resposta para a pergunta..."
                    />
                  </label>
                  <Button
                    onClick={salvarPerguntaResposta}
                    className="mt-4 w-full"
                    variant="outline"
                  >
                    {editIndex !== null ? "Atualizar" : "Adicionar"}{" "}
                    Pergunta/Resposta
                  </Button>

                  {/* Lista Q&A salvos */}
                  {perguntasRespostas.length > 0 && (
                    <div className="mt-6">
                      <Accordion type="single" collapsible>
                        {perguntasRespostas.map((item, idx) => (
                          <AccordionItem key={idx} value={`q-${idx}`}>
                            <AccordionTrigger>{item.pergunta}</AccordionTrigger>
                            <AccordionContent>
                              <p className="mb-2">{item.resposta}</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => editarPerguntaResposta(idx)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => excluirPerguntaResposta(idx)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  )}
                </CardContent>
              </>
            )}

            {/* STEP 4 */}
            {etapa === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Salvar Configuração</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={salvarAutomacao}
                  >
                    {currentAutomacao
                      ? "Salvar Alterações"
                      : "Salvar Automação"}
                  </Button>
                </CardContent>
              </>
            )}
          </Card>

          <div className="flex justify-between mt-6">
            {etapa > 1 && (
              <Button variant="outline" onClick={handleVoltar}>
                Voltar
              </Button>
            )}
            {etapa < 4 && (
              <Button variant="outline" onClick={handleProximo}>
                Próximo
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Lista de Automações (fora do config) */}
      {!mostrarConfiguracao && automacoes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {automacoes.map((auto) => {
            const isActive = auto.ativa === true;
            return (
              <Card
                key={auto.id}
                className="p-4 flex justify-between items-center rounded-lg shadow cursor-pointer"
                onClick={() => handleAbrirConfig(auto)}
              >
                <div>
                  <CardTitle className="text-md font-semibold">
                    {auto.nome}
                  </CardTitle>
                </div>
                <Button
                  size="sm"
                  variant={isActive ? "secondary" : "primary"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) {
                      desativarAutomacao(auto.id);
                    } else {
                      ativarAutomacao(auto.id);
                    }
                  }}
                >
                  {isActive ? "Desativar" : "Ativar"}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
