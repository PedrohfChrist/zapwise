// src/server/services/embeddingService.js
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
// Se quiser Admin no futuro:
import { dbAdmin } from "../firebaseAdmin.js"; // se quiser usar Firestore admin

let globalVectorStore = null;

/**
 * Retorna (ou inicializa) um MemoryVectorStore com Embeddings da OpenAI
 */
function getVectorStore() {
  if (!globalVectorStore) {
    globalVectorStore = new MemoryVectorStore(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      })
    );
  }
  return globalVectorStore;
}

/** Calcula a embedding para um texto. */
export async function getEmbedding(text) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  return embeddings.embedQuery(text);
}

/** Busca top-k documentos relevantes na vector store. */
export async function queryRelevantDocuments(queryText, k = 3) {
  const store = getVectorStore();
  if (!store) return [];
  const results = await store.similaritySearch(queryText, k);
  return results.map((r) => ({
    text: r.pageContent,
    metadata: r.metadata,
  }));
}

/* Exemplo se quiser salvar no Firestore Admin:
async function saveChunk(userId, chunkText, chunkIndex) {
  const colRef = dbAdmin.collection("embedding-chunks");
  await colRef.add({
    userId,
    text: chunkText,
    chunkIndex,
  });
}
*/
