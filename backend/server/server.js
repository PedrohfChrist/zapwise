import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/userRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";
import twilioWebhook from "./routes/twilioWebhook.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import manualChatRoutes from "./routes/manualChatRoutes.js";
import automacoesRoutes from "./routes/automacoesRoutes.js";
import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes.js";
import fcmRoutes from "./routes/fcmRoutes.js";
import whatsappSenderRoutes from "./routes/whatsappSenderRoutes.js";
import facebookConnect from "./routes/facebookConnect.js";
import facebookWebhook from "./routes/facebookWebhook.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/twilio", twilioWebhook);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/manual-chat", manualChatRoutes);
app.use("/api/automacoes", automacoesRoutes);
app.use("/api/knowledge-base", knowledgeBaseRoutes);
app.use("/api/fcm", fcmRoutes);
app.use("/api/facebook", facebookConnect);
app.use("/api/facebook", facebookWebhook);

// AQUI: use a rota do whatsappSender
app.use("/api/whatsapp-sender", whatsappSenderRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});
