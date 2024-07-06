import React from "react";
import CopyModule from "@/components/CopyModule";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

const emailBoletoFields = [
  {
    name: "name",
    label: "Qual o nome do seu produto?",
    type: "text",
    placeholder: "Ex.: Curso de Emagrecimento Rápido",
  },
  {
    name: "mainPromise",
    label: "Qual é a Promessa Principal?",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias com nosso método exclusivo de emagrecimento.",
  },
  {
    name: "publicReceive",
    label:
      "O que o seu público vai receber ao comprar o seu produto? (Escreva em forma de lista)",
    type: "textarea",
    placeholder:
      "Ex.: - Acesso ao curso online\n- Suporte exclusivo\n- Material didático completo",
    size: "h-24",
  },
  {
    name: "promotion",
    label: "Qual é sua promoção?",
    type: "text",
    placeholder: 'Ex.: "Roupas de inverno com 40% de desconto"',
  },
  {
    name: "productPrice",
    label: "Qual o preço do produto?",
    type: "text",
    placeholder: "Ex.: R$97,00",
  },
  {
    name: "productGuarantee",
    label: "Qual a garantia do seu produto?",
    type: "select",
    options: ["7 dias", "21 dias", "30 dias"],
    defaultValue: "7 dias",
  },
];

const promptTemplate = `
Crie uma copy envolvente e persuasiva para um email de recuperação de vendas. O objetivo deste email é converter leads que geraram boleto, mas ainda não o pagaram. Gere conexão e persuade o lead a finalizar a compra. Aqui estão os detalhes:

1. Nome do Produto: {{name}}
2. Promessa Principal: {{mainPromise}}
3. O que o público vai receber: {{publicReceive}}
4. Promoção: {{promotion}}
5. Preço do Produto: {{productPrice}}
6. Garantia do Produto: {{productGuarantee}}

Gere uma copy contínua e persuasiva, sem separações de tópicos.

`;

const EmailBoletoGerado = () => {
  const moduleType = "Email Boleto Gerado";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={emailBoletoFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default EmailBoletoGerado;
