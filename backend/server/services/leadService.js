// src/server/services/leadService.js
import { dbAdmin } from "../firebaseAdmin.js";
import { v4 as uuidv4 } from "uuid";

export async function getLeadByWhatsAppNumber(whatsappNumber) {
  const normalized = whatsappNumber.replace("whatsapp:", "").replace("+", "");
  const leadsRef = dbAdmin.collection("leads");
  const snap = await leadsRef.where("whatsappNumber", "==", normalized).get();
  if (!snap.empty) {
    const leadDoc = snap.docs[0];
    return { id: leadDoc.id, ...leadDoc.data() };
  }
  return null;
}

export async function saveLead(leadData) {
  const leadId = uuidv4();
  const leadRef = dbAdmin.collection("leads").doc(leadId);

  const normalized = leadData.whatsappNumber
    .replace("whatsapp:", "")
    .replace("+", "");

  const lead = {
    id: leadId,
    userId: leadData.userId,
    whatsappNumber: normalized,
    nome: leadData.nome || "",
    email: leadData.email || "",
    createdAt: new Date(),
    status: "novo",
  };

  await leadRef.set(lead);
  return lead;
}
