import React, { useState } from "react";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import { ReloadIcon } from "@radix-ui/react-icons";
import Logo from "@/components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const { login, isPending, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  return (
    <div className="w-full h-screen flex px-40 py-28 gap-20">
      <div className="w-1/2 bg-muted rounded-xl p-12 ">
        <Logo />
        <h2 className="mt-24 text-4xl leading-[50px] font-medium">TESTE</h2>
        <p className="text-muted-foregrounde mt-10">TESTE PARAGRAFO</p>
        <div className="bg-foreground text-background p-8 rounded-xl mt-16 leading-8 ">
          TESTE DIV
        </div>
      </div>
      <div className="flex flex-col justify-center w-1/2 px-20">
        <div>
          <h1 className="text-3xl font-semibold ">Entre na sua conta</h1>
          <p className="mt-4 text-muted-foreground font-normal text-lg">
            Preencha seus dados de acesso
          </p>
          <form className="mt-10" onSubmit={handleLogin}>
            <p className="mt-5 text-muted-foreground mb-2.5">E-mail</p>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-5 text-muted-foreground mb-2.5">Senha</p>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="text-lg w-full mt-10 py-6" disabled={isPending}>
              {isPending && (
                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
              )}
              Entrar na minha conta
            </Button>
          </form>
          <div className="flex gap-2 text-lg mt-12 justify-center">
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
