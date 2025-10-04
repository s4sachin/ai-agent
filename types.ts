import type { Content } from "@google/generative-ai";

// Google Generative AI types
export type AIMessage = Content;

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>
}
