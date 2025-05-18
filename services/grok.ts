import { loadApiKey } from "@/lib/api-storage"

export async function callGrok(messages: any[]) {
  const apiKey = loadApiKey("grok")
  if (!apiKey) {
    throw new Error("Grok API key not found. Please add your API key in settings.")
  }

  try {
    const payload = {
      model: 'grok-3-latest',
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ],
      stream: false,
      temperature: 0
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || "No response from Grok"
  } catch (error: any) {
    throw new Error(`Failed to process request with Grok: ${error.message}`)
  }
} 