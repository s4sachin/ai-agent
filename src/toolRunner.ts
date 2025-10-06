import { generateImage, generateImageToolDefinition } from './tools/generateImage';
import { dadJoke, dadJokeToolDefinition } from './tools/dadJoke';
import { redditPost, redditToolDefinition } from './tools/reddit';


interface GeminiFunctionCall {
  name: string;
  args: Record<string, any>;
}

const getWeather = (input: any) => {
  const location = input.toolArgs.location || "unknown location";
  return {
    temperature: "90°F",
    condition: "hot and sunny",
    location: location,
    humidity: "65%",
    windSpeed: "5 mph"
  };
};

export const runTool = async (
  functionCall: GeminiFunctionCall,
  userMessage: string
) => {
  const inputArgs = {
    userMessage,
    toolArgs: functionCall.args || {},
  };

  switch (functionCall.name) {
    case generateImageToolDefinition.name:
      return await generateImage({
        userMessage,
        toolArgs: {
          prompt: functionCall.args?.prompt || "",
        },
      });
      
    case dadJokeToolDefinition.name:
      return await dadJoke(inputArgs);

    case redditToolDefinition.name:
      return await redditPost({
        userMessage,
        toolArgs: {
          subreddit: functionCall.args?.subreddit || "",
        },
      });
      
    default:
      return { error: `Unknown tool: ${functionCall.name}` };
  }
};
