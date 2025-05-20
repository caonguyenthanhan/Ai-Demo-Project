import { NextRequest, NextResponse } from "next/server"
import 'dotenv/config';
import axios from 'axios';

// Lấy N8N_WEBHOOK_URL từ biến môi trường
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const message = searchParams.get("message");
    const sessionId = searchParams.get("sessionId");

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "Message and sessionId are required" },
        { status: 400 }
      );
    }

    // Kiểm tra N8N_WEBHOOK_URL có tồn tại
    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL is not configured. Please set it in Settings." },
        { status: 500 }
      );
    }

    // Gọi n8n webhook với query parameters
    const n8nUrl = new URL(N8N_WEBHOOK_URL);
    n8nUrl.searchParams.append("message", message);
    n8nUrl.searchParams.append("sessionId", sessionId);

    console.log(`[*] Đang gửi yêu cầu tới: ${n8nUrl.toString()}`);
    console.log(`[*] Tham số: message=${message}, sessionId=${sessionId}`);

    const response = await fetch(n8nUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store"
    });

    console.log(`[*] Mã trạng thái HTTP: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[!] Lỗi: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    // Đọc response dưới dạng text
    const responseText = await response.text();
    console.log(`[*] Response text: ${responseText}`);

    // Trả về response dưới dạng text trong object message
    return NextResponse.json({ message: responseText });
  } catch (error: any) {
    console.error("Error in domain proxy:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 