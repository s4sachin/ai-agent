# AI Agent with Tool Calling

A powerful AI agent built with Google's Gemini 2.5 Flash and Hugging Face, featuring autonomous tool execution, image generation, and multi-turn conversations with persistent memory.

## ✨ Features

### 🤖 AI Capabilities
- **Agentic AI with Tool Calling**: Autonomous multi-step task execution
- **Continuous Loop Execution**: Handles complex workflows requiring multiple tool calls
- **Persistent Chat Memory**: Conversation history stored in local JSON database
- **System Instructions**: Contextual AI behavior with date awareness

### 🛠️ Available Tools

1. **🎨 Image Generation** (`generate_image`)
   - Free image generation using Hugging Face FLUX.1-schnell model
   - Saves images to `generated_images/` directory
   - 1024x1024 high-quality outputs
   - Only 4 inference steps (fast generation)

2. **😂 Dad Jokes** (`dad_joke`)
   - Fetch random dad jokes from icanhazdadjoke API
   - Perfect for lightening the mood

3. **📱 Reddit Posts** (`reddit_post`)
   - Fetch top posts from any subreddit
   - Get trending content and discussions

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (tested on v22.17.0)
- API Keys:
  - Google Gemini API key
  - Hugging Face API key (for image generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

   **Get API Keys:**
   - **Gemini API**: [Get it here](https://ai.google.dev/) (free tier available)
   - **Hugging Face**: [Get it here](https://huggingface.co/settings/tokens) (free tier available)

### Usage

Run the agent with a message:

```bash
npm start "your message here"
```

#### Examples

**Generate an image:**
```bash
npm start "generate an image of a cat wearing a hat"
```

**Get a dad joke:**
```bash
npm start "tell me a dad joke"
```

**Fetch Reddit posts:**
```bash
npm start "show me top posts from r/programming"
```

**Combined tasks:**
```bash
npm start "tell me a joke and then create an image of that joke"
```

## 📁 Project Structure

```
ai-agent/
├── src/
│   ├── tools/              # Tool implementations
│   │   ├── generateImage.ts    # Image generation with FLUX.1
│   │   ├── dadJoke.ts          # Dad joke fetcher
│   │   ├── reddit.ts           # Reddit post fetcher
│   │   └── index.ts            # Tool exports
│   ├── agent.ts            # Main agent loop
│   ├── ai.ts               # Google GenAI client
│   ├── llm.ts              # LLM integration
│   ├── toolRunner.ts       # Tool execution handler
│   ├── memory.ts           # Chat history management
│   ├── helpers.ts          # Utility functions
│   ├── systemPrompt.ts     # System instructions
│   └── ui.ts               # CLI interface
├── generated_images/       # Generated images (gitignored)
├── db.json                 # Chat history (gitignored)
├── index.ts                # Entry point
└── package.json
```

## 🔧 Technical Details

### SDK & Libraries

- **@google/genai** (v1.22.0): Latest Google Generative AI SDK
- **Hugging Face Inference API**: Free image generation
- **lowdb**: Lightweight JSON database for chat history
- **zod**: Schema validation for tool parameters
- **ora**: Elegant terminal spinners

### Architecture

**Agentic Loop:**
```
User Input → LLM → Function Call?
                     ↓ Yes
              Execute Tool → Save Response → LLM (continues)
                     ↓ No
              Return Text Response
```

**Tool Integration:**
- Tools defined with Zod schemas for type safety
- Automatic parameter validation
- Error handling with fallback responses
- Function response formatting for Gemini API

### Migration Notes

This project recently migrated from the deprecated `@google/generative-ai` SDK to the new `@google/genai` SDK:

- ✅ Future-proof (old SDK EOL: November 2025)
- ✅ Better performance and reliability
- ✅ Access to latest Gemini features
- ✅ Unified API for all Google AI services

## 🎯 Key Improvements

### Image Generation
- **Fixed**: HTTP 404 errors by switching to FLUX.1-schnell model
- **Fixed**: Node.js 22 compatibility using `arrayBuffer()` instead of deprecated `buffer()`
- **Added**: File system persistence with timestamp filenames
- **Added**: Proper error handling and API key validation

### Agent Behavior
- **Enhanced**: Multi-turn tool execution in continuous loop
- **Enhanced**: Function response handling with type checking
- **Enhanced**: Better error messages and validation

### Code Quality
- **Refactored**: Organized tools into dedicated directory
- **Refactored**: Centralized tool exports and definitions
- **Improved**: Type safety with proper interfaces
- **Cleaned**: Removed unused code and dependencies

## 🐛 Troubleshooting

### Common Issues

**Image generation fails:**
- Verify `HUGGINGFACE_API_KEY` is set in `.env`
- Check rate limits (free tier has monthly quotas)
- Ensure `generated_images/` directory permissions

**Gemini API errors:**
- Verify `GEMINI_API_KEY` is valid
- Check free tier quota limits
- Ensure proper API key format (starts with `AIzaSy...`)

**Tool not found:**
- Tools must be imported in `src/tools/index.ts`
- Tool must be added to switch statement in `src/toolRunner.ts`

## 📝 Adding New Tools

1. Create tool file in `src/tools/yourTool.ts`:
```typescript
import { z } from "zod";
import type { ToolFn } from "../../types";

export const yourToolDefinition = {
  name: "your_tool",
  parameters: z.object({
    param: z.string().describe("Parameter description"),
  }),
  description: "What your tool does",
};

type Args = z.infer<typeof yourToolDefinition.parameters>;

export const yourTool: ToolFn<Args, string> = async ({ toolArgs }) => {
  // Implementation
  return "result";
};
```

2. Export from `src/tools/index.ts`
3. Add to `src/toolRunner.ts` switch statement

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini API for LLM capabilities
- Hugging Face for free image generation
- Black Forest Labs for FLUX.1-schnell model
- icanhazdadjoke API for entertainment

---

**Built with ❤️ using TypeScript, Google Gemini, and Hugging Face**
