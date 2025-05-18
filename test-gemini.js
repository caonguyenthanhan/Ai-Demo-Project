import 'dotenv/config'; //  *** THÊM DÒNG NÀY VÀO ĐẦU FILE! ***
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from 'node-fetch';

const API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";

async function testGeminiAPI() {
    try {
        console.log("API Key:", API_KEY);
        console.log("GEMINI_API_KEY env:", process.env.GEMINI_API_KEY);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const data = {
            "contents": [{
                "parts": [{ "text": "Explain how AI works" }]
            }]
        };

        console.log("Đang gửi request đến Gemini API...");

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
        const generatedText = result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0] && result.candidates[0].content.parts[0].text;

        console.log("\nKết quả từ Gemini:");
        console.log(generatedText);

    } catch (error) {
        console.error("\nLỗi khi gọi Gemini API:");
        console.error(error);
    }
}

testGeminiAPI();