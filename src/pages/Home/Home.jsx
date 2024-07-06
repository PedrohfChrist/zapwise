import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarningBar from "@/components/WarningBar";
import {
  ChatBubbleIcon,
  CheckCircledIcon,
  ClipboardIcon,
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
  GearIcon,
  HeadingIcon,
  HeartIcon,
  InstagramLogoIcon,
  LayersIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
  PlayIcon,
  RocketIcon,
  SpeakerLoudIcon,
  TextAlignJustifyIcon,
  VideoIcon,
} from "@radix-ui/react-icons";

const models = {
  anúncios: [
    {
      title: "Facebook Ads | Título",
      description:
        "Gerador de títulos para anúncio de Facebook Ads. Títulos persoasivos para chamar atenção e atrair o usuário.",
      icon: <HeadingIcon />,
      badgeColor: "bg-cyan-300",
      route: "/create/fb-ads-title",
    },
    {
      title: "Facebook Ads | Texto",
      description:
        "Gerador de textos para anúncio de Facebook Ads. Este gerador cria textos com storytelling, o que produz um altíssimo CTR em seu anúncio.",
      icon: <TextAlignJustifyIcon />,
      badgeColor: "bg-cyan-300",
      route: "/create/fb-ads-text",
    },
    {
      title: "Vídeo Ads | Roteiro 1-2 min",
      description:
        "Crie um vídeo de anúncio com 1 a 2 minutos. Para: Facebook Ads.",
      icon: <VideoIcon />,
      badgeColor: "bg-cyan-300",
      route: "/create/video-ads",
    },
  ],
  páginas: [
    {
      title: "Página de Vendas",
      description:
        "Crie uma página de vendas completa para vender o seu produto. Respoda as perguntas de maneira clara, precisa e única e o resultado será incrível!",
      icon: <RocketIcon />,
      badgeColor: "bg-green-300",
      route: "/create/pagina-vendas",
    },
    {
      title: "Página de Captura",
      description:
        "Crie uma página que atrai e converte visitantes em leads valiosos.",
      icon: <ClipboardIcon />,
      badgeColor: "bg-green-300",
      route: "/create/pagina-captura",
    },
    {
      title: "Página de Agradecimentos",
      description:
        "Crie páginas para agradecer e engajar clientes após uma ação (compra ou cadastro).",
      icon: <HeartIcon />,
      badgeColor: "bg-green-300",
      route: "/create/pagina-agradecimento",
    },
    {
      title: "Depoimentos",
      description:
        "Gere depoimentos para credibilizar seu produto em sua página.",
      icon: <ChatBubbleIcon />,
      badgeColor: "bg-green-300",
      route: "/create/depoimentos",
    },
  ],
  VSL: [
    {
      title: "Roteiro VSL",
      description:
        "Gere um roteiro VSL completo, de 4 a 6 minutos para converter leads e vender um produto.",
      icon: <VideoIcon />,
      badgeColor: "bg-red-300",
      route: "/create/roteiro-vsl",
    },
    {
      title: "Roteiro VSL Upsell",
      description:
        "Crie um roteiro poderoso para VSL de Upsell. Aumente seu ticket médio e maximize seus lucros.",
      icon: <VideoIcon />,
      badgeColor: "bg-red-300",
      route: "/create/roteiro-vsl-upsell",
    },
  ],
  "e-mail": [
    {
      title: "E-mail Carrinho Abandonado",
      description:
        "Gere um e-mail para converter leads que abandonaram o carrinho e ainda não finalizaram a compra.",
      icon: <EnvelopeClosedIcon />,
      badgeColor: "bg-yellow-200",
      route: "/create/email-carrinho-abandonado",
    },
    {
      title: "E-mail Boleto Gerado",
      description:
        "Converta boletos gerados que ainda não foram pagos. Pode ser usado no Whatsapp também.",
      icon: <EnvelopeClosedIcon />,
      badgeColor: "bg-yellow-200",
      route: "/create/email-boleto",
    },
  ],
  Oferta: [
    {
      title: "Nome do Produto",
      description:
        "Crie um nome cativante e memorável para seu produto ou serviço que ressoe com seu público-alvo.",
      icon: <Pencil1Icon />,
      badgeColor: "bg-purple-300",
      route: "/create/oferta-nome",
    },
    {
      title: "Nicho e Subnicho",
      description:
        "Defina o nicho e o subnicho para o qual sua oferta é direcionada. Isso ajuda a segmentar e atrair o público certo.",
      icon: <LayersIcon />,
      badgeColor: "bg-purple-300",
      route: "/create/oferta-nicho",
    },
    {
      title: "Mecanismo Único",
      description:
        "Descreva o mecanismo único que diferencia sua oferta das demais. Explique como seu produto ou serviço resolve os problemas do seu publico de uma maneira exclusiva.",
      icon: <GearIcon />,
      badgeColor: "bg-purple-300",
      route: "/create/oferta-mecanismo",
    },
    {
      title: "Promessa Principal",
      description:
        "Crie a promessa principal da sua oferta. Esta é a promessa central que seu produto ou serviço entrega ao cliente.",
      icon: <CheckCircledIcon />,
      badgeColor: "bg-purple-300",
      route: "/create/oferta-promessa",
    },
  ],
};

const filterLabels = {
  todos: "Todos",
  anúncios: "Anúncios",
  páginas: "Páginas",
  VSL: "VSL",
  "e-mail": "E-mail",
  Oferta: "Oferta",
};

export default function Home() {
  const [filter, setFilter] = useState("todos");
  const navigate = useNavigate();

  const handleFilterClick = (filter) => {
    setFilter(filter);
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  const filteredModels =
    filter === "todos" ? Object.values(models).flat() : models[filter];

  return (
    <main className="p-5 w-full overflow-y-auto">
      <WarningBar />
      <div className="mt-28">
        <h1 className="text-2xl font-semibold mb-8 sm:text-left text-center">
          Modelos
        </h1>
        <div className="flex sm:justify-start justify-center flex-wrap mb-6">
          {Object.keys(filterLabels).map((item) => (
            <button
              key={item}
              onClick={() => handleFilterClick(item)}
              className={`px-2 py-1 m-1 rounded-md border hover:bg-input ${
                filter === item
                  ? "bg-input text-primary font-semibold border-primary/20"
                  : "bg-background text-foreground"
              }`}
            >
              {filterLabels[item]}
            </button>
          ))}
        </div>

        {Object.keys(models).map((category) => (
          <div
            key={category}
            className={`${
              filter !== "todos" && filter !== category ? "hidden" : ""
            }`}
          >
            <h1 className="text-xl font-semibold mb-6 mt-10">
              {filterLabels[category]}
            </h1>
            <div
              className="grid gap-6 mb-10"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {models[category].map((model, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(model.route)}
                  className="border p-4 rounded-xl bg-card min-h-[200px] relative cursor-pointer transform transition-shadow duration-200 hover:shadow-[0_0_5px_rgba(0,0,0,0.15)]"
                >
                  <div
                    className={`absolute p-1.5 rounded-md ${model.badgeColor}`}
                  >
                    <span className="text-sm text-[#010816]">{model.icon}</span>
                  </div>
                  <h3 className="pt-4 text-md font-medium mt-8">
                    {model.title}
                  </h3>
                  <p className="text-foreground/50 mt-2 text-sm">
                    {model.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
