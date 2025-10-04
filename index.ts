import "dotenv/config";
import { z } from "zod";
import { runLLM } from "./src/llm";
import { getMessages, addMessages } from "./src/memory";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message");
  process.exit(1);
}

// save the last/current user message before calling LLM on it
await addMessages([{ role: "user", parts: [{ text: userMessage }] }]);

// retrieve all messages (including the one just added) and pass them to the LLM
const savedMessages = await getMessages();

const response = await runLLM({
  messages: savedMessages,
});

// save the LLM reposnse
await addMessages([{ role: "model", parts: [{ text: response }] }]);

console.log("AI Response:", response);
