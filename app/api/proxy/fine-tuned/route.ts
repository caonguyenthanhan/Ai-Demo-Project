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

// Gọi endpoint Python backend (app.py)
async function askQuestionPythonAPI(question: string, context: string) {
  const API_URL = process.env.FINETUNE_PY_API_URL || "http://localhost:8000/fine-tuned";
  const payload = { question, context };
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Python API error: ${errorText}`);
  }
  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;
    const sessionId = "fine-tuned-chat"; // Có thể thay đổi thành ID session thực tế

    // TODO: Thay bằng giá trị thực tế hoặc lấy từ biến môi trường
    const MODEL_ID = process.env.HF_MODEL_ID || "deepset/roberta-base-squad2";
    const HF_TOKEN = process.env.HF_TOKEN || "";
    const kbPath = process.env.FINETUNE_KB_PATH || "./models/knowledge_base.csv";
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

    const hfResult = await askQuestionPythonAPI(userMessage, context);
    // Kết quả trả về có thể khác nhau tùy model, cần kiểm tra trường 'answer' và 'score'
    return NextResponse.json({
      response: hfResult.answer || JSON.stringify(hfResult),
      confidence: hfResult.score || 0.0,
      category
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 