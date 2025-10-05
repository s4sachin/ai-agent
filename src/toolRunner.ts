// Google Generative AI function call interface
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
    case "get_weather":
      return getWeather(inputArgs);
    default:
      throw new Error(`Unknown tool: ${functionCall.name}`);
  }
};
