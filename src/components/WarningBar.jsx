import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "@/hooks/useAuthContext";

export default function WarningBar({ disabled }) {
  const navigate = useNavigate();
  const { subscriptionStatus } = useSubscriptionContext();
  const { user } = useAuthContext();

  const commonStyles = `text-white p-2 text-center rounded-lg flex flex-col items-center gap-2 ${
    disabled ? "opacity-50 pointer-events-none" : ""
  } sm:flex-row sm:justify-between sm:max-w-screen-lg sm:mx-auto sm:mt-4`;

  const containerStyles = {
    margin: "0 auto",
    top: "1rem",
    width: "fit-content",
  };

  if (user.uid === "Y05s3draE8NnHgOLPlUbqLeOdlH2") {
    return null; // Não exibir nada para o administrador
  }

  const renderContent = (
    bgColor,
    icon,
    message,
    buttonText,
    buttonColor,
    daysLeft
  ) => (
    <div className={`${bgColor} ${commonStyles}`} style={containerStyles}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm sm:text-base">
          {daysLeft && (
            <>
              Faltam <span className="font-semibold">{daysLeft} dias</span> para
              acabar seu trial |
            </>
          )}
          <span className="font-semibold">{message}</span>
        </span>
        <button
          className={`bg-white ${buttonColor} px-3 py-1.5 rounded-md text-sm font-bold transition transform hover:scale-105 ml-2`}
          onClick={() => navigate("/subscription")}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  if (!subscriptionStatus.isPaid) {
    return renderContent(
      "bg-destructive",
      <CounterClockwiseClockIcon className="hidden sm:block" />,
      "Você não tem um plano ativo | Escolha um plano para continuar usando o Copy Max",
      "Escolher plano",
      "text-destructive"
    );
  }

  if (subscriptionStatus.isFreeTrial) {
    return renderContent(
      "bg-primary",
      <CounterClockwiseClockIcon className="hidden sm:block" />,
      "Faltam " +
        subscriptionStatus.daysLeft +
        " dias para acabar seu trial | Garanta 50% OFF assinando o plano anual",
      "Assinar agora",
      "text-primary",
      subscriptionStatus.daysLeft
    );
  }

  return null;
}
