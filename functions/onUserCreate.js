// onUserCreate.js
const { onDocumentCreated } = require("firebase-functions/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const sendEventToFacebook = require("./actions/sendEventToFacebook");
const {
  ensureContact,
  updateContactTagsOnMailchimp,
} = require("./actions/sendEventToMailchimp");
const { getUniqueId } = require("./utils/getUniqueId");

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.onUserCreate = onDocumentCreated(
  { document: "users/{userId}" },
  async (event) => {
    const snap = event.data; // Firestore doc snapshot
    const userData = snap.data();
    if (!userData) {
      logger.warn("Usuário sem dados, ignorando...");
      return;
    }

    userData.event_name = "Lead";
    userData.event_id = getUniqueId();
    userData.action_source = "website";
    userData.event_source_url = `https://${userData.origin}`;

    if (
      userData.origin.includes("localhost") ||
      userData.origin.includes("127.0.0.1")
    ) {
      return {
        success: true,
        message: "Skipped function, origin is localhost",
      };
    }

    const [mailchimpResult, fbResult] = await Promise.allSettled([
      ensureContact(userData),
      sendEventToFacebook(userData),
    ]);

    if (fbResult.status === "rejected") {
      logger.error("Erro ao enviar evento para o Facebook", fbResult.reason);
    }

    let subscriberHash;
    if (mailchimpResult.status === "fulfilled") {
      subscriberHash = mailchimpResult.value;
    } else {
      logger.error(
        "Erro ao criar contato no Mailchimp",
        mailchimpResult.reason
      );
      return { success: false, message: "Error creating contact" };
    }

    try {
      // Remove campos sensíveis
      await snap.ref.update({
        fbc: admin.firestore.FieldValue.delete(),
        fbp: admin.firestore.FieldValue.delete(),
        user_agent: admin.firestore.FieldValue.delete(),
      });
    } catch (error) {
      logger.error("Erro ao deletar campos do usuário", error);
    }

    await updateContactTagsOnMailchimp(subscriberHash, ["lead"]);

    return {
      success: true,
      message: "Successfully created contact " + userData.email,
    };
  }
);
