import React, { useState } from "react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Separator } from "@/shadcn/components/ui/separator";
import { Switch } from "@/shadcn/components/ui/switch";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";

const monthlyPlans = [
  {
    name: "Plano Starter",
    price: 69,
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
    planId: "ae5c73c3-77bf-4502-b751-80c5a8079c85",
  },
  {
    name: "Plano Premium",
    price: 149,
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
    planId: "a5d04d64-948b-42bd-bd92-b950c0ee8642",
  },
  {
    name: "Plano PRO",
    price: 469,
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
    planId: "1a282998-2f68-4e24-8515-b1a1ad8a55e5",
  },
];

const annualPlans = [
  {
    name: "Plano Starter",
    fullPrice: 828,
    price: 699,
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
    planId: "352e6d0a-0aec-49f7-92fe-56777d5bbc68",
  },
  {
    name: "Plano Premium",
    fullPrice: 1788,
    price: 1499,
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
    planId: "81dcd29a-75ee-43c3-9820-42eaeb263b2f",
  },
  {
    name: "Plano PRO",
    fullPrice: 5628,
    price: 4799,
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
    planId: "82c81764-13c1-4a16-ac92-dbeb07d84e1a",
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const { setSubscriptionStatus } = useSubscriptionContext();
  const [isAnnual, setIsAnnual] = useState(false);
  const [prevPrices, setPrevPrices] = useState(
    monthlyPlans.map((plan) => plan.price)
  );
  const [prices, setPrices] = useState(monthlyPlans.map((plan) => plan.price));
  const plans = isAnnual ? annualPlans : monthlyPlans;

  const handleSwitch = () => {
    const newPrices = isAnnual
      ? monthlyPlans.map((plan) => plan.price)
      : annualPlans.map((plan) => plan.price);
    setPrevPrices(prices);
    setPrices(newPrices);
    setIsAnnual(!isAnnual);
  };

  const handleSubscription = (planId) => {
    window.location.href = `https://pay.kirvano.com/${planId}`;
  };

  return (
    <div className="p-8 bg-backgoundsub min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Um plano perfeito para você
      </h1>
      <p className="text-center text-lg text-foreground/70 font-medium my-4">
        Escolha seu plano, gere a suas copys e comece a vender já nos próximos
        minutos. Acostume-se com a facilidade do CopyMax!
      </p>
      <div className="flex items-center text-center sm:text-base text-sm mb-8 mt-3">
        <span>Por mês</span>
        <Switch
          checked={isAnnual}
          onCheckedChange={handleSwitch}
          className="mx-2"
        />
        <span>Anual - Economize 15%</span>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-8 w-full items-center sm:items-stretch">
        {plans.map((plan, index) => {
          return (
            <div
              key={plan.name}
              className={`rounded-xl shadow-md p-6 w-full max-w-xs text-center border ${plan.bgColor} ${plan.borderColor} ${plan.borderWidth} flex flex-col`}
            >
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-semibold">{plan.name}</h2>

                <Separator className="bg-bordabotao mb-6" />

                {isAnnual && (
                  <p className="text-base mt-6 font-normal mb-2 text-foreground/80">
                    De{" "}
                    <span className="text-[#ff4258] line-through">
                      {plan.fullPrice}
                    </span>{" "}
                    por apenas:
                  </p>
                )}

                <p className="text-4xl font-semibold mb-4">
                  <span className="align-top text-sm pr-1">R$</span>
                  <span className={`${plan.priceColor}`}>
                    <CountUp
                      start={prevPrices[index]}
                      end={prices[index]}
                      duration={0.5}
                    />
                  </span>
                  <span className="text-base pl-1 font-normal">
                    /{isAnnual ? "anual" : "mês"}
                  </span>
                </p>

                <Separator className="bg-bordabotao mb-6" />
                <ul className="text-sm mb-6 text-left">
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
          );
        })}
      </div>
    </div>
  );
}
