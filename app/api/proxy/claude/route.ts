import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.CLAUDE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Claude API key not set on server." }, { status: 400 })
    }
    const url = "https://api.anthropic.com/v1/messages"
    const data = {
      model: "claude-3-opus-20240229",
      messages: messages.map((msg: any) => ({ role: msg.role, content: msg.content })),
      max_tokens: 4096
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText }, { status: response.status })
    }
    const result = await response.json()
    const text = result.content && result.content[0] && result.content[0].type === 'text' ? result.content[0].text : "No text response from Claude"
    return NextResponse.json({ content: text })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 