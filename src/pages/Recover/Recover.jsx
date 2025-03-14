import React, { useState } from "react";
import { Helmet } from "react-helmet-async"; // ✅ SEO Helmet
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/config";
import Logo from "@/components/Logo";
import AiLogo from "@/assets/AiLogo.svg";
import { ReloadIcon } from "@radix-ui/react-icons";

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
          "E-mail de recuperação enviado! Confira sua caixa de entrada e SPAM.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        message: "Erro ao enviar o e-mail. Contate o suporte.",
      });
    } finally {
      setIsPending(false);
    }
  };

  // 🔹 Schema Markup para SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Recuperação de Senha - ZapWise",
    description:
      "Redefina sua senha no ZapWise. Receba um e-mail com as instruções de recuperação.",
    url: "https://app.zapwise.com.br/password/recovery",
    potentialAction: {
      "@type": "ResetPasswordAction",
      target: "https://app.zapwise.com.br/password/recovery",
    },
  };

  return (
    <>
      {/* 🔹 Helmet para SEO */}
      <Helmet>
        <title>Recuperação de Senha - ZapWise</title>
        <meta
          name="description"
          content="Redefina sua senha no ZapWise. Receba um e-mail com as instruções de recuperação."
        />
        <meta
          name="keywords"
          content="recuperar senha zapwise, redefinição de senha, esqueci minha senha whatsapp ia"
        />
        <meta name="author" content="ZapWise" />
        <meta property="og:title" content="Recuperação de Senha - ZapWise" />
        <meta
          property="og:description"
          content="Recupere sua senha no ZapWise com facilidade."
        />
        <meta
          property="og:url"
          content="https://app.zapwise.com.br/password/recovery"
        />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <div className="flex flex-col-reverse xl:flex-row 2xl:gap-20 xl:h-screen w-full xl:px-20 2xl:px-40 xl:py-20 2xl:py-0">
        {/* 🔹 Imagem e Logotipo */}
        <div className="hidden sm:flex xl:w-1/2 2xl:h-[75%] my-auto bg-muted rounded-xl px-5 sm:p-12 py-8 justify-center items-center">
          <div className="text-background p-4 md:p-8 rounded-xl leading-8">
            <img
              src={AiLogo}
              alt="Recuperação de senha no ZapWise"
              className="w-full max-h-48 md:max-h-72 object-contain"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col items-center mt-6">
            <Logo />
            <p className="text-muted-foreground font-medium mt-4 text-center text-sm md:text-md">
              Potencialize suas vendas com automação inteligente no WhatsApp.
            </p>
          </div>
        </div>

        {/* 🔹 Formulário de Recuperação */}
        <div className="flex flex-col justify-center xl:w-1/2 px-5 md:px-20 h-screen sm:h-auto">
          <div>
            <div className="sm:hidden mx-auto w-fit">
              <Logo />
            </div>
            <h1 className="mt-12 text-3xl font-semibold text-center sm:text-left">
              Redefina a sua senha
            </h1>
            <p className="mt-4 text-muted-foreground font-normal text-lg text-center sm:text-left">
              Informe seu e-mail para receber um link de recuperação.
            </p>

            <form className="mt-8" onSubmit={handleSubmit}>
              <label
                htmlFor="email"
                className="text-muted-foreground mb-2.5 block"
              >
                E-mail
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Digite seu e-mail para redefinição de senha"
                required
              />

              <Button className="mt-6 text-lg w-full" disabled={isPending}>
                {isPending && (
                  <ReloadIcon className="w-5 h-5 mr-2 animate-spin" />
                )}
                {isPending ? "Enviando..." : "Enviar e-mail de recuperação"}
              </Button>
            </form>

            {/* 🔹 Mensagens de Sucesso ou Erro */}
            {message && (
              <p
                className={`text-center mt-4 ${
                  message.type === "success"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {message.message}
              </p>
            )}

            {/* 🔹 Link para Login */}
            <div className="mt-12 flex justify-center gap-2 text-lg">
              <p>Lembrou-se da senha?</p>
              <Link to="/login" className="text-primary">
                Entre na sua conta.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
