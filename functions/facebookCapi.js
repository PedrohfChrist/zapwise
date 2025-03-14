const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const sendEventToFacebook = require("./actions/sendEventToFacebook");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Rota POST
app.post("/", async (req, res) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log("Facebook CAPI Request Body:", req.body);

    const response = await sendEventToFacebook(req.body, ipAddress);
    return res.status(200).send({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("Error processing Facebook CAPI request:", error);
    return res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

exports.facebookCapi = functions.https.onRequest(app);
