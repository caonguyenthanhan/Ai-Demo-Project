import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env.local');

export async function POST(req: NextRequest) {
  const { model, apiKey } = await req.json();

  if (!model || !apiKey) {
    return NextResponse.json({ error: 'Missing model or apiKey' }, { status: 400 });
  }

  let envContent = '';
  if (fs.existsSync(ENV_PATH)) {
    envContent = fs.readFileSync(ENV_PATH, 'utf-8');
  }

  // Lấy tên biến môi trường đúng chuẩn
  const envKey = model.toUpperCase() + '_API_KEY';
  const regex = new RegExp(`^${envKey}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${envKey}=${apiKey}`);
  } else {
    envContent += `\n${envKey}=${apiKey}`;
  }

  fs.writeFileSync(ENV_PATH, envContent.trim() + '\n', 'utf-8');

  return NextResponse.json({ success: true });
} 