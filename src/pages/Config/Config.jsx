// src/app/Config.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { AuthContext } from "@/contexts/AuthContext";

export default function Config() {
  const { user } = useContext(AuthContext);

  // Exibir config do Firestore
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [cloudAccessToken, setCloudAccessToken] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // Buscar config no Firestore ao montar
  useEffect(() => {
    if (!user?.uid) return;
    const loadConfig = async () => {
      try {
        const resp = await axios.get(
          `/api/user/cloud-config?userId=${user.uid}`
        );
        if (resp.data.success && resp.data.config) {
          setPhoneNumberId(resp.data.config.cloudPhoneNumberId || "");
          setCloudAccessToken(resp.data.config.cloudAccessToken || "");
        }
      } catch (err) {
        console.error("Erro ao carregar config Cloud:", err);
      }
    };
    loadConfig();
  }, [user]);

  // ---- BOTÃO CONECTAR WHATSAPP ----
  const handleConnectWhatsApp = () => {
    if (!user?.uid) {
      setStatusMsg("É preciso estar logado para conectar o WhatsApp.");
      setSuccess(false);
      return;
    }

    const width = 600,
      height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    // Abre o pop-up chamando /api/facebook/connect?userId=xxx
    window.open(
      `/api/facebook/connect?userId=${user.uid}`,
      "popupMeta",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Exibe alguma mensagem? (opcional)
    setStatusMsg("Abrindo pop-up para a Meta...");
    setSuccess(true);
  };

  return (
    <div className="p-6 w-full max-w-xl mx-auto space-y-8">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold text-gray-700">
            Conectar WhatsApp Oficial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Clique para iniciar o fluxo de integração com a API Oficial do
            WhatsApp (via Meta). O pop-up solicitará que você vincule um número
            de telefone. Ao finalizar, volte aqui.
          </p>
          <Button onClick={handleConnectWhatsApp} className="w-full">
            Conectar WhatsApp
          </Button>

          {/* Exibir se já está conectado */}
          <div className="mt-4 p-3 border rounded-md text-sm">
            <p>
              <strong>PhoneNumberId:</strong>{" "}
              {phoneNumberId || "Nenhum (não conectado)"}
            </p>
            <p>
              <strong>AccessToken:</strong>{" "}
              {cloudAccessToken
                ? cloudAccessToken.substring(0, 15) + "... (oculto)"
                : "Nenhum"}
            </p>
          </div>

          {statusMsg && (
            <div
              className={`mt-4 p-3 border rounded-md text-sm text-center ${
                success
                  ? "bg-green-50 border-green-400 text-green-700"
                  : "bg-red-50 border-red-400 text-red-700"
              }`}
            >
              {statusMsg}
              {success ? (
                <CheckIcon className="inline-block ml-1" />
              ) : (
                <Cross1Icon className="inline-block ml-1" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
