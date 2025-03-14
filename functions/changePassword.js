const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

if (!admin.apps.length) {
  admin.initializeApp();
}

const FIREBASE_API_KEY = process.env.MY_FIREBASE_API_KEY;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.post("/", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res
      .status(400)
      .json({ success: false, message: "Authorization header missing" });
  }

  const idToken = tokenHeader.split(" ")[1];
  if (!idToken || !oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const user = await admin.auth().getUser(uid);
    const email = user.email;

    // Autentica com a senha antiga
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: oldPassword,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (data && data.localId) {
      // Atualiza senha
      await admin.auth().updateUser(uid, { password: newPassword });
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect." });
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

exports.changePassword = functions.https.onRequest(app);
