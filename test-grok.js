import 'dotenv/config';

const XAI_API_KEY = process.env.XAI_API_KEY || '';

async function testGrokAPI() {
  const payload = {
    messages: [
      {
        role: 'system',
        content: 'You are a test assistant.',
      },
      {
        role: 'user',
        content: 'Testing. Just say hi and hello world and nothing else.',
      },
    ],
    model: 'grok-3-latest',
    stream: false,
    temperature: 0,
  };

  try {
    console.log('Using API Key:', XAI_API_KEY.replace(/(.{4}).*(.{4})/, '$1****$2'));
    console.log('Request Payload:', JSON.stringify(payload, null, 2));
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    console.log('Answer:', data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testGrokAPI();