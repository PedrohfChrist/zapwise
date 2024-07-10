import React, { useState } from "react";
import WarningBar from "@/components/WarningBar";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Textarea } from "@/shadcn/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shadcn/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/shadcn/components/ui/alert-dialog";
import { TrashIcon, PlusIcon, PersonIcon } from "@radix-ui/react-icons";
import { usePersonas } from "@/contexts/PersonaContext";

export default function Persona() {
  const {
    personas,
    addDocument,
    updateDocument,
    deleteDocument,
    selectPersona,
  } = usePersonas();
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: "",
    niche: "",
    subniche: "",
    targetAge: "",
    targetGender: "",
    mainPromise: "",
    rootProblem: "",
    mechanism: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPersona({ ...newPersona, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewPersona({ ...newPersona, [name]: value });
  };

  const handleAddPersona = () => {
    addDocument(newPersona).then((res) => {
      if (res.type === "SUCCESS") {
        setNewPersona({
          name: "",
          niche: "",
          subniche: "",
          targetAge: "",
          targetGender: "",
          mainPromise: "",
          rootProblem: "",
          mechanism: "",
        });
        setIsDialogOpen(false);
      }
    });
  };

  const handleEditPersona = (index) => {
    setNewPersona(personas[index]);
    setSelectedPersona(index);
    setIsDialogOpen(true);
  };

  const handleSaveEditPersona = () => {
    if (selectedPersona !== null) {
      const personaId = personas[selectedPersona].id;
      updateDocument(personaId, newPersona).then((res) => {
        if (res.type === "SUCCESS") {
          setSelectedPersona(null);
          setNewPersona({
            name: "",
            niche: "",
            subniche: "",
            targetAge: "",
            targetGender: "",
            mainPromise: "",
            rootProblem: "",
            mechanism: "",
          });
          setIsDialogOpen(false);
        }
      });
    }
  };

  const handleDeletePersona = () => {
    const personaId = personas[selectedPersona].id;
    deleteDocument(personaId).then((res) => {
      if (res.type === "SUCCESS") {
        setSelectedPersona(null);
        setIsDialogOpen(false);
        setIsAlertDialogOpen(false);
      }
    });
  };

  return (
    <div className="p-5 w-full relative">
      <div
        className={`  ${
          isAlertDialogOpen ? "fixed inset-0 bg-black bg-opacity-50" : ""
        } ${isDialogOpen ? "fixed inset-0 bg-black bg-opacity-50" : ""}`}
      >
        <WarningBar disabled={isDialogOpen || isAlertDialogOpen} />
      </div>
      <div className="mt-28">
        <h1 className="font-semibold text-2xl mb-10">Personas criadas</h1>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          }}
        >
          <div
            className="p-4 rounded-xl bg-card min-h-[200px] relative cursor-pointer shadow-md border border-bordapedro flex flex-col justify-center items-center"
            onClick={() => {
              setSelectedPersona(null);
              setIsDialogOpen(true);
            }}
          >
            <PlusIcon className="w-7 h-7 text-primary font-semibold" />
            <p className="text-primary mt-2 font-semibold">Criar persona</p>
          </div>
          {personas &&
            personas.map((persona, index) => (
              <div key={index} className="relative">
                <div
                  className="shadow-md border border-bordapedro p-4 rounded-lg cursor-pointer min-h-[200px] flex flex-col justify-center items-center"
                  onClick={() => {
                    handleEditPersona(index);
                    selectPersona(persona.id);
                  }}
                >
                  <PersonIcon className="" />
                  <h2 className="font-semibold text-lg mt-2">{persona.name}</h2>
                </div>
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedPersona(index);
                    setIsAlertDialogOpen(true);
                  }}
                >
                  <TrashIcon className="text-destructive" />
                </Button>
              </div>
            ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPersona !== null
                  ? "Editar persona"
                  : "Adicionar nova persona"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label>
                Qual o nome do seu produto?
                <Input
                  name="name"
                  placeholder="Ex.: Metabolismo Ativo."
                  value={newPersona.name}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary"
                />
              </label>
              <label>
                Qual é o seu nicho?
                <Input
                  name="niche"
                  placeholder="Ex.: Saúde."
                  value={newPersona.niche}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary"
                />
              </label>
              <label>
                Qual é o seu subniche?
                <Input
                  name="subniche"
                  placeholder="Ex.: Emagrecimento por meio de uma dieta sem restrições."
                  value={newPersona.subniche}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary"
                />
              </label>
              <label>
                Qual a idade do seu público alvo?
                <Select
                  value={newPersona.targetAge}
                  onValueChange={(value) =>
                    handleSelectChange("targetAge", value)
                  }
                >
                  <SelectTrigger className="p-2 rounded-md focus:border-primary">
                    <SelectValue placeholder="Selecione a idade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18-24</SelectItem>
                    <SelectItem value="25-34">25-34</SelectItem>
                    <SelectItem value="35-44">35-44</SelectItem>
                    <SelectItem value="45-54">45-54</SelectItem>
                    <SelectItem value="55-64">55-64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label>
                Qual é o gênero do Público Alvo?
                <Select
                  value={newPersona.targetGender}
                  onValueChange={(value) =>
                    handleSelectChange("targetGender", value)
                  }
                >
                  <SelectTrigger className="p-2 rounded-md focus:border-primary">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Homens">Homens</SelectItem>
                    <SelectItem value="Mulheres">Mulheres</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label>
                Qual é a Promessa Principal?
                <Textarea
                  name="mainPromise"
                  placeholder="Ex.: Perca 5 quilos em 30 dias sem restrições com nosso método de emagrecimento Metabolismo Ativo, feito para mulheres de 34 a 50 anos."
                  value={newPersona.mainPromise}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary resize-none "
                />
              </label>
              <label>
                Qual a Raiz do Problema do seu público?
                <Textarea
                  name="rootProblem"
                  placeholder="Ex.: A raiz do problema está no metabolismo lento das mulheres, devido ao envelhecimento e à falta de nutrientes essenciais. Isso leva ao acúmulo de gordura e dificulta a perda de peso mesmo com dietas restritivas."
                  value={newPersona.rootProblem}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary resize-none"
                />
              </label>
              <label>
                Qual o Mecanismo Único que resolve este problema?
                <Textarea
                  name="mechanism"
                  placeholder="Ex.: A solução para esse problema é o Metabolismo Ativo, um programa que reeduca o metabolismo feminino através de um plano alimentar personalizado, incluindo alimentos termogênicos e exercícios para acelerar a queima de gordura."
                  value={newPersona.mechanism}
                  onChange={handleInputChange}
                  className="p-2 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary resize-none"
                />
              </label>
              <Button
                onClick={
                  selectedPersona !== null
                    ? handleSaveEditPersona
                    : handleAddPersona
                }
                className="text-white"
              >
                {selectedPersona !== null ? "Salvar alterações" : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialogContent className="opacity-100">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            </AlertDialogHeader>
            <p>Você tem certeza que deseja excluir esta persona?</p>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePersona}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
