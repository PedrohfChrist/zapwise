import React from "react";
import CopyModule from "@/components/CopyModule";
import { ClipboardIcon } from "@radix-ui/react-icons";

const leadingPageFields = [
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
    name: "targetAge",
    label: "Qual a idade do seu público alvo?",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    defaultValue: "25-34", // Valor padrão selecionado
  },
  {
    name: "targetGender",
    label: "Qual é o gênero do Público Alvo?",
    type: "select",
    options: ["Homens", "Mulheres", "Ambos"],
    defaultValue: "Ambos", // Valor padrão selecionado
  },
  {
    name: "mainPromise",
    label: "Promessa Principal:",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias comendo o que gosta com o método Metabolismo Ativo.",
  },
  {
    name: "mechanism",
    label: "Qual é o Mecanismo Único?",
    type: "textarea",
    placeholder:
      "Ex.: O Metabolismo Ativo reeduca o metabolismo através de um plano alimentar personalizado, incluindo alimentos termogênicos.",
    size: "h-24",
  },
  {
    name: "testimonials",
    label: "Depoimentos:",
    type: "textarea",
    placeholder: 'Ex.: "Este produto mudou minha vida!" - Cliente Satisfeito',
    size: "h-24",
  },
  {
    name: "additionalBonus",
    label: "Bônus Adicional (se houver):",
    type: "textarea",
    placeholder: "Ex.: Receba um e-book gratuito...",
  },
];

const promptTemplate = `
Crie uma página de captura completa para coletar informações de leads. Utilize as informações fornecidas para gerar uma página eficaz e envolvente. Aqui estão os detalhes:

1. Nicho: {{niche}}
2. Subnicho: {{subniche}}
3. Idade do Público Alvo: {{targetAge}}
4. Gênero do Público Alvo: {{targetGender}}
5. Promessa Principal: {{mainPromise}}
6. Mecanismo Único: {{mechanism}}
7. Depoimentos: {{testimonials}}
8. Bônus Adicional: {{additionalBonus}}

Gere uma página de captura contínua e persuasiva, com um layout bem estruturado que inclua:

Um Título Chamativo com a promessa, uma Descrição Curta e Impactante, o Mecanismo Único, Depoimentos de Clientes, Bônus Adicional (se houver), Formulário de Captura (Nome, Email, Número de Celular) e a Chamada para Ação

Não dê introduções ou descrições e não separe em tópicos, apenas gere a copy para a página de captura inteira e de forma contínua.

`;

const LeadingPage = () => {
  const moduleType = "Página de Captura";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={leadingPageFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default LeadingPage;
