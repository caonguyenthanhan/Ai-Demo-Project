import 'dotenv/config';
import fetch from 'node-fetch';
import readline from 'readline';

const API_KEY = process.env.AIMLAPI_API_KEY || "YOUR_AIMLAPI_KEY";
const BASE_URL = "https://api.aimlapi.com/v1";

async function chatWithAI(messages) {
    try {
        const url = `${BASE_URL}/chat/completions`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}` 
        };
        const data = {
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;

    } catch (error) {
        return `Error: ${error.message}`;
    }
}


async function main() {
    let messages = [
        { "role": "system", "content": "You are a helpful AI assistant." }
    ];

    console.log("Terminal Chat 1:1 with AI (type 'quit' to exit)");
    console.log("-----------------------------------------------");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        const user_input = await new Promise(resolve => rl.question("You: ", resolve));

        if (user_input.toLowerCase() === 'quit') {
            console.log("Goodbye!");
            rl.close();
            break;
        }

        messages.push({ "role": "user", "content": user_input });

        const ai_response = await chatWithAI(messages);

        process.stdout.write("AI: ");
        for (const char of ai_response) {
            process.stdout.write(char);
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        console.log("\n");

        messages.push({ "role": "assistant", "content": ai_response });
    }
}

main();