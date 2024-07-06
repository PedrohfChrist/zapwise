import React from "react";
import CopyModule from "@/components/CopyModule";
import { Pencil1Icon } from "@radix-ui/react-icons";

const productNameFields = [
  {
    name: "productDescription",
    label: "Resuma seu produto/solução",
    type: "textarea",
    placeholder: "Descreva brevemente seu produto ou solução...",
  },
  {
    name: "wordCount",
    label: "Quantas palavras deve ter o nome do produto?",
    type: "select",
    options: ["1", "2", "3", "4"],
    default: "1",
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
  {
    name: "nameCount",
    label: "Quantos nomes diferentes você deseja gerar?",
    type: "select",
    options: ["5", "10", "15"],
    default: "5",
  },
];

const promptTemplate = `
Gere nomes para colocar em um produto ou infoproduto. Use neuro-marketing para criar nomes fortes e marcantes. Dê preferência para nomes em português BR, mas é pode usar palavras em ingês também. Utilize as informações fornecidas para criar nomes impactantes. Aqui estão os detalhes:

1. Descrição do Produto: {{productDescription}}
2. Número de Palavras: {{wordCount}}
3. Gênero do Público Alvo: {{targetGender}}
4. Idade do Público Alvo: {{targetAge}}
5. Quantidade de Nomes a Serem Gerados: {{nameCount}}

Gere a lista de nomes fortes e marcantes para o produto. Não dê introduções ou descrições, apenas os nomes.

`;

const ProductName = () => {
  const moduleType = "Nome do Produto";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={productNameFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default ProductName;
