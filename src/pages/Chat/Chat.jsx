import React, { useEffect, useState, useRef } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import axios from "axios";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

export default function Chat() {
  const { user } = useAuthContext();
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messageListRef = useRef(null);

  // Carregar lista de chats
  useEffect(() => {
    if (!user?.uid) return;

    const leadsRef = collection(db, "leads");
    const qLeads = query(
      leadsRef,
      where("userId", "==", user.uid),
      orderBy("lastMessageAt", "desc"),
      orderBy("createdAt", "desc")
    );

    const unsubLeads = onSnapshot(qLeads, (snap) => {
      const data = snap.docs.map((docSnap) => {
        const lead = { id: docSnap.id, ...docSnap.data() };
        return {
          id: lead.id,
          name: lead.nome || lead.whatsappNumber,
          lastMessage: lead.lastMessageText || "",
          lastMessageAt: lead.lastMessageAt?.toDate() || new Date(),
        };
      });
      setChatList(data);
    });

    return () => unsubLeads();
  }, [user]);

  // Carregar mensagens do chat selecionado
  useEffect(() => {
    if (!selectedChat) return;

    const leadId = selectedChat.id;
    const ref = collection(db, "messageHistory");
    const qRef = query(
      ref,
      where("leadId", "==", leadId),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(qRef, (snap) => {
      const msgList = snap.docs.map((d) => ({
        id: d.id,
        text: d.data().content,
        sender: d.data().role === "human" ? "user" : "lead",
        timestamp: d.data().timestamp?.toDate() || new Date(),
      }));
      setMessages(msgList);

      // Auto-scroll ao receber novas mensagens
      setTimeout(() => {
        messageListRef.current?.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    });

    return () => unsub();
  }, [selectedChat]);

  // Enviar mensagem
  const handleSend = async () => {
    if (!newMsg.trim() || !selectedChat) return;

    try {
      await axios.post("/api/manual-chat/send", {
        userId: user.uid,
        leadId: selectedChat.id,
        content: newMsg,
      });
      setNewMsg("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Lista de Chats */}
      <aside className="w-80 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-green-600 text-white">
          <h3 className="text-lg font-semibold">Seus Leads</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b border-gray-200 cursor-pointer transition-all ${
                selectedChat?.id === chat.id
                  ? "bg-green-100 border-l-4 border-green-500"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="font-semibold">{chat.name}</div>
              <div className="text-sm text-gray-600 truncate">
                {chat.lastMessage}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Área do Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header do Chat */}
        <header className="bg-white p-4 border-b border-gray-300 shadow-md flex items-center">
          {selectedChat ? (
            <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
          ) : (
            <p className="text-gray-600">Selecione um lead para conversar</p>
          )}
        </header>

        {/* Mensagens */}
        <section
          ref={messageListRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex items-center ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-sm p-3 text-sm rounded-lg shadow-md ${
                  msg.sender === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </section>

        {/* Input de Mensagem */}
        {selectedChat && (
          <footer className="p-4 bg-white border-t border-gray-300 flex items-center">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-400 outline-none"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition flex items-center justify-center w-10 h-10"
            >
              <PaperPlaneIcon className="w-5 h-5" />
            </button>
          </footer>
        )}
      </main>
    </div>
  );
}
