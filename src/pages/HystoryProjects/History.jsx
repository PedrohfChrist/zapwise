import React, { useState, useCallback, useEffect } from "react";
import WarningBar from "@/components/WarningBar";
import { useFirestore } from "@/hooks/useFirestore";
import {
  ClipboardCopyIcon,
  DownloadIcon,
  TrashIcon,
  BookmarkIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/shadcn/components/ui/button";
import { Textarea } from "@/shadcn/components/ui/textarea";
import { useToast } from "@/shadcn/components/ui/use-toast";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { useAuthContext } from "@/hooks/useAuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; // Certifique-se de importar corretamente o db

export default function History() {
  const [selectedProject, setSelectedProject] = useState(null);
  const {
    documents,
    error,
    deleteDocument,
    addDocument: saveCopy,
  } = useFirestore("copies");
  const { addDocument: saveProject, documents: savedProjects } =
    useFirestore("savedProjects");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [savedStatus, setSavedStatus] = useState(() => {
    const saved = localStorage.getItem("savedStatus");
    return saved ? JSON.parse(saved) : {};
  });
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [planStatus, setPlanStatus] = useState(null); // Estado para verificar o plano
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin

  useEffect(() => {
    const fetchPlanStatus = async () => {
      const subscriptionRef = doc(db, "subscriptions", user.uid);
      const subscriptionDoc = await getDoc(subscriptionRef);
      if (subscriptionDoc.exists()) {
        const subscriptionData = subscriptionDoc.data();
        setPlanStatus(subscriptionData);
        if (user.uid === "Y05s3draE8NnHgOLPlUbqLeOdlH2") {
          setIsAdmin(true);
        }
      }
    };

    if (user) {
      fetchPlanStatus();
    }
  }, [user]);

  useEffect(() => {
    if (savedProjects) {
      const savedProjectsMap = {};
      savedProjects.forEach((project) => {
        savedProjectsMap[project.originalId] = true;
      });
      setSavedStatus(savedProjectsMap);
      localStorage.setItem("savedStatus", JSON.stringify(savedProjectsMap));
    }
  }, [savedProjects]);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleContentChange = useCallback((event) => {
    setSelectedProject((prevProject) => ({
      ...prevProject,
      generatedCopy: event.target.value,
    }));
  }, []);

  const handleDeleteProject = useCallback(
    (project) => {
      deleteDocument(project.id).then((res) => {
        if (res.type === "SUCCESS") {
          setSelectedProject(null);
        }
      });
    },
    [deleteDocument]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(selectedProject.generatedCopy).then(
      () => {
        toast({
          title: "Texto copiado!",
          description: "O texto foi copiado para a área de transferência.",
          status: "success",
          duration: 3000,
        });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 100);
      },
      (err) => {
        console.error("Erro ao copiar o texto: ", err);
      }
    );
  }, [selectedProject, toast]);

  const handleDownload = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([selectedProject.generatedCopy], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "copy.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 100);
  }, [selectedProject]);

  const handleSaveProject = useCallback(
    async (project) => {
      try {
        const moduleTypeString =
          typeof project.moduleType === "string"
            ? project.moduleType
            : Array.isArray(project.moduleType)
            ? project.moduleType.join(" | ")
            : typeof project.moduleType === "object"
            ? project.moduleType.type.name || "UnknownType"
            : "UnknownType";

        const dataToSave = {
          ...project,
          moduleType: moduleTypeString,
          createdAt: new Date(),
          originalId: project.id,
        };

        const result = await saveProject(dataToSave);
        if (result && result.type === "SUCCESS") {
          setSavedStatus((prevStatus) => {
            const newStatus = { ...prevStatus, [project.id]: true };
            localStorage.setItem("savedStatus", JSON.stringify(newStatus));
            return newStatus;
          });
          toast({
            description: "Seu projeto foi salvo com sucesso!",
          });
        }
      } catch (error) {
        console.error("Erro ao salvar o projeto:", error);
      }
    },
    [saveProject, toast]
  );

  const handleAddNewProject = useCallback(
    async (newProject) => {
      try {
        if (documents.length >= 20) {
          const oldestProject = documents[documents.length - 1];
          await deleteDocument(oldestProject.id);
        }
        await saveCopy(newProject);
      } catch (error) {
        console.error("Erro ao adicionar novo projeto:", error);
      }
    },
    [documents, deleteDocument, saveCopy]
  );

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="p-5 font-semibold text-xl">
        Nenhum histórico encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="p-5 w-full relative">
        <div
          className={`${
            selectedProject ? "fixed inset-0 bg-black bg-opacity-50" : ""
          }`}
        >
          <WarningBar disabled={!!selectedProject} />
        </div>
        <div className={`mt-28 ${selectedProject ? "opacity-50" : ""}`}>
          <h1 className="font-semibold text-2xl mb-10">Histórico</h1>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
            }}
          >
            {documents.map((project) => (
              <div key={project.id} className="relative">
                <div
                  className="p-4 rounded-xl min-h-[200px] relative cursor-pointer shadow-md border border-bordapedro"
                  onClick={() => handleProjectClick(project)}
                >
                  <h3 className="text-md font-medium">{project.moduleType}</h3>
                  <p className="text-foreground/50 mt-2 text-sm">
                    {project.generatedCopy
                      ? project.generatedCopy.substring(0, 100)
                      : "Sem conteúdo"}
                    ...
                  </p>
                  <p className="text-foreground/50 text-xs absolute bottom-4">
                    Criado em{" "}
                    {new Date(
                      project.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => handleDeleteProject(project)}
                >
                  <TrashIcon className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-foreground">
            <div className="bg-card rounded-2xl p-8 w-full max-w-4xl relative z-50 h-[80vh] overflow-auto">
              <button
                className="absolute top-1 right-4 text-4xl"
                onClick={handleClose}
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/2 pr-4 text-foreground">
                  <h2 className="font-semibold text-lg mb-10">Informações</h2>
                  <div className="mb-6">
                    <p className="text-sm text-foreground/60">Modelo</p>
                    <p className="text-md text-foreground">
                      {selectedProject.moduleType}
                    </p>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-foreground/60">Criado em</p>
                    <p className="text-md text-foreground">
                      {new Date(
                        selectedProject.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 pl-4 h-full">
                  <h2 className="font-semibold text-lg mb-10">Resultado</h2>

                  <Textarea
                    value={selectedProject.generatedCopy}
                    onChange={handleContentChange}
                    className="w-full h-[60vh] p-4 border resize-none focus:outline-none focus:border-primary rounded-lg"
                  />

                  <div className="flex flex-col sm:flex-row sm:space-x-2 justify-center sm:justify-end mt-2 sm:gap-0 gap-2">
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
                      onClick={() => handleSaveProject(selectedProject)}
                      className={`py-2 px-3 rounded-md text-base font-normal text-white border border-border flex items-center gap-2 transform transition-shadow duration-200 hover:shadow-md`}
                      disabled={!!savedStatus[selectedProject?.id]}
                    >
                      <BookmarkIcon />
                      {savedStatus[selectedProject?.id] ? "Salvo" : "Salvar"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </>
  );
}
