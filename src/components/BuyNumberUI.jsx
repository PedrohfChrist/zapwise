// src/components/BuyNumberUI.jsx

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";

export default function BuyNumberUI({ userId, onSuccess }) {
  const [country, setCountry] = useState("BR");
  const [areaCode, setAreaCode] = useState("11");
  const [type, setType] = useState("local");
  const [limit, setLimit] = useState(5);

  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setStatusMsg("");
    try {
      const resp = await axios.get("/api/twilio/available", {
        params: {
          country,
          areaCode,
          type,
          limit,
        },
      });
      if (resp.data.success) {
        setAvailableNumbers(resp.data.numbers || []);
      } else {
        setStatusMsg("Não encontrou números.");
      }
    } catch (err) {
      console.error("Erro ao buscar números:", err);
      setStatusMsg("Erro ao buscar números. Veja console.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (phoneNumber) => {
    setLoading(true);
    setStatusMsg("");
    try {
      const resp = await axios.post(
        "https://zapwise.com.br/api/twilio/available",
        {
          userId,
          phoneNumber,
        }
      );
      if (resp.data.success) {
        setStatusMsg("Número comprado e associado: " + phoneNumber);
        // Chama callback p/ avisar ao componente-pai que deu certo
        if (onSuccess) {
          onSuccess(resp.data.phoneNumberSid);
        }
      } else {
        setStatusMsg("Falhou ao comprar número");
      }
    } catch (err) {
      console.error("Erro ao comprar número:", err);
      setStatusMsg("Erro ao comprar número. Veja console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-semibold text-lg mb-2">Buscar Número para Comprar</h3>

      <div className="flex items-center space-x-2 mb-2">
        <label className="block">
          <span className="text-sm font-medium">País</span>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value.toUpperCase())}
            placeholder="BR, US etc."
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">DDD (AreaCode)</span>
          <Input
            value={areaCode}
            onChange={(e) => setAreaCode(e.target.value)}
            placeholder="11 ou vazio"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Tipo</span>
          <select
            className="border p-1 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="local">Local</option>
            <option value="mobile">Mobile</option>
            <option value="tollFree">Toll Free</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Limite</span>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </label>
      </div>

      <Button onClick={handleSearch} disabled={loading}>
        {loading ? "Buscando..." : "Buscar Números"}
      </Button>

      {statusMsg && <p className="mt-2 text-sm text-gray-700">{statusMsg}</p>}

      {availableNumbers.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="font-medium text-sm">Selecione um número:</p>
          {availableNumbers.map((num, idx) => (
            <div
              key={idx}
              className="border p-2 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold">
                  {num.friendlyName || num.phoneNumber}
                </p>
                <p className="text-xs text-gray-600">{num.phoneNumber}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => handleBuy(num.phoneNumber)}
              >
                {loading ? "..." : "Comprar"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
