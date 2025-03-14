const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Middleware global para CORS
const corsMiddleware = (handler) => (req, res) => {
  return cors(req, res, () => handler(req, res));
};

exports.createUser = onRequest(
  corsMiddleware(async (req, res) => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido." });
      }

      const { email, displayName, uid } = req.body;
      if (!email || !uid) {
        return res.status(400).json({ error: "Faltam dados obrigatórios." });
      }

      const sanitizedEmail = email.trim().toLowerCase();
      const userDoc = {
        id: uid,
        name: displayName || "Usuário Sem Nome",
        email: sanitizedEmail,
        online: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection("users").doc(uid).set(userDoc, { merge: true });
      return res
        .status(200)
        .json({ success: true, message: "Usuário criado/sincronizado!" });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  })
);
