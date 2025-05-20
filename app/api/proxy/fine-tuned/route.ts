import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Lấy tin nhắn cuối cùng từ người dùng
    const userMessage = messages[messages.length - 1].content;
    const sessionId = "fine-tuned-chat"; // Có thể thay đổi thành ID session thực tế

    // Chuẩn bị request body
    const requestBody = {
      message: userMessage,
      sessionId: sessionId,
      modelPath: process.env.FINETUNE_MODEL_PATH,
      kbPath: process.env.FINETUNE_KB_PATH
    };

    console.log(`[*] Đang gửi yêu cầu tới: ${process.env.N8N_API_URL}/chat/fine-tuned`);
    console.log(`[*] Tham số:`, requestBody);

    const response = await fetch(`${process.env.N8N_API_URL}/chat/fine-tuned`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`[*] Mã trạng thái HTTP: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[!] Lỗi: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log(`[*] Response:`, result);

    // Trả về response với cấu trúc phù hợp
    return NextResponse.json({
      message: result.response,
      confidence: result.confidence,
      category: result.category
    });
  } catch (error: any) {
    console.error("Error in fine-tuned proxy:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 