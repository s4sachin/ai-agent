import "dotenv/config";
import { runAgent } from "./src/agent";
import { tools } from "./src/tools";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message");
  process.exit(1);
}

const response = await runAgent({
  userMessage,
  tools
});

console.log("AI Response:", response);
