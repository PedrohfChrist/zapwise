const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const resetUserWordsGenerated = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const subscriptionsRef = admin.firestore().collection("subscriptions");
    const subscriptionsSnapshot = await subscriptionsRef.get();

    const batch = admin.firestore().batch();
    const now = new Date();

    subscriptionsSnapshot.forEach((doc) => {
      const data = doc.data();
      const renewalDate = data.renewalDate.toDate();

      // Verifica se hoje é o dia de renovação
      if (
        renewalDate.getDate() === now.getDate() &&
        renewalDate.getMonth() === now.getMonth()
      ) {
        const userRef = admin.firestore().collection("users").doc(doc.id);
        batch.update(userRef, { wordsGenerated: 0 });
      }
    });

    await batch.commit();
    console.log(
      "Contador de palavras reiniciado para usuários cujo plano renovou."
    );
  });

module.exports = { resetUserWordsGenerated };
