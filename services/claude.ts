import Anthropic from "@anthropic-ai/sdk"
import { loadApiKey } from "@/lib/api-storage"

export async function callClaude(messages: any[]) {
  const apiKey = loadApiKey("claude")
  if (!apiKey) {
    throw new Error("Claude API key not found. Please add your API key in settings.")
  }

  try {
    const anthropic = new Anthropic({ apiKey })
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })) as any,
      max_tokens: 4096,
    })
    return completion.content[0].type === 'text' ? completion.content[0].text : "No text response from Claude"
  } catch (error: any) {
    throw new Error(`Failed to process request with Claude: ${error.message}`)
  }
} 