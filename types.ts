// Google GenAI types
export type AIMessage = {
  role: 'user' | 'model' | 'system';
  parts: Array<{ text: string }>;
} | {
  role: 'function';
  parts: Array<{ 
    functionCall?: {
      name: string;
      args: Record<string, any>;
    };
    functionResponse?: {
      name: string;
      response: Record<string, any>;
    };
  }>;
}

export interface ToolFn<A = any, T = any> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>
}
