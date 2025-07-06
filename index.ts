import "dotenv/config";
import { runLLM } from "./src/llm";
import { addMessages, getMessages } from "./src/memory";

const userMessage = process.argv[2];

await addMessages([{ role: "user", content: userMessage }]);
const messages = await getMessages();

if (!userMessage) {
  console.error("Please provide a message");
  process.exit(1);
}

const response = await runLLM({
  messages,
});
console.log(response);

await addMessages([{ role: "assistant", content: response }]);
