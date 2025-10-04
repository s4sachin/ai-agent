import { runLLM } from "./llm";
import { addMessages, getMessages } from "./memory";
import { showLoader } from "./ui";

export const runAgent = async ({ userMessage, tools }: { userMessage: string, tools: any[] }) => {
    await addMessages([{role: 'user', parts: [{text: userMessage}]}]);

    const loader = showLoader('Articulating ....');
    const history = await getMessages();

    const response = await runLLM({messages: history, tools});

    // Handle different response types
    if (response.type === "text") {
        await addMessages([{role: 'model', parts: [{text: response.content || ''}]}]);
        loader.stop();
        return response.content; 
    } else if (response.type === "function_call" && response.functionCall) {
        // Save function call in correct Google GenAI format
        await addMessages([{
            role: 'model', 
            parts: [{
                functionCall: {
                    name: response.functionCall.name,
                    args: response.functionCall.args
                }
            }]
        }]);
        loader.stop();
        return `Function call requested: ${response.functionCall.name} with args: ${JSON.stringify(response.functionCall.args)}`;
    }

    loader.stop();
    return getMessages();
};
