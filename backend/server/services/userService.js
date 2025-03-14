// src/server/services/userService.js
import { dbAdmin } from "../firebaseAdmin.js";

export async function getUserIdByPhoneNumberId(phoneNumberId) {
  const colRef = dbAdmin.collection("userWhatsApp");
  const snap = await colRef.where("phoneNumberId", "==", phoneNumberId).get();
  if (!snap.empty) {
    return snap.docs[0].data().userId;
  }
  return null;
}

export async function getUserById(userId) {
  const userRef = dbAdmin.collection("users").doc(userId);
  const snap = await userRef.get();
  if (snap.exists) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}
