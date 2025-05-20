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
Tạo file `.env.local` trong thư mục gốc của dự án:

```powershell
# Windows PowerShell
New-Item .env.local -ItemType File

# Hoặc tạo file trống với nội dung mặc định
@"
# Các API keys có thể được cấu hình ở đây hoặc thông qua giao diện Settings
OPENAI_API_KEY=
GEMINI_API_KEY=
GROK_API_KEY=
CLAUDE_API_KEY=
DEEPSEEK_API_KEY=
"@ | Out-File -FilePath .env.local -Encoding UTF8
```

Lưu ý:
- File `.env.local` có thể để trống
- Bạn có thể cấu hình API keys thông qua giao diện Settings của ứng dụng
- Các API keys được lưu an toàn trong localStorage của trình duyệt
- Bạn có thể thay đổi API keys bất kỳ lúc nào thông qua Settings

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

## Liên hệ hỗ trợ
Nếu bạn gặp vấn đề trong quá trình cài đặt, vui lòng:
1. Kiểm tra [Issues](https://github.com/caonguyenthanhan/Ai-Demo-Project/issues)
2. Tạo issue mới nếu chưa có giải pháp
3. Liên hệ qua email: caonguyenthanhan.aaa@gmail.com