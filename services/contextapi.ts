export async function callContextAPI(messages: any[]) {
  try {
    const response = await fetch("/api/proxy/context", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content || result.choices?.[0]?.message?.content || result.message
  } catch (error: any) {
    throw new Error(`Failed to process request with Context API: ${error.message}`)
  }
} 