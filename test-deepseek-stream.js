// test-deepseek-stream.js
const axios = require('axios');

const DEEPSEEK_API_KEY = 'your-api-key-here';
const API_URL = 'https://api.deepseek.com/chat/completions';

async function callDeepSeekAPIWithStream() {
  try {
    const response = await axios.post(API_URL, {
      model: "deepseek-chat",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Tell me a long story about AI"}
      ],
      stream: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      responseType: 'stream'
    });

    response.data.on('data', chunk => {
      const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') {
          return;
        }
        try {
          const parsed = JSON.parse(message);
          if (parsed.choices && parsed.choices[0].delta && parsed.choices[0].delta.content) {
            process.stdout.write(parsed.choices[0].delta.content);
          }
        } catch (error) {
          console.error('Could not parse message:', message, error);
        }
      }
    });

    response.data.on('end', () => {
      console.log('\nStream completed');
    });

  } catch (error) {
    console.error("Error calling DeepSeek API:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

callDeepSeekAPIWithStream();