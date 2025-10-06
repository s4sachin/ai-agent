import type { Content } from "@google/genai";

// Google Generative AI types
export type AIMessage = Content;

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>
}
