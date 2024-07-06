import React, { useState, useRef } from "react";
import { ModeToggle } from "@/shadcn/components/mode-toggle";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shadcn/components/ui/avatar";
import getInitials from "@/utils/getInitials";
import { useAuthContext } from "@/hooks/useAuthContext";
import uploadToStorage from "@/utils/uploadToStorage";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Input } from "@/shadcn/components/ui/input";
import { CameraIcon } from "lucide-react";
import WarningBar from "@/components/WarningBar";

export default function Account({ rerender, setRerender }) {
  const { user } = useAuthContext();
  const inputRef = useRef();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  const openFileSelector = () => inputRef.current.click();

  const onFileSelected = async (e) => {
    const selectedFile = e.target.files[0];
    console.log(e);

    if (!selectedFile) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    if (!selectedFile.type.includes("image")) {
      alert("Por favor, selecione uma imagem.");
      return;
    }

    if (selectedFile.size > 1500000) {
      // Tamanho menor que 1,5MB
      alert("Por favor, selecione uma imagem menor do que 1,5 MB.");
      return;
    }

    const downloadUrl = await uploadToStorage(
      selectedFile,
      `users/${user.uid}`,
      "profilePic"
    );

    updateProfile(auth.currentUser, {
      photoURL: downloadUrl,
    })
      .then(() => {
        // Recarregue o usuário para atualizar as informações
        console.log("deu bom");

        return auth.currentUser.reload();
      })
      .then(() => {
        // Acessar o photoURL atualizado
        setRerender((prev) => !prev);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o perfil: ", error);
      });
  };

  return (
    <div className="p-5 w-full ">
      {rerender && <span className="hidden"></span>}
      <WarningBar />
      <h1 className="font-semibold text-2xl mb-10">Meu perfil</h1>
      <div className="mb-10">
        <Avatar className="h-16 w-16" role="button" onClick={openFileSelector}>
          <AvatarImage src={user.photoURL} />
          <AvatarFallback className="bg-primary/50 text-2xl text-white">
            <CameraIcon />
          </AvatarFallback>
        </Avatar>
        <input
          onChange={onFileSelected}
          ref={inputRef}
          accept="image/*"
          type="file"
          className="hidden"
        />
      </div>
      <div className="max-w-lg">
        <p className="mt-5 text-muted-foreground mb-2.5">Nome completo</p>
        <Input
          disabled
          value={user.displayName}
          readOnly
          type="text"
          className="w-full"
        />
        <p className="mt-5 text-muted-foreground mb-2.5">E-mail</p>
        <Input
          disabled
          value={user.email}
          readOnly
          type="email"
          className="w-full"
        />
        <p className="mt-5 text-muted-foreground mb-2.5">Tema (claro/escuro)</p>
        <ModeToggle />
      </div>
    </div>
  );
}
