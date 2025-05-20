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

    // Validate request body
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    console.log('Sending request to AIMLAPI:', {
      model: body.model || "gpt-3.5-turbo",
      messageCount: body.messages.length
    });

    const response = await fetch('https://api.aimlapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AIMLAPI_API_KEY}`
      },
      body: JSON.stringify({
        model: body.model || "gpt-3.5-turbo",
        messages: body.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AIMLAPI Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `AIMLAPI error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in aimlapi proxy:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function callAIMLAPI(messages: any[]) {
  const apiKey = loadApiKey("aimlapi")
  if (!apiKey) {
    throw new Error("AIMLAPI API key not found. Please add your API key in settings.")
  }

  // Validate messages
  if (!messages || !Array.isArray(messages)) {
    throw new Error("Invalid messages format")
  }

  // Clean messages
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
      body: JSON.stringify({ 
        messages: cleanMessages,
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Unknown error")
    }

    const result = await response.json()
    return result.choices?.[0]?.message?.content || result.content || result.message
  } catch (error: any) {
    throw new Error(`Failed to process request with AIMLAPI: ${error.message}`)
  }
}