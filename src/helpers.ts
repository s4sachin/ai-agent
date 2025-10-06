import { z } from "zod";

/**
 * Convert a Zod schema to Google Generative AI function declaration format
 */
export function zodToGemini(
  name: string,
  description: string,
  schema: z.ZodSchema
) {
  return {
    name,
    description,
    parameters: zodSchemaToJsonSchema(schema)
  };
}

/**
 * Convert Zod schema to JSON Schema format
 */
function zodSchemaToJsonSchema(schema: z.ZodSchema): any {
  // Basic implementation - you might want to use a library like zod-to-json-schema
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const properties: any = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(shape)) {
      if (value instanceof z.ZodString) {
        properties[key] = { type: "string" };
        if (!value.isOptional()) required.push(key);
      } else if (value instanceof z.ZodNumber) {
        properties[key] = { type: "number" };
        if (!value.isOptional()) required.push(key);
      } else if (value instanceof z.ZodBoolean) {
        properties[key] = { type: "boolean" };
        if (!value.isOptional()) required.push(key);
      }
      // Add more type handling as needed
    }

    return {
      type: "object",
      properties,
      required
    };
  }

  return { type: "object" };
}

/**
 * Format tools for Google Gen AI SDK (@google/genai)
 */
export function formatToolsForGemini(tools: any[]) {
  const functionDeclarations = tools.map(tool => {
    // If the tool already has the correct format, use it as is
    if (tool.name && tool.description && tool.parameters && typeof tool.parameters === 'object') {
      // Check if parameters is a Zod schema
      if (tool.parameters._def) {
        return {
          name: tool.name,
          description: tool.description,
          parametersJsonSchema: zodSchemaToJsonSchema(tool.parameters)
        };
      }
      // Already in correct format (convert parameters to parametersJsonSchema)
      return {
        name: tool.name,
        description: tool.description,
        parametersJsonSchema: tool.parameters
      };
    }

    // Handle other formats or throw error
    throw new Error(`Invalid tool format: ${JSON.stringify(tool)}`);
  });

  return [
    {
      functionDeclarations
    }
  ];
}