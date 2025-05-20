import { loadApiKey } from "@/lib/api-storage"

export async function callDomainAPI(messages: any[]) {
  try {
    // Lấy tin nhắn cuối cùng từ người dùng
    const userMessage = messages[messages.length - 1].content;
    const sessionId = "domain-chat"; // Có thể thay đổi thành ID session thực tế

    // Chuẩn bị tham số cho yêu cầu GET
    const params = new URLSearchParams({
      message: userMessage,
      sessionId: sessionId
    });

    const response = await fetch(`/api/proxy/domain?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unknown error");
    return result.message || result.content || result.choices?.[0]?.message?.content;
  } catch (error: any) {
    throw new Error(`Failed to process request with Domain API: ${error.message}`);
  }
} 