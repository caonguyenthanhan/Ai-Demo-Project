import { loadApiKey } from "@/lib/api-storage"

export async function callDeepSeek(messages: any[]) {
  const apiKey = loadApiKey("deepseek")
  if (!apiKey) {
    throw new Error("DeepSeek API key not found. Please add your API key in settings.")
  }

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages.map(msg => ({ role: msg.role, content: msg.content }))
        ],
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || "No response from DeepSeek"
  } catch (error: any) {
    throw new Error(`Failed to process request with DeepSeek: ${error.message}`)
  }
} 