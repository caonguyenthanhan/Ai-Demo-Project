export async function callDomainAPI(messages: any[]) {
  try {
    const response = await fetch("/api/proxy/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content
  } catch (error: any) {
    throw new Error(`Failed to process request with Domain API: ${error.message}`)
  }
} 