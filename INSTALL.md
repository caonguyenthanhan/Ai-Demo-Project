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

### 2. Cài đặt dependencies
```powershell
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### 3. Tạo file môi trường
Tạo file `.env.local` trong thư mục gốc của dự án và thêm các API keys:
```plaintext
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
GROK_API_KEY=your_grok_api_key
CLAUDE_API_KEY=your_claude_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
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

## Liên hệ hỗ trợ
Nếu bạn gặp vấn đề trong quá trình cài đặt, vui lòng:
1. Kiểm tra [Issues](https://github.com/caonguyenthanhan/Ai-Demo-Project/issues)
2. Tạo issue mới nếu chưa có giải pháp
3. Liên hệ qua email: support@example.com 