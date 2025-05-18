import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.AIMLAPI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AIMLAPI API key not set on server." }, { status: 400 })
    }
    const url = "https://api.aimlapi.com/v1/chat/completions"
    const data = {
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 1000
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText }, { status: response.status })
    }
    const result = await response.json()
    return NextResponse.json({ content: result.choices?.[0]?.message?.content || "No response from AIMLAPI" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 