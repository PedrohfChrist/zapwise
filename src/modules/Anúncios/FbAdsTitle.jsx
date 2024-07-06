import React from "react";
import CopyModule from "@/components/CopyModule";
import { HeadingIcon } from "@radix-ui/react-icons";

const fbAdsTitleFields = [
  {
    name: "mainPromise",
    label: "Promessa Principal",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias comendo o que gosta com o método Metabolismo Ativo.",
    size: "h-24",
  },
  {
    name: "mechanism",
    label: "Mecanismo Único",
    type: "textarea",
    placeholder:
      "Ex.: Solucione este problema com o Metabolismo Ativo, um programa que reeduca o metabolismo através de um plano alimentar personalizado, incluindo alimentos termogênicos que aceleram a queima de gordura.",
    size: "h-24",
  },
  {
    name: "headlinesNumber",
    label: "Número de Headlines",
    type: "select",
    options: ["1", "2", "3", "4", "5"],
    default: "1",
  },
];

const promptTemplate = `
Crie exatamente {headlinesNumber} headlines para anúncios do Facebook usando as seguintes informações:

Promessa Principal: {mainPromise}
Mecanismo Único: {mechanism}

As headlines devem ser cativantes, direcionadas ao público-alvo e destacar os benefícios principais. As headlines não podem ser "blacks", ou seja, ofertas muito agressivas, promessas mirabolantes, etc. Se caso na Promessa Principal possua uma oferta "black", desconsidere-a e transforme-a em "white". Utilize os gatilhos de curiosidade, controvérsia e autoridade para garantir que as headlines sejam "white" e não corram risco de bloqueio pelas póliticas do Facebook ADS. 

Use os seguintes exemplos apenas como referência:

1. Sua {Solução atual} pode passar no ... Teste?
   Exemplo: Seu desodorante pode passar no teste de estresse?
2. Nós {fazemos isso}, mas a diferença é {diferença}
   Exemplo: Nós vendemos barcos, mas a diferença é que eles nunca adundam.
3. {Público}: é hora de parar o {Problema}. Use {Solução}
   Exemplo: Profissionais de marketing: é hora de parar de usar métodos antigos. Use a nova técnica de SEO.
4. O maior (e mais fácil) segredo de {Resultado Desejado}
   Exemplo: O maior (e mais fácil) segredo dos unicórnios de startup é a inovação disruptiva.
5. Faça com que o {Resultado Desejado} seja importante
   Exemplo: Faça postagens de blog importantes
6. Descubra como {Solução} pode mudar seu {Resultado Desejado}
   Exemplo: Descubra como o Metabolismo Ativo pode mudar seu corpo em apenas 30 dias
7. {Público}, você está preparado para {Solução}?
   Exemplo: Mulheres, você está preparada para transformar seu corpo com o Metabolismo Ativo?
8. O que {Solução} pode fazer por você em apenas {Tempo}?
   Exemplo: O que o Metabolismo Ativo pode fazer por você em apenas 30 dias?
9. A verdade surpreendente sobre {Problema} e como {Solução} pode ajudar
   Exemplo: A verdade surpreendente sobre a perda de peso e como o Metabolismo Ativo pode ajudar
10. Veja como {Público} está usando {Solução} para {Resultado Desejado}
    Exemplo: Veja como mulheres estão usando o Metabolismo Ativo para perder peso rapidamente

Gere apenas {headlinesNumber} headlines, usando os exemplos acima apenas como referência.
`;

const FbAdsTitle = () => {
  const moduleType = "Facebook Ads | Título";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={fbAdsTitleFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default FbAdsTitle;
