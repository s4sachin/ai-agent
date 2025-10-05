import { runLLM } from "./llm";
import { addMessages, getMessages } from "./memory";
import { runTool } from "./toolRunner";
import { showLoader } from "./ui";

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await addMessages([{ role: "user", parts: [{ text: userMessage }] }]);

  const loader = showLoader("Articulating ....");

  while (true) {

    const history = await getMessages();
    const response = await runLLM({ messages: history, tools });

    // Handle different response types
    if (response.type === "text") {
      await addMessages([
        { role: "model", parts: [{ text: response.content || "" }] },
      ]);
      loader.stop();
      return response.content;
    } 

    // If AI wants to call a function, execute it and continue the loop
    else if (response.type === "function_call" && response.functionCall) {
      const toolCall = response.functionCall;
      
      // 1. Save the function call first
      await addMessages([
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: toolCall.name,
                args: toolCall.args,
              },
            },
          ],
        },
      ]);

      // 2. Execute the tool
      loader.update(`Executing tool: ${toolCall.name}`);
      
      try {
        const toolResponse = await runTool(toolCall, userMessage);
        
        // 3. Save the function response
        await addMessages([
          {
            role: "function",
            parts: [
              { functionResponse: { name: toolCall.name, response: toolResponse } },
            ],
          },
        ]);

        // 4. Update loader and continue the loop
        loader.update("Processing results...");
        // The while loop will continue and call runLLM again with updated history
        
      } catch (error) {
        // Handle tool execution errors
        await addMessages([
          {
            role: "function",
            parts: [
              { 
                functionResponse: { 
                  name: toolCall.name, 
                  response: { error: `Tool execution failed: ${error}` } 
                } 
              },
            ],
          },
        ]);
        
        // Continue the loop even after an error to let AI respond to the error
        loader.update("Handling error...");
      }
    } 
    
    // If response type is neither text nor function_call
    else {
      loader.stop();
      return "No valid response generated.";
    }
  }
};
