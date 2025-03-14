// utils/socket.js

export function initializeWebSocket(updateConversations) {
  const socket = new WebSocket("wss://seu-servidor-websocket.com"); // Insira sua URL de WebSocket

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateConversations(data);
  };

  socket.onopen = () => console.log("Conectado ao WebSocket");

  return socket;
}
