import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const XAI_API_KEY = process.env.XAI_API_KEY;

    if (!XAI_API_KEY) {
      return NextResponse.json(
        { error: 'XAI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: body.messages,
        model: 'grok-3-latest',
        stream: false,
        temperature: body.temperature || 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in grok proxy:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 