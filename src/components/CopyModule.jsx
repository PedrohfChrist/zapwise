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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shadcn/components/ui/dropdown-menu";
import { callOpenAIApi } from "@/utils/openaiApi";

const CopyModule = ({ moduleType, fields, promptTemplate, initialData }) => {
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
  ); // Estado para o efeito de digitação
  const [error, setError] = useState(null);
  const { addDocument, response } = useFirestore("copies");
  const { addDocument: saveProject } = useFirestore("savedProjects"); // Função para salvar projeto
  const [isCopied, setIsCopied] = useState(false); // Estado para o efeito de cópia
  const [isDownloaded, setIsDownloaded] = useState(false); // Estado para o efeito de download
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento
  const [isSaved, setIsSaved] = useState(false); // Estado para indicar se o projeto foi salvo

  const timerRef = useRef(null); // Usar useRef para manter a referência do timer

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  useEffect(() => {
    if (generatedCopy) {
      smoothScrollToTop();
      setIsSaved(false); // Reabilita o botão de salvar para novas cópias
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
    setError(null);
    setDisplayedCopy(""); // Reseta o estado de exibição da copy
    setIsLoading(true); // Inicia o estado de carregamento
    try {
      const prompt = promptTemplate.replace(
        /\{(\w+)\}/g,
        (_, key) => formData[key] || ""
      );
      console.log("Prompt:", prompt); // Log do prompt para depuração
      const generatedCopy = await callOpenAIApi(prompt);
      console.log("Generated Copy:", generatedCopy); // Log da copy gerada para depuração
      setGeneratedCopy(generatedCopy);
      typeCopy(generatedCopy); // Chama a função para exibir a copy gradualmente

      // Garantir que moduleType seja uma string
      const moduleTypeString =
        typeof moduleType === "string"
          ? moduleType
          : Array.isArray(moduleType)
          ? moduleType.join(" | ")
          : typeof moduleType === "object"
          ? moduleType.type.name || "UnknownType"
          : "UnknownType";

      // Filtrar os dados antes de adicionar ao Firestore
      const dataToSave = {
        ...formData,
        moduleType: moduleTypeString,
        generatedCopy,
        createdAt: new Date(),
      };

      console.log("Document Data to Save:", dataToSave);
      const result = await addDocument(dataToSave);
      console.log("Document added:", result);
      if (response.success) {
        // Handle success
      }
    } catch (error) {
      console.error("Erro ao gerar a copy:", error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
    }
  };

  const handleSaveProject = async () => {
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

      console.log("Document Data to Save:", dataToSave);
      const result = await saveProject(dataToSave);
      console.log("Project saved:", result);
      if (result && result.type === "SUCCESS") {
        setIsSaved(true); // Indica que o projeto foi salvo
      }
    } catch (error) {
      console.error("Erro ao salvar o projeto:", error);
      setError(error.message);
    }
  };

  const typeCopy = (text) => {
    let index = 0;
    const speed = 20; // Ajuste a velocidade aqui (em milissegundos)

    // Pausa inicial de 50ms para evitar bug inicial
    setTimeout(() => {
      timerRef.current = setInterval(() => {
        setDisplayedCopy((prev) => prev + text.charAt(index));
        index++;
        if (index === text.length) {
          clearInterval(timerRef.current);
          setIsLoading(false); // Finaliza o estado de carregamento
        }
      }, speed);
    }, 50);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedCopy).then(
      () => {
        console.log("Texto copiado para a área de transferência!");
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
                  className={`w-full p-3 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary border placeholder-foreground/60 ${
                    selectedPersona && selectedPersona[field.name]
                      ? "bg-muted"
                      : ""
                  }`}
                />
              )}
              {field.type === "textarea" && (
                <Textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-md focus-visible:ring-offset-0 focus-visible:ring-0 focus:border-primary border placeholder-foreground/60 resize-none ${
                    selectedPersona && selectedPersona[field.name]
                      ? "bg-muted"
                      : ""
                  } ${field.size}`}
                  style={{ resize: "none", overflowY: "auto" }}
                />
              )}
              {field.type === "select" && (
                <Select
                  value={formData[field.name] || field.options[0]}
                  onValueChange={(value) =>
                    handleSelectChange(field.name, value)
                  }
                >
                  <SelectTrigger
                    className={`w-full p-3 rounded-md focus:border-primary border ${
                      selectedPersona && selectedPersona[field.name]
                        ? "bg-muted"
                        : ""
                    }`}
                  >
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
            disabled={isLoading} // Desabilita o botão enquanto está carregando
          >
            {isLoading ? "Carregando..." : "Gerar o conteúdo"}
          </Button>
        </div>
        <div className="w-full sm:w-3/5 p-5 rounded-lg shadow-md flex flex-col relative min-h-[500px]">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Resposta do CopyMax
          </h2>
          <div className="w-full flex-grow">
            <textarea
              className="w-full h-full p-4 rounded-md border focus:border-primary focus:outline-none bg-transparent resize-none"
              placeholder="A resposta gerada será exibida aqui..."
              style={{ resize: "none", overflowY: "auto", minHeight: "200px" }}
              value={displayedCopy}
              onChange={handleTextareaChange}
            />
          </div>
          <div className="flex justify-center space-x-2 mt-2 sm:justify-end">
            <button
              onClick={handleCopy}
              className={`py-2 px-3 rounded-md text-base font-normal border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md ${
                isCopied ? "border-foreground" : ""
              }`}
            >
              <ClipboardCopyIcon />
              Cópia
            </button>
            <button
              onClick={handleDownload}
              className={`py-2 px-3 rounded-md text-base font-normal border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md ${
                isDownloaded ? "border-foreground" : ""
              }`}
            >
              <DownloadIcon />
              Download
            </button>
            <Button
              onClick={handleSaveProject}
              className={`py-2 px-3 rounded-md text-base font-normal text-white border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md`}
              disabled={isSaved || !generatedCopy} // Desabilita o botão quando salvo ou sem conteúdo
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
