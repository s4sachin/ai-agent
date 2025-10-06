import { z } from "zod";
import type { ToolFn } from "../../types";
import fs from "fs/promises";
import path from "path";

export const generateImageToolDefinition = {
  name: "generate_image",
  parameters: z.object({
    prompt: z
      .string()
      .describe(
        "The prompt used to generate image. Be sure to consider the users original request when crafting the prompt. If you are unsure, ask the user for more details."
      ),
  }),
  description:
    "Generate an image based on a text prompt using Hugging Face Stable Diffusion model",
};

type Args = z.infer<typeof generateImageToolDefinition.parameters>;

export const generateImage: ToolFn<Args, string> = async ({ toolArgs }) => {
  // Hugging Face FLUX.1-schnell implementation (FREE & FAST)
  try {
    // Validate API key
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY environment variable is not set');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: toolArgs.prompt,
        parameters: {
          num_inference_steps: 4,  // FLUX.1-schnell is fast, only needs 4 steps
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    // Fix: Use arrayBuffer() instead of deprecated buffer() method
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Option 1: Return as base64 data URL (works immediately)
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Optional: Also save to disk for backup
    const outputDir = path.join(process.cwd(), "generated_images");
    await fs.mkdir(outputDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `image_${timestamp}.png`;
    const filepath = path.join(outputDir, filename);

    await fs.writeFile(filepath, imageBuffer);

    console.log(`Generated image saved to: ${filepath}`);
    
    return dataUrl; // Return data URL instead of file path

  } catch (error) {
    console.error('Hugging Face image generation failed:', error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : error}`);
  }
};
