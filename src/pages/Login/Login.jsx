import React, { useState, useEffect } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";
import AiLogo from "@/assets/AiLogo.svg";
import GoogleLogo from "@/components/GoogleLogo";

export default function Login() {
  const navigate = useNavigate();
  const { login, authenticateWithGoogle, isPending, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsEmailLogin(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  useEffect(() => {
    if (!error) return;

    if (error.includes("auth/invalid-login-credentials")) {
      setErrorMsg(
        "As credenciais fornecidas estão incorretas ou o e-mail está vinculado ao login com Google. Clique no botão 'Entrar com a conta Google'."
      );
    }
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row px-4 md:px-20 py-6 md:py-28 gap-10 md:gap-20">
      <div className="w-full md:w-1/2 bg-muted rounded-xl p-8 md:p-12 flex flex-col items-center">
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
            Transforme palavras em vendas com a poderosa IA do CopyMax.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center w-full md:w-1/2 px-4 md:px-20 mb-16 md:mb-0">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold">
            Entre na sua conta
          </h1>
          <p className="mt-4 text-muted-foreground font-normal text-md md:text-lg">
            Preencha seus dados de acesso
          </p>
          <Button
            variant="outline"
            className="mt-6 text-lg w-full"
            disabled={isPending}
            onClick={() => authenticateWithGoogle("login")}
          >
            {isPending && !isEmailLogin && (
              <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
            )}
            <GoogleLogo />
            {isPending && !isEmailLogin
              ? "Entrando..."
              : "Entrar com a conta Google"}
          </Button>
          <form className="mt-10" onSubmit={handleLogin}>
            <p className="mt-5 text-muted-foreground mb-2.5 text-sm md:text-md">
              E-mail
            </p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            />
            <p className="mt-5 text-muted-foreground mb-2.5 text-sm md:text-md">
              Senha
            </p>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className="mt-2.5 text-right text-muted-foreground underline"
              role="button"
              onClick={() => navigate("/password/recovery")}
            >
              Esqueceu sua senha?
            </p>
            <Button
              className="text-sm md:text-lg w-full mt-6 md:mt-10 py-4 md:py-6 text-white"
              disabled={isPending}
            >
              {isPending && isEmailLogin && (
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              {isPending && isEmailLogin
                ? "Entrando..."
                : "Entrar na minha conta"}
            </Button>
            {errorMsg && <p className="text-red-500 mt-2.5">{errorMsg}</p>}
          </form>
          <div className="flex gap-2 text-sm md:text-lg mt-6 md:mt-12 justify-center mb-16 md:mb-0">
            <p>Não tem uma conta?</p>
            <Link to="/signup" className="text-primary">
              Cadastre-se agora.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
