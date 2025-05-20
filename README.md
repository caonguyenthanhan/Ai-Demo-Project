# AI Models Unified Chatbox

Một giao diện thống nhất để tương tác với nhiều mô hình ngôn ngữ AI khác nhau, bao gồm ChatGPT, Gemini, Grok, v0 by Vercel, Claude AI, DeepSeek, Copilot, và Cursor.

## Tổng quan

Dự án này cung cấp một giao diện chat thống nhất cho phép người dùng tương tác với nhiều mô hình AI khác nhau thông qua một giao diện duy nhất. Người dùng có thể dễ dàng chuyển đổi giữa các mô hình khác nhau và quản lý API keys của họ thông qua giao diện cài đặt.

### Tính năng chính

- **Hỗ trợ nhiều mô hình AI**: ChatGPT, Gemini, Grok, v0 by Vercel, Claude AI, DeepSeek, Copilot, và Cursor
- **Giao diện người dùng hiện đại**: Giao diện dễ sử dụng với chế độ sáng/tối
- **Quản lý API keys**: Quản lý tập trung API keys thông qua file cấu hình hoặc giao diện cài đặt
- **Chuyển hướng thông minh**: Tự động chuyển hướng đến trang web chính thức cho các dịch vụ không có API công khai
- **Thiết kế đáp ứng**: Hoạt động tốt trên cả thiết bị di động và máy tính để bàn
- **Hỗ trợ Docker**: Dễ dàng triển khai với Docker

## Cài đặt

### Yêu cầu

- Node.js 18.0.0 trở lên
- npm, yarn, hoặc pnpm

### Cài đặt từ nguồn

1. Clone repository:
   ```bash
   git clone https://github.com/caonguyenthanhan/Ai-Demo-Project
   cd Ai-Demo-Project

2. Cài đặt các dependencies:

```shellscript
npm install
# hoặc
yarn install
# hoặc
pnpm install
```


3. Tạo file `.env.local` và thêm API keys của bạn (tùy chọn):

```plaintext
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
GROK_API_KEY=your_grok_api_key
CLAUDE_API_KEY=your_claude_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```


4. Khởi động server phát triển:

```shellscript
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```


5. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn.


### Cài đặt với Docker

1. Build Docker image:

```shellscript
docker build -t ai-models-chatbox .
```


2. Chạy container:

```shellscript
docker run -p 3000:3000 -e OPENAI_API_KEY=your_openai_api_key ai-models-chatbox
```


3. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn.


## Cấu hình API Keys

Dự án này hỗ trợ nhiều cách để cấu hình API keys:

### 1. Thông qua file cấu hình

Bạn có thể chỉnh sửa trực tiếp file `config/api-keys.ts`:

```typescript
const API_KEYS: ApiKeysConfig = {
  openai: "your_openai_api_key",
  gemini: "your_gemini_api_key",
  grok: "your_grok_api_key",
  v0: "", // V0 không có API key công khai
  claude: "your_claude_api_key",
  deepseek: "your_deepseek_api_key",
  copilot: "", // Copilot không có API key công khai
  cursor: "", // Cursor không có API key công khai
};
```

### 2. Thông qua giao diện cài đặt

1. Nhấp vào nút "Settings" trong sidebar
2. Chuyển đến tab "API Keys"
3. Nhập API keys của bạn cho các mô hình tương ứng
4. Nhấp vào "Save Settings"


API keys sẽ được lưu vào localStorage của trình duyệt.

### 3. Thông qua biến môi trường

Bạn có thể cấu hình API keys thông qua biến môi trường:

- Trong phát triển cục bộ: Sử dụng file `.env.local`
- Trong sản xuất: Cấu hình biến môi trường trên nền tảng triển khai của bạn (ví dụ: Vercel)


## Cách sử dụng

### Kiến trúc hệ thống

Ứng dụng được xây dựng theo mô hình client-server với proxy backend:

1. **Frontend (Next.js App Router)**
   - Giao diện người dùng React với Tailwind CSS và shadcn/ui
   - Quản lý trạng thái và tương tác người dùng
   - Gọi API thông qua proxy backend

2. **Backend Proxy**
   - Xử lý tất cả các yêu cầu API AI
   - Bảo mật API keys
   - Xử lý lỗi CORS/CSP
   - Hỗ trợ nhiều mô hình AI

### Luồng hoạt động

1. **Khởi tạo**
   - Người dùng cấu hình API keys trong Settings
   - Keys được lưu an toàn trong localStorage
   - Backend proxy sử dụng keys từ biến môi trường

2. **Tương tác**
   - Người dùng chọn mô hình AI từ sidebar
   - Nhập tin nhắn vào chat interface
   - Frontend gửi request đến proxy backend
   - Backend xử lý request với API key tương ứng
   - Kết quả được trả về và hiển thị trong chat

3. **Xử lý đặc biệt**
   - Các mô hình không có API công khai (V0, Copilot, Cursor) sẽ chuyển hướng đến trang web chính thức
   - Mỗi mô hình có route proxy riêng: `/api/proxy/{model}`
   - Lỗi được xử lý và hiển thị thân thiện với người dùng

### Bảo mật

- API keys được lưu trữ an toàn trong biến môi trường server
- Không có key nào được lộ ra frontend
- Tất cả request đều đi qua proxy backend
- Hỗ trợ HTTPS và các biện pháp bảo mật khác

## Cấu trúc dự án

```plaintext
project-root/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   └── chat/         # Chat API endpoint
│   │   └── proxy/        # Proxy API endpoint
│   │       └── {model}   # Model-specific proxy endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # React context providers
├── components/           # React components
│   ├── chat-header.tsx   # Chat header component
│   ├── chat-input.tsx    # Chat input component
│   ├── chat-interface.tsx # Main chat interface
│   ├── chat-messages.tsx # Chat messages component
│   ├── settings-dialog.tsx # Settings dialog
│   ├── sidebar.tsx       # Sidebar component
│   ├── sidebar-provider.tsx # Sidebar context provider
│   ├── theme-provider.tsx # Theme provider
│   └── ui/               # UI components from shadcn/ui
├── config/               # Configuration files
│   └── api-keys.ts       # API keys configuration
├── lib/                  # Utility functions and types
│   ├── api-storage.ts    # API keys storage utilities
│   ├── models.ts         # AI models configuration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
├── public/               # Static files
├── .env.local            # Local environment variables (not in git)
├── .gitignore            # Git ignore file
├── Dockerfile            # Docker configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Project dependencies
├── README.md             # Project documentation
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Triển khai

### Triển khai trên Vercel

1. Fork repository này
2. Tạo một dự án mới trên Vercel
3. Liên kết dự án với repository của bạn
4. Cấu hình biến môi trường (API keys) trong cài đặt dự án Vercel
5. Triển khai!


### Triển khai với Docker

1. Build Docker image:

```shellscript
docker build -t ai-models-chatbox .
```


2. Chạy container với biến môi trường:

```shellscript
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_openai_api_key \
  -e GEMINI_API_KEY=your_gemini_api_key \
  -e GROK_API_KEY=your_grok_api_key \
  ai-models-chatbox
```




## Lưu ý về API Keys

- **Bảo mật**: Không bao giờ commit API keys vào repository công khai
- **V0, Copilot, Cursor**: Các dịch vụ này không cung cấp API keys công khai và chỉ có thể được sử dụng thông qua trang web chính thức của chúng
- **Biến môi trường**: Trong sản xuất, nên sử dụng biến môi trường thay vì lưu trữ API keys trong code


## Đóng góp

Đóng góp luôn được hoan nghênh! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'Add some amazing feature'`)
4. Push đến branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request


## Giấy phép

Dự án này được cấp phép theo giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

## Tác giả

- **Cao Nguyễn Thành An** - [GitHub Profile](https://github.com/caonguyenthanhan)
- **Cao Nguyễn Thành An** - [GitHub Profile](https://github.com/caonguyenthanhan)

## Lời cảm ơn

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Thư viện UI components
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel AI SDK](https://sdk.vercel.ai/) - SDK cho tích hợp AI

# AI Demo Project

## Proxy Backend cho AI API

Tất cả lệnh gọi API AI (OpenAI, Gemini, Claude, DeepSeek, Grok, AIMLAPI) đều đi qua backend proxy:
- Mỗi model có route riêng: `app/api/proxy/{model}/route.ts`
- Frontend chỉ gọi `/api/proxy/{model}`
- API key lấy từ biến môi trường server, không lộ ra frontend, không bị CORS/CSP

### Cấu hình biến môi trường
Tạo file `.env.local` với nội dung:
```
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
AIMLAPI_API_KEY=...
GROK_API_KEY=...
CLAUDE_API_KEY=...
DEEPSEEK_API_KEY=...
```

### Lợi ích
- Bảo mật key tuyệt đối
- Không bị lỗi CORS, CSP
- Dễ mở rộng cho các model AI khác

### Khởi động lại server sau khi thay đổi key

---

## Các route proxy đã có:
- `/api/proxy/openai`
- `/api/proxy/gemini`
- `/api/proxy/aimlapi`
- `/api/proxy/grok`
- `/api/proxy/claude`
- `/api/proxy/deepseek`

---

## Lưu ý
- Không cần cài đặt SDK AI ở frontend
- Chỉ cần sửa service frontend gọi đúng endpoint proxy

## Hướng dẫn sử dụng AIMLAPI

- Để sử dụng AIMLAPI, bạn cần nhập API key hợp lệ vào Settings > API Keys > AIMLAPI.
- Khi gửi tin nhắn, chỉ gửi các trường `role` và `content` cho từng message (không gửi id, timestamp, model).
- Hệ thống sẽ tự động proxy request qua backend để đảm bảo bảo mật và không bị lỗi CORS/CSP.
- Nếu gặp lỗi 401 hoặc 400, kiểm tra lại API key và cấu trúc message.
