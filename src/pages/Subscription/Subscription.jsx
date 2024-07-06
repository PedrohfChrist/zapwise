import React from "react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Separator } from "@/shadcn/components/ui/separator";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Premium anual",
    fullPrice: "1164",
    price: "69,56",
    features: [
      { text: "20.000 palavras/mês", included: true },
      { text: "Histórico ilimitado", included: true },
      { text: "Acesso a 11 módulos", included: true },
      { text: "Editor ilimitado", included: true },
      { text: "Suporte Premium", included: true },
      { text: "Módulo de VSL", included: false },
      { text: "Módulo de Página de Vendas", included: false },
      { text: "Gerador de Voz I.A", included: false },
      { text: "Criador de E-book", included: false },
      { text: "Testes A/B", included: false },
    ],
    bgColor: "bg-backgoundsub-foreground",
    borderColor: "border",
    buttonColor: "bg-backgoundsub-foreground",
    buttonTextColor: "text-foreground",
    buttonBorderColor: "border-foreground",
    planId: "premium-anual", // ID do plano no Kirvano
  },
  {
    name: "PRO anual",
    nameColor: "text-primary",
    fullPrice: "3586",
    price: "149,42",
    priceColor: "text-primary",
    features: [
      { text: "100.000 palavras/mês", included: true },
      { text: "Histórico ilimitado", included: true },
      { text: "Acesso todos módulos", included: true },
      { text: "Editor ilimitado", included: true },
      { text: "Suporte Premium", included: true },
      { text: "Módulo de VSL", included: true },
      { text: "Módulo de Página de Vendas", included: true },
      { text: "Gerador de Voz I.A", included: true },
      { text: "Criador de E-book", included: true },
      { text: "Testes A/B", included: true },
    ],
    bgColor: "bg-backgoundsub-foreground",
    borderColor: "border-primary",
    borderWidth: "border-2",
    buttonColor: "bg-primary",
    buttonTextColor: "text-textopedro",
    buttonBorderColor: "border-border",
    planId: "pro-anual", // ID do plano no Kirvano
  },
  {
    name: "Enterprise anual",
    fullPrice: "6776",
    price: "299,11",
    features: [
      { text: "300.000 palavras/mês", included: true },
      { text: "Histórico ilimitado", included: true },
      { text: "Acesso todos módulos", included: true },
      { text: "Editor ilimitado", included: true },
      { text: "Suporte Premium", included: true },
      { text: "Módulo de VSL", included: true },
      { text: "Módulo de Página de Vendas", included: true },
      { text: "Gerador de Voz I.A", included: true },
      { text: "Criador de E-book", included: true },
      { text: "Testes A/B", included: true },
      {
        text: "Acesso a funcionalidades Beta",
        included: true,
      },
    ],
    bgColor: "bg-backgoundsub-foreground",
    borderColor: "border",
    buttonColor: "bg-backgoundsub-foreground",
    buttonTextColor: "text-foreground",
    buttonBorderColor: "border-foreground",
    planId: "enterprise-anual", // ID do plano no Kirvano
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { setSubscriptionStatus } = useSubscription();

  const handleSubscription = (planId) => {
    // Redirecionar para a página de pagamento do Kirvano
    // Substitua este link quando a integração estiver pronta
    window.location.href = `https://app.kirvano.com/checkout/${planId}`;
  };

  return (
    <div className="p-8 bg-backgoundsub min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Um plano perfeito para você
      </h1>
      <p className="mb-12 text-center text-lg text-foreground/70 font-medium">
        Escolha seu plano, gere a suas copys e comece a vender já nos próximos
        minutos. Acostume-se com a facilidade do CopyMax!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-8 w-full items-center sm:items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl shadow-md p-6 w-full max-w-xs text-left border ${plan.bgColor} ${plan.borderColor} ${plan.borderWidth} flex flex-col`}
          >
            <div className="flex-grow">
              <h2 className="mb-3 ">
                <button
                  className={`px-4 py-1 mb-3 text-sm text-foreground/80 font-medium uppercase bg-muted/40 cursor-default rounded-2xl border border-bordabotao-foreground ${plan.nameColor}`}
                >
                  {plan.name}
                </button>
              </h2>

              <Separator className="bg-bordabotao" />

              <p className="text-base mt-6 font-normal mb-2 text-foreground/80">
                De{" "}
                <span className="text-[#ff4258] line-through">
                  {plan.fullPrice}
                </span>{" "}
                por apenas:
              </p>

              <p className="text-3xl font-semibold mb-7">
                <span className="text-2xl font-medium">12x de </span>
                <span className={`${plan.priceColor}`}>{plan.price}</span>
              </p>

              <Separator className="bg-bordabotao" />
              <ul className="text-sm mb-6 mt-6 text-left ">
                {plan.features.map((feature, index) => (
                  <li key={index} className="mb-3 flex items-center">
                    {feature.included ? (
                      <CheckIcon className="w-4 h-4 mr-2 text-primary bg-backgoundsub rounded-2xl p-[2px]" />
                    ) : (
                      <Cross1Icon className="w-4 h-4 mr-2 text-white bg-destructive rounded-2xl p-[2px]" />
                    )}
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`py-3 px-4 rounded-md text-sm font-medium uppercase transition duration-300 border border-bordabotao-foreground ${plan.buttonColor} ${plan.buttonTextColor} ${plan.buttonBorderColor}`}
              onClick={() => handleSubscription(plan.planId)}
            >
              ASSINAR AGORA
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
