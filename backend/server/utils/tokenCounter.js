// src/server/utils/tokenCounter.js
import { encoding_for_model } from "tiktoken";

export function countMessageTokens(messages, model = "gpt-4") {
  const encoder = encoding_for_model(model);
  let totalTokens = 0;
  for (const msg of messages) {
    const roleTokens = encoder.encode(msg.role || "");
    const contentTokens = encoder.encode(msg.content || "");
    totalTokens += roleTokens.length + contentTokens.length;
  }
  encoder.free();
  return totalTokens;
}

export function countTextTokens(text, model = "gpt-4") {
  const encoder = encoding_for_model(model);
  const tokens = encoder.encode(text || "");
  const count = tokens.length;
  encoder.free();
  return count;
}
