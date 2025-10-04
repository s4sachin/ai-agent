import type OpenAI from "openai";

const getWeather = (input: any) => `The weather is hot, 90deg`;

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const inputArgs = {
    userMessage,
    toolArgs: toolCall.function.arguments || "{ }",
  };

  switch (toolCall.function.name) {
    case "get_weather":
      return getWeather(inputArgs);
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`);
  }
};
