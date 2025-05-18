import OpenAI from "openai"
import { loadApiKey } from "@/lib/api-storage"

export async function callOpenAI(messages: any[]) {
  try {
    const response = await fetch("/api/proxy/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content
  } catch (error: any) {
    throw new Error(`Failed to process request with OpenAI: ${error.message}`)
  }
} 