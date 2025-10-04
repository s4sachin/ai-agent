import type { AIMessage } from "../types";
import { ai } from "./ai";

export async function runLLM({ messages }: { messages?: AIMessage[] }) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: messages || [],
    config: {
      temperature: 0.2,
    },
  });
  const text =
    response.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  return text;
}
