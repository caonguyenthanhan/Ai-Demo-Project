import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const KB_FILE_ID = '1s9hiyVUjmfBC3L_vJZAUzQolvWW4iGGW';
const MODELS_DIR = path.join(process.cwd(), 'models');
const KB_PATH = path.join(MODELS_DIR, 'knowledge_base.csv');

export async function POST(req: NextRequest) {
  try {
    // Tạo thư mục models nếu chưa tồn tại
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR);
    }

    // Kiểm tra xem đã cài gdown chưa
    try {
      await execAsync('gdown --version');
    } catch (error) {
      return NextResponse.json(
        { error: 'gdown is not installed. Please install it using: pip install gdown' },
        { status: 500 }
      );
    }

    // Tải file bằng gdown
    console.log('Downloading knowledge base using gdown...');
    await execAsync(`gdown ${KB_FILE_ID} -O "${KB_PATH}"`);

    // Kiểm tra file đã tải
    if (!fs.existsSync(KB_PATH)) {
      throw new Error('Failed to download knowledge base file');
    }

    // Cập nhật .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Cập nhật FINETUNE_KB_PATH
    const kbPathEnv = `FINETUNE_KB_PATH=./models/knowledge_base.csv`;
    if (envContent.includes('FINETUNE_KB_PATH=')) {
      envContent = envContent.replace(/FINETUNE_KB_PATH=.*$/m, kbPathEnv);
    } else {
      envContent += `\n${kbPathEnv}`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');

    return NextResponse.json({ 
      success: true, 
      kbPath: './models/knowledge_base.csv' 
    });
  } catch (error: any) {
    console.error('Error downloading knowledge base:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to download knowledge base' },
      { status: 500 }
    );
  }
} 