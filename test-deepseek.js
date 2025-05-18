import 'dotenv/config';
import axios from 'axios';

const API_URL = 'https://api.deepseek.com/chat/completions';

async function callDeepSeekAPI() {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error("Error: API key not found in environment variables");
    return;
  }

  try {
    const response = await axios.post(API_URL, {
      model: "deepseek-chat",
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
      ],
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      }
    });

    console.log("Response:", response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.response?.data?.error?.message || error.message);
  }
}

callDeepSeekAPI();