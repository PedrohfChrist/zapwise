"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet"; // ajuste o caminho conforme sua estrutura
import { BellIcon } from "@radix-ui/react-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);

  // Escuta em tempo real as notificações do usuário no Firestore
  useEffect(() => {
    if (!userId) return;

    const notifRef = collection(db, "notifications");
    const q = query(
      notifRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notifs);
      },
      (error) => {
        console.error("Erro ao carregar notificações:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // Calcula a quantidade de notificações não lidas
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Função para marcar todas as notificações como lidas
  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter((n) => !n.read);
    if (unreadNotifs.length === 0) return;

    try {
      await Promise.all(
        unreadNotifs.map((notif) =>
          updateDoc(doc(db, "notifications", notif.id), { read: true })
        )
      );
    } catch (error) {
      console.error("Erro ao marcar notificações como lidas:", error);
    }
  };

  // Quando o Sheet é aberto, marca todas as notificações como lidas
  const handleSheetOpenChange = (open) => {
    if (open) {
      markAllAsRead();
    }
  };

  // Função para formatar a data (suporta Firebase Timestamp e objetos Date)
  const formatDate = (createdAt) => {
    if (!createdAt) return "";
    if (typeof createdAt.toDate === "function") {
      return createdAt.toDate().toLocaleString();
    } else if (createdAt.seconds) {
      return new Date(createdAt.seconds * 1000).toLocaleString();
    }
    return "";
  };

  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-200">
          <BellIcon className="h-6 w-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 text-xs font-bold text-white bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notificações</SheetTitle>
            <SheetClose asChild />
          </div>
          <SheetDescription>Visualize suas notificações aqui.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma notificação</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b border-gray-200 pb-2">
                <p className="text-sm text-gray-700">{n.message}</p>
                {n.createdAt && (
                  <p className="text-xs text-gray-400">
                    {formatDate(n.createdAt)}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
