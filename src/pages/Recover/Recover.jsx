import React, { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useToast } from "@/shadcn/components/ui/use-toast";
import AiLogo from "@/assets/AiLogo.svg";
import GoogleLogo from "@/components/GoogleLogo";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    setIsPending(true);
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        type: "success",
        message:
          "E-mail de recuperação de senha enviado com sucesso! Confira a caixa de entrada e o SPAM.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        message:
          "Ocorreu um erro ao enviar o e-mail de recuperação. Contate o suporte.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col-reverse xl:flex-row 2xl:gap-20 xl:h-screen w-full xl:px-20 2xl:px-40 xl:py-20 2xl:py-0">
      <div className="hidden sm:flex xl:w-1/2 2xl:h-[75%] my-auto bg-muted rounded-xl px-5 sm:p-12 py-8 justify-center items-center">
        <div className="text-background p-4 md:p-8 rounded-xl leading-8">
          <img
            src={AiLogo}
            alt="Login Design"
            className="w-full max-h-48 md:max-h-72 object-contain"
          />
        </div>
        <div className="flex flex-col items-center mt-6">
          <Logo />
          <p className="text-muted-foreground font-medium mt-4 text-center text-sm md:text-md">
            Potencialize suas vendas com copys irresistíveis e persuasivos!
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center xl:w-1/2 px-5 md:px-20 h-screen sm:h-auto">
        <div>
          <div className="sm:hidden mx-auto w-fit">
            <Logo />
          </div>
          <h1 className="mt-12 text-3xl font-semibold text-center sm:text-left">
            Redefina a sua senha
          </h1>
          <p className="mt-4 text-muted-foreground font-normal text-lg text-center sm:text-left">
            Informe o seu e-mail abaixo
          </p>
          <form className="mt-8" onSubmit={handleSubmit}>
            <p className="text-muted-foreground mb-2.5">E-mail</p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button className="mt-6 text-lg w-full" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
              )}
              {isPending ? "Enviando..." : "Enviar e-mail de recuperação"}
            </Button>
          </form>
          {message && message.type === "success" && (
            <p className="text-center text-emerald-500 mt-4">
              {message.message}
            </p>
          )}
          {message && message.type === "error" && (
            <p className="text-center text-red-500 mt-4">{message.message}</p>
          )}
          <div className="mt-12 flex justify-center gap-2 text-lg">
            <p>Lembrou-se da senha?</p>
            <Link to="/login" className="text-primary">
              Entre na sua conta.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
