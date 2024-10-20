const { onHotmartWebhook } = require("./onHotmartWebhook");
const { onBeforeCreate } = require("./onBeforeCreate");
const { changePassword } = require("./changePassword");
const { onUserCreate } = require("./onUserCreate");
// const { initiateCheckout } = require("./initiateCheckout");
const { facebookCapi } = require("./facebookCapi");
const { resetUserWordsGenerated } = require("./resetUserWordsGenerated");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

module.exports = {
  onHotmartWebhook,
  onBeforeCreate,
  changePassword,
  onUserCreate,
  // initiateCheckout,
  facebookCapi,
  resetUserWordsGenerated,
};
