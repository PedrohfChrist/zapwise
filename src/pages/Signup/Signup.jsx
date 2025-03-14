// components/Signup.js

import React, { useState, useEffect } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import SignupDesign from "@/assets/SignupDesign.svg";
import GoogleLogo from "@/components/GoogleLogo";
import {
  validatePassword,
  validateEmail,
  validateFullName,
  validatePhoneNumber,
} from "@/utils/validate";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTypo, setEmailTypo] = useState("");
  const { signup, error, isPending } = useSignup();
  const { authenticateWithGoogle, isPending: googleIsPending } = useLogin();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const checkEmailTypos = (email) => {
    const emailParts = email.split("@");
    if (emailParts.length !== 2) return;

    const domain = emailParts[1];
    const corrections = {
      "outlok.com": "outlook.com",
      "otlook.com": "outlook.com",
      "gamil.com": "gmail.com",
      "gmial.com": "gmail.com",
      "gmail.co": "gmail.com",
      "gmai.com": "gmail.com",
      "hotmal.com": "hotmail.com",
      "hotmai.com": "hotmail.com",
      "hotmial.com": "hotmail.com",
      "live.con": "live.com",
      "live.cmo": "live.com",
      "live.cm": "live.com",
    };

    if (corrections[domain]) {
      setEmailTypo(`Você quis dizer ${emailParts[0]}@${corrections[domain]}?`);
    } else {
      setEmailTypo("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValidFullName, message: nameMsg } = validateFullName(fullName);
    const { isValidPhoneNumber, message: phoneMsg } =
      validatePhoneNumber(whatsappNumber);
    const { isValidEmail, message: emailMsg } = validateEmail(email);
    const { isValidPassword, message: passMsg } = validatePassword(password);

    if (
      !isValidFullName ||
      !isValidEmail ||
      !isValidPassword ||
      !isValidPhoneNumber
    ) {
      setMessage({
        type: "error",
        message: nameMsg || emailMsg || passMsg || phoneMsg,
      });
      return;
    }

    try {
      await signup(email, password, whatsappNumber, fullName);
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar a conta:", error);
    }
  };

  useEffect(() => {
    if (error) {
      let errorMsg = "Ocorreu um erro ao criar a conta. Tente novamente.";
      if (error.includes("email-already-in-use")) {
        errorMsg = "O e-mail informado já está em uso.";
      } else if (error.includes("weak-password")) {
        errorMsg = "A senha informada é muito fraca.";
      } else if (error.includes("invalid-email")) {
        errorMsg = "O e-mail informado é inválido.";
      } else if (error.includes("WhatsApp number already in use")) {
        errorMsg = "O número de WhatsApp já está em uso.";
      }
      setMessage({ type: "error", message: errorMsg });
    }
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row px-4 md:px-20 py-6 md:py-28 gap-10 md:gap-20">
      <div className="w-full md:w-1/2 bg-muted rounded-xl p-8 md:p-12 flex flex-col items-center">
        <div className="text-background p-4 md:p-8 rounded-xl leading-8">
          <img
            src={SignupDesign}
            alt="Signup Design"
            className="w-full max-h-48 md:max-h-72 object-contain"
          />
        </div>
        <div className="flex flex-col items-center mt-6">
          <Logo />
          <p className="text-muted-foreground font-medium mt-4 text-center text-sm md:text-md">
            Automatize seu atendimento no WhatsApp com a I.A humanizada e
            autônoma do ZapWise.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4 md:px-20 mb-16 md:mb-0">
        <div>
          <p className="mb-2 md:mb-4 text-muted-foreground font-normal text-sm md:text-md uppercase">
            Teste de graça
          </p>
          <h1 className="text-2xl md:text-4xl font-medium">
            Criar uma nova conta.
          </h1>
          <Button
            variant="outline"
            className="mt-6 text-lg w-full"
            disabled={googleIsPending || isPending}
            onClick={() => authenticateWithGoogle("signup")}
          >
            {googleIsPending && !isPending && (
              <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
            )}
            <GoogleLogo />
            {googleIsPending ? "Aguardando..." : "Criar conta com Google"}
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-primary-foreground px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          <form className="mt-10" onSubmit={handleSubmit}>
            <p className="text-muted-foreground mb-2 text-sm md:text-md">
              Nome completo
            </p>
            <Input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <p className="mt-4 md:mt-5 text-muted-foreground mb-2 text-sm md:text-md">
              Número do WhatsApp
            </p>
            <Input
              type="tel"
              autoComplete="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.trim())}
            />
            <p className="mt-4 md:mt-5 text-muted-foreground mb-2 text-sm md:text-md">
              E-mail
            </p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim().toLowerCase();
                setEmail(value);
                checkEmailTypos(value);
              }}
            />
            {emailTypo && (
              <p
                className="text-muted-foreground text-sm mt-1.5"
                role="button"
                onClick={() => {
                  setEmail(
                    emailTypo.split("Você quis dizer ")[1].replace("?", "")
                  );
                  setEmailTypo("");
                }}
              >
                {emailTypo}
              </p>
            )}
            <p className="mt-4 md:mt-5 text-muted-foreground mb-2 text-sm md:text-md">
              Senha
            </p>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              disabled={isPending || googleIsPending}
              className="text-sm md:text-lg w-full mt-6 md:mt-10 py-4 md:py-6 text-white"
            >
              {isPending && (
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isPending ? "Criando a conta..." : "Criar minha conta"}
            </Button>
          </form>
          {message && message.type === "error" && (
            <p className="text-red-500 mt-2.5">{message.message}</p>
          )}
          <div className="flex gap-2 text-sm md:text-lg mt-6 md:mt-12 justify-center mb-16 md:mb-0">
            <p>Já tem uma conta?</p>
            <Link to="/login" className="text-primary">
              Entre aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
