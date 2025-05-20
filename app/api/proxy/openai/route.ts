import { NextRequest, NextResponse } from "next/server"
import OpenAI from 'openai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const response = await openai.chat.completions.create({
      model: body.model || "gpt-3.5-turbo",
      messages: body.messages,
      temperature: body.temperature || 0,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error in openai proxy:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 