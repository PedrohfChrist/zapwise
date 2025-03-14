// initiateCheckout.js
const { onRequest } = require("firebase-functions/http");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const sendEventToFacebook = require("./actions/sendEventToFacebook");
const {
  ensureContact,
  updateContactTagsOnMailchimp,
} = require("./actions/sendEventToMailchimp");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const [mailchimpResult, fbResult] = await Promise.allSettled([
      ensureContact(req.body),
      sendEventToFacebook(req.body, ipAddress),
    ]);

    let subscriberHash;
    if (mailchimpResult.status === "fulfilled") {
      subscriberHash = mailchimpResult.value;
    } else {
      logger.error(
        "Erro ao criar contato no Mailchimp",
        mailchimpResult.reason
      );
    }

    if (fbResult.status === "rejected") {
      logger.error("Erro ao enviar evento ao Facebook", fbResult.reason);
    }

    // Atualiza tags
    if (subscriberHash) {
      try {
        await updateContactTagsOnMailchimp(subscriberHash, [
          { name: "lead", status: "active" },
          { name: "initiate checkout", status: "active" },
        ]);
      } catch (error) {
        logger.error("Erro ao atualizar tags no Mailchimp", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Successfully created contact and sent event to Facebook",
    });
  } catch (error) {
    logger.error("Error in initiateCheckout:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in initiateCheckout",
    });
  }
});

exports.initiateCheckout = onRequest(app);
