import React, { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "@/hooks/useSignup";
import { useLogin } from "@/hooks/useLogin"; // Importar useLogin
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import SignupDesign from "@/assets/SignupDesign.svg";
import GoogleLogo from "@/components/GoogleLogo";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isPending } = useSignup();
  const { authenticateWithGoogle } = useLogin(); // Chamar authenticateWithGoogle
  const navigate = useNavigate();
  const [isEmailSignup, setIsEmailSignup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEmailSignup(true);
    try {
      await signup(email, password, fullName);
      navigate("/");
    } catch (error) {
      console.error("Erro ao criar a conta:", error);
    }
  };

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
            Domine o poder do copywriting de alta conversão!
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
            disabled={isPending}
            onClick={() => authenticateWithGoogle("signup")}
          >
            {isPending && !isEmailSignup && (
              <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
            )}
            <GoogleLogo />
            {isPending && !isEmailSignup
              ? "Criando conta..."
              : "Criar conta com Google"}
          </Button>
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
              E-mail
            </p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
              disabled={isPending}
              className="text-sm md:text-lg w-full mt-6 md:mt-10 py-4 md:py-6 text-white"
            >
              {isPending && (
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isPending ? "Criando a conta..." : "Criar minha conta"}
            </Button>
          </form>
          {errorMsg && <p className="text-red-500 mt-2.5">{errorMsg}</p>}
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
