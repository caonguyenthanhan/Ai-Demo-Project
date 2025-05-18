import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "DeepSeek API key not set on server." }, { status: 400 })
    }
    const url = "https://api.deepseek.com/chat/completions"
    const data = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages.map((msg: any) => ({ role: msg.role, content: msg.content }))
      ],
      stream: false
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText }, { status: response.status })
    }
    const result = await response.json()
    return NextResponse.json({ content: result.choices?.[0]?.message?.content || "No response from DeepSeek" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 