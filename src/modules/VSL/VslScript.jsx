import React from "react";
import CopyModule from "@/components/CopyModule";
import { VideoIcon } from "@radix-ui/react-icons";

const vslScriptFields = [
  {
    name: "mainPromise",
    label: "Qual é a Promessa Principal?",
    type: "textarea",
    placeholder:
      "Ex.: Perca 5 quilos em 30 dias comendo o que gosta com o método Metabolismo Ativo.",
    size: "h-24",
  },
  {
    name: "rootProblem",
    label: "Qual a Raiz do Problema?",
    type: "textarea",
    placeholder:
      "Ex.: O problema está no metabolismo lento das mulheres, devido ao envelhecimento e à falta de nutrientes essenciais.",
    size: "h-24",
  },
  {
    name: "targetGender",
    label: "Qual é o gênero do Público Alvo?",
    type: "select",
    options: ["Homens", "Mulheres", "Ambos"],
    defaultValue: "Ambos", // Valor padrão selecionado
  },
  {
    name: "targetAge",
    label: "Qual a idade do seu público alvo?",
    type: "select",
    options: ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
    defaultValue: "25-34", // Valor padrão selecionado
  },
  {
    name: "characterExpertName",
    label: "Qual o nome do expert? (Personagem Principal)",
    type: "textarea",
    placeholder: "Ex.: Aline Santos",
  },
  {
    name: "targetProblem",
    label:
      "O que essa pessoa mais deseja ou qual problema ela está tentando resolver?",
    type: "textarea",
    placeholder: "Ex.: Deseja perder peso de forma saudável e eficaz.",
    size: "h-24",
  },
];

const promptTemplate = `
Crie uma copywriting de VSL (Video Sales Letter) baseado nos 42 passos de Jon Benson. A VSL deve ser contínua e persuasiva, cobrindo todos os aspectos necessários para uma venda eficaz. Essa VSL deve conter entre 3000 a 5000 palavras no total. Use as informações fornecidas para criar a VSL:

1. Promessa Principal: {{mainPromise}}
2. Raiz do Problema: {{rootProblem}}
3. Gênero do Público Alvo: {{targetGender}}
4. Idade do Público Alvo: {{targetAge}}
5. Nome do Expert/Narrador: {{characterExpertName}}
6. Problema do Público Alvo: {{targetProblem}}

Siga os passos abaixo de maneira contínua e persuasiva:

1. Atenção: Grande promessa, prova, história, questão, interrupção de padrão.
2. Identificar o problema: Estabeleça o problema, apresente o herói.
3. Agravar o problema: Fatos, exemplos, demonstração, história.
4. Apresente a solução: Introduza seu produto.
5. Estabeleça autoridade: Quem é você e por que ouvir você.
6. Ligue a modéstia: Mostre que você é de carne e osso.
7. Conte a história por trás: Como você chegou à solução.
8. Tudo pode piorar: Descreva a pior parte do problema.
9. Tudo pode piorar ainda mais: Descreva o ponto crítico.
10. O grande basta: Declare que encontrará uma solução.
11. O treino silencioso do samurai: O que você fez para concretizar sua promessa.
12. A descoberta nada óbvia: Enfatize que o caminho não foi óbvio.
13. Loop da grande mentira: Descreva 1-3 mentiras/mitos.
14. Não é você quem é burro: Explique que o problema não é culpa deles.
15. Esse sempre foi o problema: Diga quem é o culpado.
16. A verdade: Desmistifique as mentiras.
17. Loop para a solução: Abra um loop para a grande solução.
18. A dica placebo de ouro: Diga o que evitar, aproveitar e fazer.
19. A transição para o sonho realizado: Ofereça duas escolhas, revele o nome do produto.
20. Apresente seu produto: Diga o nome do produto.
21. Explique os grandes benefícios: Detalhe os benefícios do produto.
22. Elimine suas maiores objeções: Quebre as objeções comuns.
23. Para quem esse produto não é: Diga o que o produto não é.
24. Um pequeno spoiler do preço: Crie suspense sobre o preço.
25. Adicione bônus: Aumente o valor percebido.
26. Novo spoiler do preço falso: Totalize o valor dos bônus.
27. Você não vai querer perder isso: Diga o que irão perder se não comprarem.
28. Motivo para condição especial: Dê uma justificativa para o desconto.
29. Revele sua oferta irresistível: Corte o preço falso.
30. Garantia: Enfatize a qualidade e satisfação garantida.
31. Faça uma chamada para ação (CTA #1): Diga como fazer o pedido.
32. Crie o seu "eu" do futuro: Descreva como será a vida com o produto.
33. Dê um lembrete: Lembre a dor de não agir e o prazer de agir.
34. Tapa nas costas: Diga que o negócio não durará para sempre.
35. Esclarecendo a entrega: Instrua sobre o que fazer após comprar.
36. Faça a oferta (CTA #2): Reafirme os benefícios e diga o que fazer a seguir.
37. Faça um aviso: Injetar escassez, prazo, lembre o custo de não agir.
38. Preço irrisório: Ressalte o valor do produto.
39. Faça a última oferta (CTA #3): Dê uma última chance para agir.
40. Elimine todas as objeções que sobraram: Remova quaisquer motivos restantes para não comprar.
41. Prova social [Opcional]: Feche com histórias/testemunhos de clientes.

Gere a copywriting da VSL completa seguindo esses passos de maneira contínua e persuasiva, sem introduções ou separações de tópicos e cenas, apenas a copy.
`;

const VslScript = () => {
  const moduleType = "Roteiro VSL";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={vslScriptFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default VslScript;
