import { loadApiKey } from "@/lib/api-storage"

export async function callAIMLAPI(messages: any[]) {
  const apiKey = loadApiKey("aimlapi")
  if (!apiKey) {
    throw new Error("AIMLAPI API key not found. Please add your API key in settings.")
  }

  // Lọc chỉ giữ lại role và content cho từng message
  const cleanMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch("/api/proxy/aimlapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ messages: cleanMessages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content || result.choices?.[0]?.message?.content || result.message
  } catch (error: any) {
    throw new Error(`Failed to process request with AIMLAPI: ${error.message}`)
  }
}