export async function callFineTunedAPI(messages: any[], modelPath: string, kbPath: string) {
  try {
    const response = await fetch("/api/proxy/fine-tuned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, modelPath, kbPath })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content
  } catch (error: any) {
    throw new Error(`Failed to process request with Fine-tuned API: ${error.message}`)
  }
} 