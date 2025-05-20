# Hướng dẫn cài đặt và chạy ứng dụng

## Yêu cầu hệ thống
- Node.js 18.0.0 trở lên
- npm hoặc yarn hoặc pnpm
- Git

## Các bước cài đặt

### 1. Clone repository
```powershell
git clone https://github.com/caonguyenthanhan/Ai-Demo-Project
cd Ai-Demo-Project
```

### 2. Cài đặt dependencies (BẮT BUỘC)
```powershell
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Tạo cấu trúc thư mục và file cấu hình
```powershell
# Tạo thư mục config
New-Item -ItemType Directory -Path config -Force

# Tạo file api-keys.ts trong thư mục config
@"
export interface ApiKeysConfig {
  openai: string;
  gemini: string;
  grok: string;
  v0: string;
  claude: string;
  deepseek: string;
  copilot: string;
  cursor: string;
}

const API_KEYS: ApiKeysConfig = {
  openai: "",
  gemini: "",
  grok: "",
  v0: "",
  claude: "",
  deepseek: "",
  copilot: "",
  cursor: "",
};

export const updateApiKey = (model: keyof ApiKeysConfig, key: string) => {
  API_KEYS[model] = key;
};

export default API_KEYS;
"@ | Out-File -FilePath config/api-keys.ts -Encoding UTF8

# Tạo file .env.local
New-Item .env.local -ItemType File
```

### 4. Chạy ứng dụng ở môi trường development
```powershell
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: http://localhost:3000

## Chạy với Docker

### 1. Build Docker image
```powershell
docker build -t ai-models-chatbox .
```

### 2. Chạy container
```powershell
docker run -p 3000:3000 -e OPENAI_API_KEY=your_openai_api_key ai-models-chatbox
```

## Xử lý lỗi thường gặp

### 1. Lỗi không tìm thấy module
```powershell
npm install
# hoặc xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### 2. Lỗi port đã được sử dụng
- Đóng các ứng dụng đang sử dụng port 3000
- Hoặc thay đổi port trong file `.env.local`:
```plaintext
PORT=3001
```

### 3. Lỗi API key không hợp lệ
- Kiểm tra lại các API keys trong file `.env.local`
- Đảm bảo các API keys có quyền truy cập hợp lệ
- Hoặc cấu hình API keys thông qua giao diện Settings

### 4. Lỗi Module not found
Nếu gặp lỗi "Module not found", hãy kiểm tra:
- Thư mục `config` đã được tạo chưa
- File `api-keys.ts` đã tồn tại trong thư mục `config` chưa
- Nội dung file `api-keys.ts` đã đúng chưa

### 5. Lỗi 'next' is not recognized
Nếu gặp lỗi này, hãy thực hiện các bước sau:
1. Xóa thư mục node_modules:
```powershell
rm -rf node_modules
```
2. Xóa file package-lock.json:
```powershell
rm package-lock.json
```
3. Cài đặt lại dependencies:
```powershell
npm install
```
4. Chạy lại ứng dụng:
```powershell
npm run dev
```

## Liên hệ hỗ trợ
Nếu bạn gặp vấn đề trong quá trình cài đặt, vui lòng:
1. Kiểm tra [Issues](https://github.com/caonguyenthanhan/Ai-Demo-Project/issues)
2. Tạo issue mới nếu chưa có giải pháp
3. Liên hệ qua email: caonguyenthanhan.aaa@gmail.com