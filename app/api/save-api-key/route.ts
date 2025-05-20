import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');

export async function POST(req: NextRequest) {
  const { allApiKeys } = await req.json();

  if (!allApiKeys || typeof allApiKeys !== 'object') {
    return NextResponse.json({ error: 'Missing allApiKeys object' }, { status: 400 });
  }

  // Xóa file .env.local nếu tồn tại
  if (fs.existsSync(ENV_PATH)) {
    fs.unlinkSync(ENV_PATH);
  }

  // Ghi lại tất cả API key từ Settings UI
  let envContent = '';
  for (const [model, apiKey] of Object.entries(allApiKeys)) {
    if (!apiKey) continue;
    let envKey = model === 'domain' ? 'N8N_WEBHOOK_URL' : model.toUpperCase() + '_API_KEY';
    if (model === 'HF_MODEL_ID' || model === 'FINETUNE_KB_PATH' || model === 'HF_TOKEN') {
      envKey = model;
    }
    envContent += `${envKey}=${apiKey}\n`;
  }
  fs.writeFileSync(ENV_PATH, envContent.trim() + '\n', 'utf-8');

  // Trả về yêu cầu restart server cho frontend
  return NextResponse.json({ success: true, restartRequired: true });
} 