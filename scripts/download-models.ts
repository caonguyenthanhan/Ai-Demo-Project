import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const MODEL_FOLDER_NAME = 'phobert-finetuned-viquad2';
const KB_FILE_NAME = 'knowledge_base.csv';
const MODELS_ZIP_PATH = path.join(process.cwd(), 'public', 'models.zip');
const MODELS_DIR = path.join(process.cwd(), 'models');

async function downloadAndExtractModels() {
  try {
    // Tạo thư mục models nếu chưa tồn tại
    if (!fs.existsSync(MODELS_DIR)) {
      fs.mkdirSync(MODELS_DIR);
    }

    // Nếu có models.zip thì giải nén như cũ
    if (fs.existsSync(MODELS_ZIP_PATH)) {
      console.log('Extracting models.zip...');
      await execAsync(`powershell Expand-Archive -Path "${MODELS_ZIP_PATH}" -DestinationPath "${MODELS_DIR}" -Force`);
    } else {
      // Nếu không có models.zip, tự động tải folder từ Google Drive bằng Python script
      console.log('models.zip not found, downloading from Google Drive using gdown...');
      await execAsync('python scripts/gdown_models.py');
    }

    // Cập nhật .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Cập nhật FINETUNE_MODEL_PATH
    const modelPathEnv = `FINETUNE_MODEL_PATH=./models/${MODEL_FOLDER_NAME}`;
    if (envContent.includes('FINETUNE_MODEL_PATH=')) {
      envContent = envContent.replace(/FINETUNE_MODEL_PATH=.*$/m, modelPathEnv);
    } else {
      envContent += `\n${modelPathEnv}`;
    }

    // Cập nhật FINETUNE_KB_PATH
    const kbPathEnv = `FINETUNE_KB_PATH=./models/${KB_FILE_NAME}`;
    if (envContent.includes('FINETUNE_KB_PATH=')) {
      envContent = envContent.replace(/FINETUNE_KB_PATH=.*$/m, kbPathEnv);
    } else {
      envContent += `\n${kbPathEnv}`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');

    return {
      success: true,
      modelPath: `./models/${MODEL_FOLDER_NAME}`,
      kbPath: `./models/${KB_FILE_NAME}`
    };
  } catch (error) {
    console.error('Error extracting or downloading models:', error);
    throw error;
  }
}

export default downloadAndExtractModels; 