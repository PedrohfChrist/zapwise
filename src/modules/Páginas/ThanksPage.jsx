import React from "react";
import CopyModule from "@/components/CopyModule";
import { HeartIcon } from "@radix-ui/react-icons";

const thanksPageFields = [
  {
    name: "pageType",
    label: "Qual é o tipo de página de obrigado?",
    type: "select",
    options: ["Pós-Compra de Produto", "Pós-Captura de Leads"],
    defaultValue: "Pós-Compra de Produto",
  },
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
    name: "targetProblem",
    label:
      "O que essa pessoa mais deseja ou qual problema ela está tentando resolver?",
    type: "textarea",
    placeholder: "Ex.: Deseja perder peso de forma saudável e eficaz.",
    size: "h-24",
  },
  {
    name: "keyBenefits",
    label:
      "Quais são as principais vantagens que seu cliente em potencial obterá com seu conteúdo?",
    type: "textarea",
    placeholder: "Ex.: Benefício 1, Benefício 2, Benefício 3...",
    size: "h-24",
  },
];

const promptTemplate = `
Crie uma copywriting para uma página web de obrigado completa para um dos dois cenários: pós-compra de produto que é quando o lead acaba de comprar um produto, e a pós-captura de leads que é quando damos algum "brinde", geralmente um e-book, de graça para o lead para que capturemos suas informações, geralmente email e nome, essa página de captura ainda não vendemos nada para o lead. Utilize as informações fornecidas para gerar uma página que gere entusiasmo, aumente a confiança e tranquilize o prospecto sobre sua decisão. Aqui estão os detalhes:

1. Tipo de Página de Obrigado: {{pageType}}
2. Nicho: {{niche}}
3. Subnicho: {{subniche}}
4. Problema do Público: {{targetProblem}}
5. Benefícios Chave: {{keyBenefits}}

Gere uma página de obrigado contínua e persuasiva que inclua uma mensagem de agradecimento, reafirme a decisão do prospecto e destaque os benefícios principais. Não dê introduções ou descrições, apenas gere a copy para a página de obrigado inteira.



`;

const ThanksPage = () => {
  const moduleType = "Página de Obrigado";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={thanksPageFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default ThanksPage;
