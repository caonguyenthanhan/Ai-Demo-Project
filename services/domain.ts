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

    // Thực hiện yêu cầu GET với timeout 30 giây
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

    const response = await fetch(`/api/proxy/domain?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
        if (errorJson.hint) {
          errorMessage += `\nHint: ${errorJson.hint}`;
        }
      } catch (e) {
        errorMessage += `, body: ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    // Trả về message từ response hoặc content nếu không có message
    return result.message || result.content || "Không có phản hồi từ server";
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout after 30 seconds');
    }
    throw new Error(`Failed to process request with Domain API: ${error.message}`);
  }
} 