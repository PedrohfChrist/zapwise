import WarningBar from "@/components/WarningBar";
import React, { useState, useCallback } from "react";
import { useCollection } from "@/hooks/useCollection";
import { useFirestore } from "@/hooks/useFirestore";
import {
  ClipboardCopyIcon,
  DownloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/shadcn/components/ui/alert-dialog";
import { Button } from "@/shadcn/components/ui/button";
import { Textarea } from "@/shadcn/components/ui/textarea";

export default function Collection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const { documents: savedProjects, error } = useCollection(
    "savedProjects",
    null,
    ["createdAt", "desc"]
  );
  const { deleteDocument } = useFirestore("savedProjects");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

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

  const confirmDeleteProject = useCallback((project) => {
    setProjectToDelete(project);
    setIsAlertDialogOpen(true);
  }, []);

  const handleDeleteProject = useCallback(() => {
    deleteDocument(projectToDelete.id).then((res) => {
      if (res.type === "SUCCESS") {
        setProjectToDelete(null);
        setSelectedProject(null);
        setIsAlertDialogOpen(false);
      }
    });
  }, [deleteDocument, projectToDelete]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(selectedProject.generatedCopy).then(
      () => {
        console.log("Texto copiado para a área de transferência!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 100);
      },
      (err) => {
        console.error("Erro ao copiar o texto: ", err);
      }
    );
  }, [selectedProject]);

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

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!savedProjects || savedProjects.length === 0) {
    return (
      <div className="p-5 font-semibold text-xl">
        Nenhum projeto salvo encontrado.
      </div>
    );
  }

  return (
    <div className="p-5 w-full relative">
      <div
        className={`${
          selectedProject || isAlertDialogOpen
            ? "fixed inset-0 bg-black bg-opacity-50"
            : ""
        }`}
      >
        <WarningBar disabled={!!selectedProject || isAlertDialogOpen} />
      </div>
      <div
        className={`mt-28 ${
          selectedProject || isAlertDialogOpen ? "opacity-50" : ""
        }`}
      >
        <h1 className="font-semibold text-2xl mb-10">Projetos Salvos</h1>
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          }}
        >
          {savedProjects.map((project) => (
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
                onClick={() => confirmDeleteProject(project)}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent className="opacity-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Você tem certeza que deseja excluir este item da coleção?</p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
