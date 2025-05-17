import { type NextRequest, NextResponse } from "next/server"
import type { Message } from "@/lib/types"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { xai } from "@ai-sdk/xai"
import { getApiKey } from "@/config/api-keys"

export async function POST(req: NextRequest) {
  try {
    const { message, model, history } = await req.json()

    // Convert history to the format expected by the AI SDK
    const formattedHistory = history.map((msg: Message) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add the new user message
    const messages = [...formattedHistory, { role: "user", content: message }]

    // Lấy API key từ file cấu hình
    const apiKey = getApiKey(model)

    // Kiểm tra xem có API key không
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key not found. Please add your API key in the settings or in the config/api-keys.ts file.",
        },
        { status: 400 },
      )
    }

    let response

    // Xử lý dựa trên model được chọn
    if (model === "openai") {
      const result = await generateText({
        model: openai("gpt-4o"),
        messages,
        apiKey,
      })
      response = result.text
    } else if (model === "grok") {
      const result = await generateText({
        model: xai("grok-3-beta"),
        messages,
      })
      response = result.text
    } else {
      response = `This is a simulated response from the AI model. In a real implementation, you would connect to the ${model} API using your API key. The message was: "${message}"`
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
