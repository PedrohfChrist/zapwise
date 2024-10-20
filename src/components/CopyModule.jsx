import React, { useState, useEffect, useRef } from "react";
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
import { useFirestore } from "@/hooks/useFirestore";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  ChevronDownIcon,
  ClipboardCopyIcon,
  DownloadIcon,
  StarIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import WarningBar from "./WarningBar";
import { Link } from "react-router-dom";
import { usePersonas } from "@/contexts/PersonaContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext"; // Importa o contexto de assinatura
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shadcn/components/ui/dropdown-menu";
import { callOpenAIApi } from "@/utils/openaiApi";
import Typed from "typed.js";

const CopyModule = ({ moduleType, fields, promptTemplate, initialData }) => {
  const { user } = useAuthContext(); // Obtém o usuário autenticado
  const { subscriptionStatus } = useSubscriptionContext(); // Obtém o status da assinatura

  const { personas, selectedPersona, selectPersona, clearSelectedPersona } =
    usePersonas();

  const [formData, setFormData] = useState(
    initialData ||
      fields.reduce((acc, field) => {
        acc[field.name] = field.default || "";
        return acc;
      }, {})
  );
  const [generatedCopy, setGeneratedCopy] = useState(
    initialData?.generatedCopy || ""
  );
  const [displayedCopy, setDisplayedCopy] = useState(
    initialData?.generatedCopy || ""
  );
  const [error, setError] = useState(null);
  const { addDocument, response } = useFirestore("copies");
  const { addDocument: saveProject } = useFirestore("savedProjects");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const typedRef = useRef(null);

  const canAccess = subscriptionStatus.isPaid || subscriptionStatus.isAdmin; // Verifica se o usuário pode acessar

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll para o topo da página
  }, []);

  useEffect(() => {
    if (generatedCopy) {
      smoothScrollToTop();
      setIsSaved(false);
      typeCopy(generatedCopy);
    }
  }, [generatedCopy]);

  const smoothScrollToTop = () => {
    const scrollToTop = () => {
      const position =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (position > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, position - position / 8);
      }
    };
    scrollToTop();
  };

  useEffect(() => {
    if (selectedPersona) {
      const updatedFormData = { ...formData };
      fields.forEach((field) => {
        if (selectedPersona[field.name]) {
          updatedFormData[field.name] = selectedPersona[field.name];
        }
      });
      setFormData(updatedFormData);
    }
  }, [selectedPersona, fields]);

  useEffect(() => {
    return () => {
      setFormData(
        fields.reduce((acc, field) => {
          acc[field.name] = field.default || "";
          return acc;
        }, {})
      );
      clearSelectedPersona();
    };
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleTextareaChange = (e) => {
    setDisplayedCopy(e.target.value);
  };

  const handleSubmit = async () => {
    if (!canAccess) {
      setError("Você precisa de um plano ativo para usar esta funcionalidade.");
      return;
    }

    setError(null);
    setDisplayedCopy("");
    setIsLoading(true);

    try {
      const prompt = promptTemplate.replace(
        /\{(\w+)\}/g,
        (_, key) => formData[key] || ""
      );
      const generatedCopy = await callOpenAIApi(prompt, user.uid);
      setGeneratedCopy(generatedCopy);

      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao gerar a copy:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    if (!canAccess) {
      setError("Você precisa de um plano ativo para usar esta funcionalidade.");
      return;
    }

    setError(null);
    try {
      const moduleTypeString =
        typeof moduleType === "string"
          ? moduleType
          : Array.isArray(moduleType)
          ? moduleType.join(" | ")
          : typeof moduleType === "object"
          ? moduleType.type.name || "UnknownType"
          : "UnknownType";

      const dataToSave = {
        ...formData,
        moduleType: moduleTypeString,
        generatedCopy,
        createdAt: new Date(),
      };

      const result = await saveProject(dataToSave);
      if (result && result.type === "SUCCESS") {
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Erro ao salvar o projeto:", error);
      setError(error.message);
    }
  };

  const typeCopy = (text) => {
    if (typedRef.current) {
      typedRef.current.destroy();
    }
    typedRef.current = new Typed("#displayedCopy", {
      strings: [text],
      typeSpeed: 10,
      showCursor: false,
      onComplete: () => {
        setIsLoading(false);
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedCopy).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 100);
      },
      (err) => {
        console.error("Erro ao copiar o texto: ", err);
      }
    );
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([displayedCopy], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "copy.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 100);
  };

  return (
    <div className="p-5">
      <WarningBar />
      <div className="flex justify-end">
        <Link to="/home">
          <button className="mt-28 mr-5 py-2 px-3 rounded-md text-sm font-medium text-primary border border-primary items-center gap-2 transform duration-200 hover:bg-input">
            Voltar
          </button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-6 mt-4">
        <div className="w-full sm:w-2/5 p-5 rounded-lg shadow-md flex flex-col bg-background mb-4 sm:mb-0">
          <h1 className="text-xl font-semibold mb-6">{moduleType}</h1>

          {/* Dropdown de Personas */}
          <div className="mb-5">
            <DropdownMenu>
              <DropdownMenuTrigger className="py-2 px-2 rounded-md flex items-center gap-2 bg-primary text-white focus-visible:outline-none hover:bg-primary/90">
                <StarIcon />
                <span className="text-sm font-normal">Minhas personas</span>
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {personas &&
                  personas.map((persona) => (
                    <DropdownMenuItem
                      key={persona.id}
                      onSelect={() => selectPersona(persona.id)}
                    >
                      {persona.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {field.type === "text" && (
                <Input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={!canAccess} // Desabilita se o plano não for ativo
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  disabled={!canAccess} // Desabilita se o plano não for ativo
                  className="w-full p-3 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary border placeholder-foreground/60 resize-none"
                />
              )}
              {field.type === "select" && (
                <Select
                  value={formData[field.name] || field.options[0]}
                  onValueChange={(value) =>
                    handleSelectChange(field.name, value)
                  }
                  disabled={!canAccess} // Desabilita se o plano não for ativo
                >
                  <SelectTrigger className="w-full p-3 rounded-md focus:border-primary border">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <Button
            onClick={handleSubmit}
            className="w-full py-2 mt-auto text-white rounded-md"
            disabled={!canAccess || isLoading}
          >
            {isLoading ? "Carregando..." : "Gerar o conteúdo"}
          </Button>
        </div>
        <div className="w-full sm:w-3/5 p-5 rounded-lg shadow-md flex flex-col relative min-h-[500px]">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Resposta do CopyMax
          </h2>
          <div className="w-full flex-grow">
            <div
              id="displayedCopy"
              className="w-full h-full p-4 rounded-md border focus:border-primary focus:outline-none bg-transparent resize-none"
              style={{ minHeight: "200px", whiteSpace: "pre-wrap" }}
            ></div>
          </div>
          <div className="flex justify-center space-x-2 mt-2 sm:justify-end">
            <button
              onClick={handleCopy}
              className={`py-2 px-3 rounded-md text-base font-normal border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md ${
                isCopied ? "border-foreground" : ""
              }`}
              disabled={!canAccess}
            >
              <ClipboardCopyIcon />
              Cópia
            </button>
            <button
              onClick={handleDownload}
              className={`py-2 px-3 rounded-md text-base font-normal border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md ${
                isDownloaded ? "border-foreground" : ""
              }`}
              disabled={!canAccess}
            >
              <DownloadIcon />
              Download
            </button>
            <Button
              onClick={handleSaveProject}
              className="py-2 px-3 rounded-md text-base font-normal text-white border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md"
              disabled={!canAccess || isSaved || !generatedCopy}
            >
              <BookmarkIcon />
              {isSaved ? "Salvo" : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyModule;
