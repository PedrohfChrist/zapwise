import React from "react";
import CopyModule from "@/components/CopyModule";
import { RocketIcon } from "@radix-ui/react-icons";

const salesPageFields = [
  {
    name: "niche",
    label: "Qual é o seu nicho?",
    type: "text",
    placeholder: "Ex.: Saúde",
  },
  {
    name: "subniche",
    label: "Qual é o seu subnicho?",
    type: "text",
    placeholder: "Ex.: Emagrecimento por meio de uma dieta sem restrições.",
  },
  {
    name: "audienceDescription",
    label:
      "Como você descreveria o tipo de pessoa que está interessada no que você oferece?",
    type: "textarea",
    placeholder:
      "Ex.: Mulheres de 25 a 35 anos que querem emagrecer sem fazer dietas restritivas.",
    size: "h-24",
  },
  {
    name: "audienceDesires",
    label:
      "O que essa pessoa mais deseja ou qual problema ela está tentando resolver?",
    type: "textarea",
    placeholder: "Ex.: Querem perder peso de forma saudável e sustentável.",
    size: "h-24",
  },
  {
    name: "mainPromise",
    label: "Qual é a Promessa Principal?",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias comendo o que gosta com o método Metabolismo Ativo.",
    size: "h-24",
  },
  {
    name: "mechanism",
    label: "Qual o Mecanismo Único da Solução?",
    type: "textarea",
    placeholder:
      "Ex.: O Metabolismo Ativo reeduca o metabolismo através de um plano alimentar personalizado, incluindo alimentos termogênicos.",
    size: "h-24",
  },
  {
    name: "rootProblem",
    label: "Qual a Raiz do Problema solucionado?",
    type: "textarea",
    placeholder:
      "Ex.: O metabolismo lento devido ao envelhecimento e à falta de nutrientes essenciais.",
    size: "h-24",
  },
  {
    name: "keyBenefits",
    label:
      "Quais são as principais vantagens que seu cliente obterá com seu conteúdo?",
    type: "textarea",
    placeholder: "Ex.: Benefício 1, Benefício 2, Benefício 3...",
    size: "h-24",
  },
  {
    name: "productReceive",
    label:
      "O que o seu público vai receber ao comprar o seu produto? (Escreva em forma de lista)",
    type: "textarea",
    placeholder:
      "Ex.: - Acesso ao programa Metabolismo Ativo - Plano alimentar personalizado - Grupo de suporte exclusivo",
    size: "h-24",
  },
  {
    name: "bonusNames",
    label:
      "Quais são os nomes dos bônus que serão entregues? (Escreva em forma de lista)",
    type: "textarea",
    placeholder:
      "Ex.: - E-book de receitas saudáveis - Sessão de coaching individual",
    size: "h-24",
  },
  {
    name: "guarantee",
    label: "Qual a garantia do seu produto?",
    type: "select",
    options: ["7 dias", "21 dias", "30 dias"],
  },
  {
    name: "productPrice",
    label: "Qual o preço do produto?",
    type: "text",
    placeholder: "Ex.: R$197",
  },
  {
    name: "promotion",
    label: "Qual é sua promoção?",
    type: "textarea",
    placeholder: "Ex.: Roupas de inverno com 40% de desconto",
    size: "h-24",
  },
  {
    name: "productDescription",
    label: "Descreva seu produto:",
    type: "textarea",
    placeholder:
      "Ex.: O Metabolismo Ativo é um programa completo de reeducação do metabolismo...",
    size: "h-24",
  },
  {
    name: "expertDescription",
    label: "Descreva quem é o expert ou a empresa:",
    type: "textarea",
    placeholder: "Ex.: A Empresa X é líder em...",
    size: "h-24",
  },
  {
    name: "name",
    label: "Qual o nome do seu produto?",
    type: "text",
    placeholder: "Ex.: Metabolismo Ativo",
  },
];

const promptTemplate = `
Crie uma página de vendas completa seguindo o blueprint de 9 passos. Utilize as informações fornecidas para gerar uma página eficaz e envolvente. Aqui estão os detalhes:

1. Nicho: {{niche}}
2. Subnicho: {{subniche}}
3. Descrição do Público: {{audienceDescription}}
4. Desejos do Público: {{audienceDesires}}
5. Promessa Principal: {{mainPromise}}
6. Mecanismo Único: {{mechanism}}
7. Raiz do Problema: {{rootProblem}}
8. Benefícios Chave: {{keyBenefits}}
9. O que o cliente vai receber: {{productReceive}}
10. Bônus: {{bonusNames}}
11. Garantia: {{guarantee}}
12. Preço do Produto: {{productPrice}}
13. Promoção: {{promotion}}
14. Descrição do Produto: {{productDescription}}
15. Descrição do Expert/Empresa: {{expertDescription}}
16. Nome do Produto: {{name}}

Gere uma página de vendas contínua e persuasiva, seguindo os 9 passos do blueprint:

1. Headline: Crie uma promessa ousada ou uma pergunta intrigante.
2. Vídeo VSL: Prenda a atenção com um vídeo de vendas.
3. Lead: Apresente um cenário ou uma história para capturar o interesse.
4. História: Conte uma história envolvente sobre o produto ou cliente.
5. Pitch: Apresente o produto e explique todos os benefícios.
6. Evidência: Mostre provas, depoimentos e construa credibilidade.
7. Oferta: Explique a oferta, construa o valor e revele o preço.
8. Acordo: Remova riscos, fortaleça a chamada para ação e crie urgência.
9. Q&A: Inclua uma sessão de perguntas e respostas.


Não dê introduções ou descrições, apenas escreva a copy para a página de vendas completa.


`;

const SalesPage = () => {
  const moduleType = "Página de Vendas";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={salesPageFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default SalesPage;
