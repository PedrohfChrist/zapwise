"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { format, startOfDay, subDays } from "date-fns";
// date-fns para formatar datas

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusIcon, MagicWandIcon, ShuffleIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "@/hooks/useAuthContext";
import NotificationBell from "@/components/NotificationBell";

export default function Home() {
  const { user } = useAuthContext();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Acesso Negado</h2>
          <p className="text-gray-500">Faça login para acessar o painel.</p>
        </div>
      </div>
    );
  }

  const userId = user.uid;

  // Placeholder até implementar fluxos:
  const [fluxosCount] = useState("-");

  // Métricas principais (ativas, leads)
  const [activeAutomationsCount, setActiveAutomationsCount] = useState(0);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  // Dados dos gráficos
  // "atendimentos" => mensagens role="user"
  // "messages" => mensagens role="user" + "assistant"
  const [atendimentosData, setAtendimentosData] = useState([]);
  const [messagesData, setMessagesData] = useState([]);

  // ─────────────────────────────────────────────
  // 1) Buscar automações ativas e leads
  // ─────────────────────────────────────────────
  useEffect(() => {
    const unsubAutomacoes = onSnapshot(
      query(
        collection(db, "automacoes"),
        where("userId", "==", userId),
        where("ativa", "==", true)
      ),
      (snap) => setActiveAutomationsCount(snap.size)
    );

    const unsubLeads = onSnapshot(
      query(collection(db, "leads"), where("userId", "==", userId)),
      (snap) => setTotalLeadsCount(snap.size)
    );

    return () => {
      unsubAutomacoes();
      unsubLeads();
    };
  }, [userId]);

  // ─────────────────────────────────────────────
  // 2) Buscar do Firestore: messageHistory
  //    - role="user" => atendimentos
  //    - role in ("user","assistant") => total
  // ─────────────────────────────────────────────

  useEffect(() => {
    // role="user"
    const unsubAtendimentos = onSnapshot(
      query(
        collection(db, "messageHistory"),
        where("userId", "==", userId),
        where("role", "==", "user"),
        orderBy("timestamp", "desc")
      ),
      (snap) => {
        // each doc => {role, content, timestamp, userId,...}
        const msgs = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            ...d,
            timestamp: d.timestamp?.toDate ? d.timestamp.toDate() : d.timestamp,
          };
        });
        setAtendimentosData(convertDocsToDailyData(msgs));
      }
    );

    // role in ("user","assistant") => na prática, se a doc
    // pode ter outras roles, mas normalmente é user ou assistant
    const unsubMessages = onSnapshot(
      query(
        collection(db, "messageHistory"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      ),
      (snap) => {
        const msgs = snap.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            ...d,
            timestamp: d.timestamp?.toDate ? d.timestamp.toDate() : d.timestamp,
          };
        });
        setMessagesData(convertDocsToDailyData(msgs));
      }
    );

    return () => {
      unsubAtendimentos();
      unsubMessages();
    };
  }, [userId]);

  // ─────────────────────────────────────────────
  // 3) Converter docs em dados diários
  // ─────────────────────────────────────────────
  function convertDocsToDailyData(msgs) {
    // msgs => array {timestamp, ...}
    // vamos agrupar por dia e contar

    const dayCounts = {};
    msgs.forEach((m) => {
      if (!m.timestamp) return;
      const day = startOfDay(m.timestamp);
      const dayStr = format(day, "dd/MM");
      if (!dayCounts[dayStr]) {
        dayCounts[dayStr] = 0;
      }
      dayCounts[dayStr]++;
    });

    // últimos 7 dias
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const dayObj = subDays(new Date(), i);
      const dayStr = format(dayObj, "dd/MM");
      const value = dayCounts[dayStr] || 0;
      result.push({ name: dayStr, value });
    }
    return result;
  }

  return (
    <main className="p-6 w-full bg-gray-100 min-h-screen">
      {/* Botões de Ações */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/fluxos">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <PlusIcon /> Criar Fluxo <ShuffleIcon />
            </Button>
          </Link>
          <Link to="/automacoes">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <PlusIcon /> Criar Automação <MagicWandIcon />
            </Button>
          </Link>
        </div>
        <NotificationBell userId={user.uid} />
      </div>

      {/* Cards Estatísticas */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: "Fluxos", value: fluxosCount },
          {
            title: "Automações por I.A (Ativas)",
            value: activeAutomationsCount,
          },
          { title: "Total de Leads", value: totalLeadsCount },
        ].map((item, idx) => (
          <Card key={idx} className="shadow-lg bg-white rounded-lg p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-gray-500 text-sm font-medium">
                {item.title}
              </CardTitle>
              <h2 className="text-3xl font-bold text-gray-900">{item.value}</h2>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Gráfico de atendimentos (role="user") */}
        <Card className="shadow-lg bg-white rounded-lg p-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Atendimentos Realizados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={atendimentosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                {/* Forçar o eixo Y de 0 até dataMax+1, para não ficar “achatado” */}
                <YAxis domain={[0, "dataMax + 1"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de mensagens totais (role="user" + "assistant") */}
        <Card className="shadow-lg bg-white rounded-lg p-6">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Mensagens Trocadas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messagesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, "dataMax + 1"]} />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
