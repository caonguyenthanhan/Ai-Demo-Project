export async function callFineTunedAPI(messages: any[]) {
  try {
    const response = await fetch("/api/proxy/fine-tuned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

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
    
    // Trả về answer nếu có, nếu không trả về toàn bộ response dạng JSON
    if (result.answer) {
      return result.answer;
    }
    if (result.response) {
      return result.response;
    }
    return JSON.stringify(result);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout after 30 seconds');
    }
    throw new Error(`Failed to process request with Fine-tuned API: ${error.message}`);
  }
} 