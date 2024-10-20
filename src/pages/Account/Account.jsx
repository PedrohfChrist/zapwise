import React, { useState, useRef, useEffect } from "react";
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
import { Card, CardContent } from "@/shadcn/components/ui/card";
import { Button } from "@/shadcn/components/ui/button";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext"; // Usar o SubscriptionContext para pegar informações de assinatura

const Account = ({ rerender, setRerender }) => {
  const { user } = useAuthContext();
  const inputRef = useRef();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { subscriptionStatus } = useSubscriptionContext(); // Pegar dados do contexto de assinatura

  const isEmailProvider =
    user.providerData &&
    user.providerData.length &&
    user.providerData[0].providerId === "google.com"
      ? false
      : true;

  const openFileSelector = () => inputRef.current.click();

  const onFileSelected = async (e) => {
    const selectedFile = e.target.files[0];

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

    try {
      const downloadUrl = await uploadToStorage(
        selectedFile,
        `users/${user.uid}`,
        "profilePic"
      );

      await updateProfile(auth.currentUser, { photoURL: downloadUrl });
      await auth.currentUser.reload();
      setRerender((prev) => !prev);
    } catch (error) {
      console.error("Erro ao atualizar o perfil: ", error);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      const idToken = await user.getIdToken(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar a senha.");
      }

      setMessage("Senha alterada com sucesso.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="p-5 w-full">
      {rerender && <span className="hidden"></span>}
      <WarningBar />
      <h1 className="font-semibold text-2xl mb-10">Meu perfil</h1>
      <div className="mb-10">
        <Avatar className="h-16 w-16" role="button" onClick={openFileSelector}>
          <AvatarImage src={user.photoURL} />
          <AvatarFallback className="bg-primary/50 text-2xl text-white">
            {getInitials(user.displayName)}
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
        {subscriptionStatus && (
          <>
            <p className="mt-5 text-muted-foreground mb-2.5">
              Palavras geradas este mês
            </p>
            <Input
              disabled
              value={subscriptionStatus.wordsGenerated}
              readOnly
              type="text"
              className="w-full"
            />
            <p className="mt-5 text-muted-foreground mb-2.5">
              Limite de palavras do plano
            </p>
            <Input
              disabled
              value={
                subscriptionStatus.planLimit === 20000
                  ? "20.000 palavras"
                  : subscriptionStatus.planLimit === 100000
                  ? "100.000 palavras"
                  : subscriptionStatus.planLimit === 300000
                  ? "300.000 palavras"
                  : "0 palavras"
              }
              readOnly
              type="text"
              className="w-full"
            />
          </>
        )}
        {isEmailProvider && (
          <Card className="mt-8 w-full">
            <CardContent>
              <form onSubmit={changePassword}>
                <p className="mt-5 text-muted-foreground mb-1.5">Senha atual</p>
                <Input
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                />
                <p className="mt-1.5 text-muted-foreground mb-1.5">
                  Nova senha
                </p>
                <Input
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                  type="password"
                />
                <p className="mt-1.5 text-muted-foreground mb-1.5">
                  Confirme a senha
                </p>
                <Input
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    setMessage("");
                  }}
                  type="password"
                />
                {message && (
                  <p className="text-sm mt-1.5 text-red-500">{message}</p>
                )}
                <Button className="mt-2.5" type="submit">
                  Alterar senha
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Account;
