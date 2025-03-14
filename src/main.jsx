import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registrado com sucesso:", registration.scope);
    })
    .catch((error) => {
      console.error("Falha ao registrar o Service Worker:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
