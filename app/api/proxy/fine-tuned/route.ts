// Proxy endpoint cho Fine-tuned QA Chatbox sử dụng Hugging Face Inference API
// Nhận message, phân loại, lấy context từ knowledge base, gọi API Hugging Face và trả về kết quả

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Phân loại câu hỏi
function classifyQuestion(question: string): "SP" | "EVEN" | "FAQ" {
  const q = question.toLowerCase();
  const sp = ["ngành", "môn học", "học phần", "học phí", "tín chỉ", "chuyên ngành", "chương trình đào tạo"];
  const even = ["sự kiện", "lịch thi", "lịch nghỉ", "lịch học", "hạn chót", "khi nào", "bao giờ", "ngày mấy"];
  if (sp.some(k => q.includes(k))) return "SP";
  if (even.some(k => q.includes(k))) return "EVEN";
  return "FAQ";
}

// Lấy context từ knowledge base
function getContextFromKB(category: string, kb: any[]): string {
  const filtered = kb.filter(row => row.Category === category);
  return filtered.map(row => row.Answer).slice(0, 5).join(" ");
}

// Đọc knowledge base CSV
function readKnowledgeBase(kbPath: string): any[] {
  const csv = fs.readFileSync(kbPath, "utf-8");
  return parse(csv, { columns: true });
}

// Gọi Hugging Face Inference API
async function askQuestionHF(modelId: string, token: string, question: string, context: string) {
  const API_URL = `https://api-inference.huggingface.co/models/${modelId}`;
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  const payload = {
    inputs: {
      question,
      context
    },
    options: {
      wait_for_model: true
    }
  };
  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace API error: ${errorText}`);
  }
  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;
    const sessionId = "fine-tuned-chat";

    const MODEL_ID = "timpal0l/mdeberta-v3-base-squad2";
    const HF_TOKEN = process.env.HF_TOKEN || process.env.HF_TOKEN_API_KEY || "";
    const kbPath = "./models/knowledge_base.csv";

    if (!MODEL_ID || !HF_TOKEN) {
      return NextResponse.json({ error: "Thiếu HF_MODEL_ID hoặc HF_TOKEN. Vui lòng kiểm tra cấu hình API key." }, { status: 500 });
    }
    if (!fs.existsSync(kbPath)) {
      return NextResponse.json({ error: `Không tìm thấy knowledge base tại ${kbPath}` }, { status: 500 });
    }

    const kb = readKnowledgeBase(kbPath);
    const category = classifyQuestion(userMessage);
    const context = getContextFromKB(category, kb);

    if (!context) {
      return NextResponse.json({
        response: "Xin lỗi, tôi không tìm thấy thông tin phù hợp để trả lời câu hỏi của bạn.",
        confidence: 0.0,
        category
      });
    }

    let hfResult = await askQuestionHF(MODEL_ID, HF_TOKEN, userMessage, context);
    // Nếu trả về là mảng, lấy phần tử đầu tiên
    if (Array.isArray(hfResult)) {
      hfResult = hfResult[0] || {};
    }
    return NextResponse.json({
      answer: hfResult.answer || "",
      score: hfResult.score || 0.0,
      start: hfResult.start,
      end: hfResult.end,
      category
    });
  } catch (error: any) {
    console.error("[Fine-tuned API]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 