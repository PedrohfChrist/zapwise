import React from "react";
import CopyModule from "@/components/CopyModule";
import { CheckCircledIcon } from "@radix-ui/react-icons";

const promessaPrincipalFields = [
  {
    name: "niche",
    label: "Qual é o seu nicho?",
    type: "text",
    placeholder: "Ex.: Saúde, Tecnologia...",
  },
  {
    name: "subniche",
    label: "Qual é o seu subnicho?",
    type: "text",
    placeholder:
      "Ex.: Emagrecimento com dietas cetogênicas, Desenvolvimento Web com React.js...",
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
Gere a promessa principal da oferta (promessa primária) do produto/serviço. Uma promessa persuasiva e poderosa. Utilize as informações fornecidas para criar uma promessa forte e persuasiva. Aqui estão os detalhes:

1. Nicho: {{niche}}
2. Subnicho: {{subniche}}
3. Idade do Público Alvo: {{targetAge}}

Gere uma promessa principal impactante para a oferta. Não dê introduções ou descrições, apenas a promessa.

Exemplos de Promessas:
"Perca até 8kg em 21 dias com nosso programa de emagrecimento personalizado para mulheres de 28 a 40 anos."
"Aprenda as técnicas comprovadas para conquistar mulheres atraentes em 30 dias ou menos, mesmo que você seja tímido e tenha tentado de tudo sem sucesso."
"Descubra como ganhar R$100 por semana vendendo PLRs em apenas 7 dias, mesmo sendo iniciante no mercado online!"

`;

const PromessaPrincipal = () => {
  const moduleType = "Promessa Principal";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={promessaPrincipalFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default PromessaPrincipal;
