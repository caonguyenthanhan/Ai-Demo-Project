import { loadApiKey } from "@/lib/api-storage"

export async function callGemini(messages: any[]) {
  const apiKey = loadApiKey("gemini")
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please add your API key in settings.")
  }

  try {
    const response = await fetch("/api/proxy/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content
  } catch (error: any) {
    throw new Error(`Failed to process request with Gemini: ${error.message}`)
  }
} 