import React from "react";
import CopyModule from "@/components/CopyModule";

const fbAdsTextFields = [
  {
    name: "productDescription",
    label: "Descreva seu produto ou solução",
    type: "textarea",
    placeholder:
      "Ex.: O Metabolismo Ativo é um programa de emagrecimento que acelera a queima de gordura...",
    size: "h-24", // Especifica a altura da textarea
  },
];

const promptTemplate = `
Crie um texto de anúncio para o Facebook Ads utilizando uma abordagem de storytelling, inspirado no estilo de Jon Benson. O objetivo principal é gerar cliques e levar o lead para a página de vendas. Use as seguintes informações:

Descrição do Produto: {productDescription}

O texto deve seguir a estrutura de storytelling:
1. **Introdução**: Comece com uma introdução envolvente que capture a atenção do leitor imediatamente.
2. **Desafio**: Descreva um desafio ou problema que o público enfrenta.
3. **Solução**: Apresente a solução, que é o produto ou serviço descrito.
4. **Benefícios**: Destaque os benefícios específicos e como o produto/serviço resolve o problema.
5. **Curiosidade**: Gere curiosidade sobre o que mais o lead pode descobrir ou ganhar ao clicar no link.
6. **Chamada para Ação**: Termine com uma chamada para ação clara e persuasiva, incentivando o leitor a clicar no link e visitar a página de vendas.

Não considere separar pro tópicos como a estrutura acima, a copy deve ser contínua.

Certifique-se de que o texto seja envolvente, convincente e evite qualquer conteúdo que possa ser considerado "black" ou violar as políticas do Facebook. Use técnicas de copywriting avançadas para garantir um texto poderoso e eficaz.

Gere um texto de anúncio para o Facebook Ads seguindo este estilo de storytelling, utilizando as informações fornecidas na descrição do produto.
`;

const FbAdsText = () => {
  const moduleType = "Facebook Ads | Texto";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={fbAdsTextFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default FbAdsText;
