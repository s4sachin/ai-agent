import "dotenv/config";
import { z } from "zod";
import { runLLM } from "./src/llm";
import { getMessages, addMessages } from "./src/memory";
import { runAgent } from "./src/agent";
import { logMessage } from "./src/ui";

const userMessage = process.argv[2];

if (!userMessage) {
  console.error("Please provide a message");
  process.exit(1);
}

const weatherTool = {
  name: "get_weather",
  description: "Get the current weather for a given location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g. San Francisco, CA"
      }
    },
    required: ["location"]
  }
}

const response = await runAgent({ userMessage, tools: [weatherTool] });

console.log("AI Response:", response);
