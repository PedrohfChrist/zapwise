import React from "react";
import CopyModule from "@/components/CopyModule";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

const depoimentosFields = [
  {
    name: "name",
    label: "Qual o nome do produto?",
    type: "text",
    placeholder: "Ex.: Metabolismo Ativo",
  },
  {
    name: "productDescription",
    label: "Descreva a empresa ou produto brevemente:",
    type: "textarea",
    placeholder:
      "Ex.: O Metabolismo Ativo é um programa inovador de emagrecimento...",
    size: "h-24",
  },
  {
    name: "keywords",
    label: "Até 3 Palavras-chave (separadas por vírgula)",
    type: "text",
    placeholder: "Ex.: Emagrecer, Gordura, Autoestima",
  },
  {
    name: "contentLength",
    label: "Tamanho do conteúdo",
    type: "select",
    options: ["Curto", "Médio", "Longo"],
    default: "Curto", // Valor padrão selecionado
  },
  {
    name: "testimonialCount",
    label: "Quantos depoimentos deseja gerar?",
    type: "select",
    options: ["1", "2", "3", "4", "5"],
    default: "1",
  },
];

const promptTemplate = `
Gere depoimentos realistas e humanos para páginas web. Utilize as informações fornecidas para criar depoimentos que pareçam autênticos e envolventes, incluindo ocasionalmente abreviações e gírias comuns na internet. Aqui estão os detalhes:

1. Nome do Produto: {{name}}
2. Descrição do Produto: {{productDescription}}
3. Palavras-chave: {{keywords}}
4. Tamanho do depoimento: {{contentLength}}
5. Quantidade de depoimentos a serem gerados: {{testimonialCount}}

Gere depoimentos realistas e humanos para o produto, com base nas informações fornecidas. Não dê introduções ou descrições, apenas o depoimento.

`;

const Depoimentos = () => {
  const moduleType = "Depoimentos";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={depoimentosFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default Depoimentos;
