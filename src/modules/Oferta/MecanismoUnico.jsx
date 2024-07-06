import React from "react";
import CopyModule from "@/components/CopyModule";
import { GearIcon } from "@radix-ui/react-icons";

const mecanismoUnicoFields = [
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
    placeholder: "Ex.: Emagrecimento por meio de uma dieta sem restrições",
  },
  {
    name: "mainPromise",
    label: "Qual é a Promessa Principal?",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias com nosso método exclusivo de emagrecimento.",
  },
  {
    name: "targetAge",
    label: "Qual a idade do seu público alvo?",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    default: "18-24",
  },
  {
    name: "targetGender",
    label: "Qual é o gênero do Público Alvo?",
    type: "select",
    options: ["Homens", "Mulheres", "Ambos"],
    default: "Homens",
  },
];

const promptTemplate = `
Crie o Mecanismo Único da solução e do problema para a oferta. São o diferencial de como o produto resolve o problema da pessoa de forma única e o problema deste lead. Utilize as informações fornecidas para criar um Mecanismo Único do Problema e da Solução. Aqui estão os detalhes:

1. Nicho: {{niche}}
2. Subnicho: {{subniche}}
3. Promessa Principal: {{mainPromise}}
4. Idade do Público Alvo: {{targetAge}}
5. Gênero do Público Alvo: {{targetGender}}

Gere um Mecanismo Único da Solução e do Problema, contínuo e persuasivo mostrando claramente como o produto resolve o problema de forma exclusiva. Não dê introduções ou descrições, apenas os mecanismos únicos.

Exemplo de Mecanismo Único:

Mecanismo Único do Problema:
"A raiz do problema está na dificuldade do metabolismo feminino em queimar gordura de forma eficiente, devido ao desequilíbrio hormonal e à sobrecarga de toxinas no organismo, que impedem a perda de peso de forma saudável e natural."

Mecanismo Único da Solução:
"A solução para esse problema é o "Smoothie Detox Turbo", um método revolucionário que combina ingredientes naturais poderosos para desintoxicar o corpo, equilibrar os hormônios e acelerar o metabolismo, promovendo a queima de gordura de forma eficaz e rápida. Com o "Smoothie Detox Turbo", as mulheres na faixa etária de 28 a 40 anos podem emagrecer 5kg em apenas 21 dias, de maneira saudável e sustentável."
`;

const MecanismoUnico = () => {
  const moduleType = "Mecanismo Único";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={mecanismoUnicoFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default MecanismoUnico;
