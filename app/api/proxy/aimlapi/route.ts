import { NextRequest, NextResponse } from "next/server"
import { loadApiKey } from "@/lib/api-storage"
// app/api/proxy/aimlapi/route.ts
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const apiKey = req.headers.get("authorization"); // Lấy từ header

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing API key" }), { status: 401 });
    }

    // Lọc chỉ giữ lại role và content cho từng message
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await fetch("https://api.aimlapi.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": apiKey,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: cleanMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error || text }), { status: response.status });
    }
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
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