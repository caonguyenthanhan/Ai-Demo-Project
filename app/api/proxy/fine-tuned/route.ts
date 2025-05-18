import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages, modelPath, kbPath } = await req.json()
    const apiUrl = process.env.N8N_API_URL || ""

    const response = await fetch(`${apiUrl}/chat/fine-tuned`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages, modelPath, kbPath })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const result = await response.json()
    return NextResponse.json({ content: result.message })
  } catch (error) {
    console.error("Error in fine-tuned proxy:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 