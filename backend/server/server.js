import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";

// Define __dirname no módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env que está um nível acima (na pasta backend)
config({ path: path.join(__dirname, "../.env") });
console.log("Process CWD:", process.cwd());
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";

import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/userRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import manualChatRoutes from "./routes/manualChatRoutes.js";
import automacoesRoutes from "./routes/automacoesRoutes.js";
import knowledgeBaseRoutes from "./routes/knowledgeBaseRoutes.js";
import fcmRoutes from "./routes/fcmRoutes.js";
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
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/manual-chat", manualChatRoutes);
app.use("/api/automacoes", automacoesRoutes);
app.use("/api/knowledge-base", knowledgeBaseRoutes);
app.use("/api/fcm", fcmRoutes);
app.use("/api/facebook", facebookConnect);
app.use("/api/facebook", facebookWebhook);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});
