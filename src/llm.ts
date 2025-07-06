import type { AIMessage } from "../types";
import { openai } from "./ai";

export const runLLM = async ({ messages }: { messages: AIMessage[] }) => {
  const response = await openai.chat.completions.create({
    model: "gemini-2.5-flash",
    temperature: 0.1,
    messages,
  })
  return response.choices[0].message.content
}
