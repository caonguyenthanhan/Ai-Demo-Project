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
      body: JSON.stringify({ 
        messages: cleanMessages,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || result.content || result.message
  } catch (error: any) {
    console.error('AIMLAPI Error:', error)
    throw new Error(`Failed to process request with AIMLAPI: ${error.message}`)
  }
}