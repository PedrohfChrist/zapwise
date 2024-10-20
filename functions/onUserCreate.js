const functions = require("firebase-functions");
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

exports.onUserCreate = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snap, context) => {
    const userData = snap.data();
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

    const promises = [ensureContact(userData), sendEventToFacebook(userData)];

    const results = await Promise.allSettled(promises);

    if (results[1].status === "rejected") {
      console.error("Erro ao enviar evento para o Facebook", results[1].reason);
    }

    const subscriberHash = results[0].value;

    try {
      await snap.ref.update({
        fbc: admin.firestore.FieldValue.delete(),
        fbp: admin.firestore.FieldValue.delete(),
        user_agent: admin.firestore.FieldValue.delete(),
      });
    } catch (error) {
      console.error("Erro ao deletar campos do usuário", error);
    }

    if (results[0].status === "rejected") {
      console.error("Erro ao criar contato no Mailchimp", results[0].reason);
      return { success: false, message: "Error creating contact" };
    }

    await updateContactTagsOnMailchimp(subscriberHash, ["lead"]);

    return {
      success: true,
      message: "Successfully created contact " + userData.email,
    };
  });
