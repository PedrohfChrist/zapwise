import React from "react";
import CopyModule from "@/components/CopyModule";
import { VideoIcon } from "@radix-ui/react-icons";

const vslUpsellFields = [
  {
    name: "name",
    label: "Nome do Produto Principal",
    type: "text",
    placeholder: "Ex.: Curso de Emagrecimento Rápido",
  },
  {
    name: "mainProductBenefits",
    label: "Benefícios do Produto Principal",
    type: "textarea",
    placeholder: "Ex.: Benefício 1, Benefício 2, Benefício 3...",
    size: "h-24",
  },
  {
    name: "mainProductProblems",
    label: "Problemas Resolvidos pelo Produto Principal",
    type: "textarea",
    placeholder: "Ex.: Problema 1, Problema 2, Problema 3...",
    size: "h-24",
  },
  {
    name: "upsellProductName",
    label: "Nome do Produto de Upsell",
    type: "text",
    placeholder: "Ex.: Plano de Nutrição Personalizado",
  },
  {
    name: "upsellProductDescription",
    label: "Descrição do Produto de Upsell",
    type: "textarea",
    placeholder: "Ex.: Descrição detalhada do produto ou serviço de upsell...",
    size: "h-24",
  },
  {
    name: "upsellProductBenefits",
    label: "Benefícios do Produto de Upsell",
    type: "textarea",
    placeholder: "Ex.: Benefício 1, Benefício 2, Benefício 3...",
    size: "h-24",
  },
  {
    name: "upsellProductPrice",
    label: "Preço do Produto de Upsell",
    type: "text",
    placeholder: "Ex.: R$197,00",
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
    name: "guarantee",
    label: "Detalhes da Garantia",
    type: "select",
    options: ["7 dias", "15 dias", "30 dias", "Nenhuma"],
    defaultValue: "30 dias", // Valor padrão selecionado
  },
];

const promptTemplate = `
Crie uma copywriting de VSL (Video Sales Letter) de Upsell baseado nos passos fornecidos. A VSL deve ser contínua e persuasiva, cobrindo todos os aspectos necessários para uma venda eficaz. Essa VSL deve conter entre 700 a 1500 palavras no total. Use as informações fornecidas para criar a VSL:

1. Nome do Produto Principal: {{name}}
2. Benefícios do Produto Principal: {{mainProductBenefits}}
3. Problemas Resolvidos pelo Produto Principal: {{mainProductProblems}}
4. Nome do Produto de Upsell: {{upsellProductName}}
5. Descrição do Produto de Upsell: {{upsellProductDescription}}
6. Benefícios do Produto de Upsell: {{upsellProductBenefits}}
7. Preço do Produto de Upsell: {{upsellProductPrice}}
8. Idade do Público Alvo: {{targetAge}}
9. Gênero do Público Alvo: {{targetGender}}
10. Detalhes da Garantia: {{guarantee}}

Siga os passos abaixo de maneira contínua e persuasiva:

1. Abertura: Forte com gancho ou Com problema iminente.
2. Confirme a compra do Produto Principal e parabenize.
3. Apresente o novo problema que o Produto de Upsell resolve.
4. Conte uma pequena história relacionada ao novo problema.
5. Apresente a solução (Produto de Upsell).
6. Explique os grandes benefícios do Produto de Upsell.
7. Elimine as maiores objeções que o público pode ter.
8. Ofereça uma garantia para reduzir o risco.
9. Adicione bônus extras, se houver.
10. Finalize com uma chamada para ação forte (CTA).

Gere a copywriting da VSL de Upsell completa seguindo esses passos de maneira contínua e persuasiva, sem introduções ou separações de tópicos e cenas, apenas a copy.
`;

const VslUpsell = () => {
  const moduleType = "Roteiro VSL de Upsell";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={vslUpsellFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default VslUpsell;
