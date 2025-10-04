import type { AIMessage } from "../types";
import { ai } from "./ai";
import { formatToolsForGemini } from "./helpers";
import { FunctionCallingMode } from "@google/generative-ai";

export async function runLLM({
  messages,
  tools,
}: {
  messages?: AIMessage[];
  tools?: any[];
}) {
  const modelConfig: any = {
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.2,
    },
  };

  // Only add tools and toolConfig if tools are provided
  if (tools && tools.length > 0) {
    modelConfig.tools = formatToolsForGemini(tools);
    modelConfig.toolConfig = {
      functionCallingConfig: {
        mode: FunctionCallingMode.AUTO, 
        allowedFunctionNames: undefined
      }
    };
  }

  const model = ai.getGenerativeModel(modelConfig);

  const response = await model.generateContent({
    contents: messages || [],
  });

  const result = response.response;
  
  // Check if the response contains function calls
  const functionCall = result.candidates?.[0]?.content?.parts?.[0].functionCall;
  
  if (functionCall) {
    // Return the function call for processing by your agent
    return {
      type: "function_call",
      functionCall: {
        name: functionCall.name,
        args: functionCall.args
      }
    };
  }
  
  // Return regular text response
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  return {
    type: "text",
    content: text
  };
}
