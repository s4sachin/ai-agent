import { generateImageToolDefinition } from "./generateImage";
import { redditToolDefinition } from "./reddit";
import { dadJokeToolDefinition } from "./dadJoke";

export const tools = [redditToolDefinition , dadJokeToolDefinition, generateImageToolDefinition];