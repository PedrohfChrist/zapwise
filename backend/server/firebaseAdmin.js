// backend/server/firebaseAdmin.js
console.log("Caminho das credenciais:", serviceAccountPath);

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Precisamos resolver o caminho para serviceAccountKey.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Lê o arquivo e faz parse do JSON
const serviceAccountStr = fs.readFileSync(serviceAccountPath, "utf8");
const serviceAccount = JSON.parse(serviceAccountStr);

// Inicializa o admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const dbAdmin = admin.firestore();
export { admin, dbAdmin };
