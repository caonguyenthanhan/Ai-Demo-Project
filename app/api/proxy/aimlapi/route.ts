import { NextRequest, NextResponse } from "next/server"
import { loadApiKey } from "@/lib/api-storage"
// app/api/proxy/aimlapi/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const AIMLAPI_API_KEY = process.env.AIMLAPI_API_KEY;

    if (!AIMLAPI_API_KEY) {
      return NextResponse.json(
        { error: 'AIMLAPI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIMLAPI_API_KEY}`
      },
      body: JSON.stringify({
        model: body.model || "gpt-3.5-turbo",
        messages: body.messages,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in aimlapi proxy:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function callAIMLAPI(messages: any[]) {
  const apiKey = loadApiKey("aimlapi")
  if (!apiKey) {
    throw new Error("AIMLAPI API key not found. Please add your API key in settings.")
  }

  // Lọc chỉ giữ lại role và content cho từng message
  const cleanMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch("/api/proxy/aimlapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({ messages: cleanMessages })
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || "Unknown error")
    return result.content || result.choices?.[0]?.message?.content || result.message
  } catch (error: any) {
    throw new Error(`Failed to process request with AIMLAPI: ${error.message}`)
  }
}