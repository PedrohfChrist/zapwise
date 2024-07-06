import React from "react";
import CopyModule from "@/components/CopyModule";
import { LayersIcon } from "@radix-ui/react-icons";

const nicheFields = [
  {
    name: "mainInterest",
    label: "Qual é o seu interesse principal?",
    type: "textarea",
    placeholder: "Ex.: Saúde, Tecnologia, Educação, etc.",
  },
  {
    name: "targetGender",
    label: "Qual é o gênero do Público Alvo?",
    type: "select",
    options: ["Homens", "Mulheres", "Ambos"],
    default: "Homens",
  },
  {
    name: "targetAge",
    label: "Qual a idade do seu público alvo?",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    default: "18-24",
  },
];

const promptTemplate = `
Gere nichos que estão vendendo milhões na internet. Use o público alvo e gere 5 nichos escaláveis. Ao lado de cada nicho gere 5 ideias de subnichos. Utilize as informações fornecidas para criar nichos e subnichos relevantes. Aqui estão os detalhes:

1. Interesse Principal: {{mainInterest}}
2. Gênero do Público Alvo: {{targetGender}}
3. Idade do Público Alvo: {{targetAge}}

Gere uma lista de 5 nichos escaláveis com 5 ideias de subnichos para cada um. Não dê introduções ou descrições, apenas os nichos e subnichos.

`;

const Niche = () => {
  const moduleType = "Nicho e Subnicho";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={nicheFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default Niche;
