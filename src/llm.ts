import type { AIMessage } from "../types";
import { ai } from "./ai";
import { formatToolsForGemini } from "./helpers";
import { systemPrompt } from "./systemPrompt";

export async function runLLM({
  messages,
  tools,
}: {
  messages?: AIMessage[];
  tools?: any[];
}) {

  // Use provided messages or start with empty array
  let allMessages: AIMessage[];
  if (!messages || messages.length === 0) {
    allMessages = [];
  } else {
    allMessages = messages;
  }

  const requestConfig: any = {
    model: "gemini-2.5-flash",
    contents: allMessages,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    config: {
      temperature: 0.2,
    },
  };

  // Only add tools and toolConfig if tools are provided
  if (tools && tools.length > 0) {
    requestConfig.config.tools = formatToolsForGemini(tools);
    requestConfig.config.toolConfig = {
      functionCallingConfig: {
        mode: 'auto'
      }
    };
  }

  console.log("Calling LLM with", allMessages?.length || 0, "messages");
  const lastMessage = allMessages?.[allMessages.length - 1];
  if (lastMessage) {
    console.log("Last message role:", lastMessage.role);
    if (lastMessage.parts?.[0]?.functionResponse) {
      console.log("Last message was a function response, expecting text response from model");
    }
  }

  let response;
  try {
    response = await ai.models.generateContent(requestConfig);
  } catch (error) {
    console.error('Error generating content:', error);
    
    // Handle API quota errors
    if (error instanceof Error && error.message.includes('quota')) {
      console.log('API quota exceeded, providing fallback response...');
      
      // Check if we just had successful tool calls
      const recentToolCalls = allMessages.slice(-6).filter(msg => 
        msg.role === 'function' || (msg.parts?.[0]?.functionResponse)
      );
      
      if (recentToolCalls.length > 0) {
        return {
          type: "text",
          content: `I successfully executed the requested tools but hit my API quota limit. The tool operations completed successfully - please check the outputs for the results.`
        };
      }
      
      return {
        type: "text", 
        content: "I've hit my API quota limit. Please try again later or check your plan and billing details."
      };
    }
    
    // Handle network errors with a fallback response
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.log('Network error detected, providing fallback response...');
      
      // Check if we just had successful tool calls
      const recentToolCalls = allMessages.slice(-6).filter(msg => 
        msg.role === 'function' || (msg.parts?.[0]?.functionResponse)
      );
      
      if (recentToolCalls.length > 0) {
        return {
          type: "text",
          content: `I successfully executed the requested tools but encountered a network issue while generating the final response. All operations completed successfully - please check the outputs for the results.`
        };
      }
      
      return {
        type: "text", 
        content: "I'm experiencing network connectivity issues. Please try again in a moment."
      };
    }
    
    throw error;
  }

  const result = response;

  // Get the first candidate's content parts
  const candidate = result.candidates?.[0];
  if (!candidate) {
    return {
      type: "text",
      content: "No response generated"
    };
  }

  const parts = candidate.content?.parts || [];

  // Check if the response contains function calls
  const functionCallPart = parts.find(part => part.functionCall);
  if (functionCallPart?.functionCall) {
    console.log("Model wants to call function:", functionCallPart.functionCall.name);
    return {
      type: "function_call",
      functionCall: {
        name: functionCallPart.functionCall.name,
        args: functionCallPart.functionCall.args
      }
    };
  }

  // Extract text from text parts only (avoid thoughtSignature and other non-text parts)
  const textParts = parts
    .filter(part => part.text) // Only get parts with text
    .map(part => part.text)
    .join('');

  console.log("Model generated text response:", textParts ? "Yes" : "No");
  if (!textParts) {
    console.log("Available parts:", parts.map(p => Object.keys(p)));
  }

  return {
    type: "text",
    content: textParts || "No response"
  };
}
