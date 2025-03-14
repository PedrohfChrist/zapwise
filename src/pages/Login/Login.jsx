import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async"; // ✅ SEO Helmet
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
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsEmailLogin(true);
    try {
      await login(identifier, password);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  // 🔹 SEO Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login - ZapWise",
    description:
      "Faça login no ZapWise e automatize suas vendas no WhatsApp com IA avançada.",
    url: "https://app.zapwise.com.br/login",
    potentialAction: {
      "@type": "LoginAction",
      target: "https://app.zapwise.com.br/login",
    },
  };

  // 🔹 Exibir mensagem de erro amigável
  useEffect(() => {
    if (!error) return;

    let errorMsg = "Erro ao fazer login. Tente novamente.";
    if (error.includes("auth/invalid-login-credentials")) {
      errorMsg =
        "As credenciais fornecidas estão incorretas ou o e-mail/número de WhatsApp está vinculado ao login com Google.";
    } else if (error.includes("auth/user-not-found")) {
      errorMsg =
        "Não encontramos uma conta com este e-mail ou número de WhatsApp.";
    } else if (error.includes("auth/wrong-password")) {
      errorMsg = "Senha incorreta. Tente novamente.";
    } else if (error.includes("WhatsApp number not found")) {
      errorMsg = "Não encontramos uma conta com este número de WhatsApp.";
    }
    setErrorMsg(errorMsg);
  }, [error]);

  return (
    <>
      {/* 🔹 Helmet para SEO */}
      <Helmet>
        <title>Login - ZapWise</title>
        <meta
          name="description"
          content="Faça login no ZapWise e automatize suas vendas no WhatsApp com IA avançada."
        />
        <meta
          name="keywords"
          content="login zapwise, whatsapp chatbot, automação de atendimento, IA para WhatsApp"
        />
        <meta name="author" content="ZapWise" />
        <meta property="og:title" content="Login - ZapWise" />
        <meta
          property="og:description"
          content="Entre na sua conta e comece a automatizar seu atendimento no WhatsApp com IA."
        />
        <meta property="og:url" content="https://app.zapwise.com.br/login" />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <div className="w-full h-screen flex flex-col md:flex-row px-4 md:px-20 py-6 md:py-28 gap-10 md:gap-20">
        {/* 🔹 Imagem e Apresentação */}
        <div className="w-full md:w-1/2 bg-muted rounded-xl p-8 md:p-12 flex flex-col items-center">
          <div className="text-background p-4 md:p-8 rounded-xl leading-8">
            <img
              src={AiLogo}
              alt="Login no ZapWise"
              className="w-full max-h-48 md:max-h-72 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center mt-6">
            <Logo />
            <p className="text-muted-foreground font-medium mt-4 text-center text-sm md:text-md">
              Revolucione seu atendimento no WhatsApp com ZapWise.
            </p>
          </div>
        </div>

        {/* 🔹 Formulário de Login */}
        <div className="flex flex-col justify-center w-full md:w-1/2 px-4 md:px-20 mb-16 md:mb-0">
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
            aria-label="Entrar com o Google"
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
            <label className="mt-5 text-muted-foreground mb-2.5 text-sm md:text-md">
              E-mail ou Número do WhatsApp
            </label>
            <Input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.trim())}
              aria-label="E-mail ou Número do WhatsApp"
            />

            <label className="mt-5 text-muted-foreground mb-2.5 text-sm md:text-md">
              Senha
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Senha"
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
        </div>
      </div>
    </>
  );
}
