import React from "react";
import CopyModule from "@/components/CopyModule";
import { VideoIcon } from "@radix-ui/react-icons";

const fbVideoAdsFields = [
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
      "Ex.: O metabolismo lento das mulheres após os 30 anos devido à falta de nutrientes essenciais.",
    size: "h-24",
  },
  {
    name: "targetGender",
    label: "Qual o gênero do Público Alvo?",
    type: "select",
    options: ["Homens", "Mulheres", "Ambos"],
    defaultValue: "Ambos",
  },
];

const promptTemplate = `
Crie uma copywriting envolvente e persuasiva para um anúncio em vídeo no Facebook. Este vídeo deve chamar a atenção do lead, gerar conexão e levá-lo a clicar no anúncio para ir para a página de destino. Não estamos vendendo no anúncio, apenas queremos levar o lead para a landing page. Utilize storytelling para aumentar a conexão com o lead e melhorar o CTR. Aqui estão os detalhes:

1. **Promessa Principal**:
{{mainPromise}}

2. **Raiz do Problema**:
{{rootProblem}}

3. **Gênero do Público Alvo**:
{{targetGender}}

Não deve ser um roteiro para o vídeo, deve ser a copy para esse vídeo. Não deve ser separado em tópicos, cenas e narradores, deve ser a copy completa.

3 Exemplos de copys:

1. Você tem lutado com a balança e cada nova dieta parece apenas mais uma batalha perdida? Sinto dizer, mas o adversário que você não enxerga está bem aí dentro de você: um metabolismo que teima em funcionar a passos de tartaruga. Toda mulher sabe que com o avançar dos anos, o corpo não responde mais da mesma forma, acumula-se gordura, a energia diminui e até aquela dieta "milagrosa" não traz os resultados prometidos. Mas se eu lhe disser que a chave para finalmente se livrar desses indesejáveis 5 quilos está justamente em ativar seu metabolismo?

Eu descobri que não são apenas as restrições alimentares que moldam nosso contorno; é o modo como nosso organismo processa o combustível que ingerimos! Abrindo o caminho certo, o seu próprio corpo fará o trabalho pesado, sem punições, apenas seguindo o ritmo da natureza.

Eureka! Deparei-me com uma solução engenhosamente simples: o Método Metabolismo Ativo. Ele direciona exatamente para o cerne da questão, sem rodeios ou meias-verdades. Já imaginou, em apenas 7 dias, acordar, se olhar no espelho e vislumbrar uma transformação autêntica, sem sacrificar suas comidas prediletas?

É hora de reescrever sua história e fazer as pazes com seu corpo. Clique agora e deixe-se surpreender pelo poder de uma transformação sustentável que aguarda por você com o Método Metabolismo Ativo. Porque você merece liberar todo o seu potencial e brilhar ainda mais!


2. Olá, querida amiga! Se você está cansada de lutar contra a balança, de testar todas as dietas e ainda assim não ver os resultados que deseja, eu compreendo sua frustração. A verdade dolorosa é que não é apenas sobre o que você come ou deixa de comer. A chave está no seu metabolismo que, com o passar dos anos, desacelera e sabotagem silenciosamente seus esforços.

Você não está sozinha nessa. Milhares de mulheres enfrentam essa barreira invisível todos os dias, uma luta injusta contra um metabolismo lento que te impede de atingir seu corpo dos sonhos. A boa notícia? Existe uma saída, e ela está mais próxima do que você imagina.

Eu descobri um segredo, e não se trata de mais uma pílula milagrosa ou promessas vazias. Estou falando de desbloquear o poder do seu Metabolismo Ativo, um caminho natural que permite a você perder incríveis 5 quilos em uma semana, sem sacrificar os prazeres da comida. Sim, você ouviu direito: sem cortes rigorosos, sem fome, apenas seguindo um método que realinha seu corpo a trabalhar a seu favor.

Está pronta para libertar-se das amarras do metabolismo lento e reencontrar o equilíbrio? Então não perca mais um segundo. Clique agora no botão "Saiba mais" e descubra o método que está transformando vidas. Assista ao vídeo e veja como é realmente possível perder peso de maneira eficaz e duradoura, sem abrir mão de saborear a vida.

Te espero do outro lado para juntas conquistarmos essa vitória!


3. Quando o assunto é conquistar mulheres, eu entendia a agonia que era estar no seu lugar. O peito apertado pela insegurança, as palavras me fugiam e o medo da rejeição era como algemas invisíveis que paralisavam qualquer iniciativa. Tudo isso regado a uma inquietante sensação de solitude em meio a uma multidão.

Eis que, em um desses dias tingidos pela insípida cor da solidão, tropecei no desconhecido. Em meio a labirintos de teorias e técnicas falhas, encontrei o que parecia impossível: uma chave que decifra qualquer defesa, um mapa que conduz ao núcleo do desejo feminino em surpreendentes 30 segundos.

E não se engane, não é qualquer conto da carochinha que ecoa nas esquinas do desespero - é o acesso a uma linguagem secreta. Uma compreensão profunda do psique feminino que me fez mestre no jogo da conquista, sem macetes desgastados ou frases ensaiadas.

Hoje, sem rodeios, desafio você: esqueça aquelas fórmulas batidas que mais parecem receitas de bolo. Vou mostrar-lhe o caminho real para uma confiança inabalável que atrai, seduz e magnetiza. A chave já está bem aqui, nas entrelinhas da sua coragem.

Eu sei como é estar do seu lado, e prometo-lhe, isso será coisa do passado. Sou o seu aliado nessa jornada, aquele que venceu a luta que você trava. Siga-me e testemunhe a mudança. Basta um clique abaixo para embarcar na virada que vai despertar a paixão e o desejo aonde quer que você vá.
`;

const FbVideoAds = () => {
  const moduleType = "Facebook Video Ads";

  return (
    <CopyModule
      moduleType={moduleType}
      fields={fbVideoAdsFields}
      promptTemplate={promptTemplate}
    />
  );
};

export default FbVideoAds;
