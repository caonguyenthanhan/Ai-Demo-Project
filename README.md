# AI Models Unified Chatbox

Một giao diện thống nhất để tương tác với nhiều mô hình ngôn ngữ AI khác nhau, bao gồm ChatGPT, Gemini, Grok, v0 by Vercel, Claude AI, DeepSeek, Copilot, và Cursor.

## Tổng quan

Dự án này cung cấp một giao diện chat thống nhất cho phép người dùng tương tác với nhiều mô hình AI khác nhau thông qua một giao diện duy nhất. Người dùng có thể dễ dàng chuyển đổi giữa các mô hình khác nhau và quản lý API keys của họ thông qua giao diện cài đặt.

### Tính năng chính

- **Hỗ trợ nhiều mô hình AI**: ChatGPT, Gemini, Grok, v0 by Vercel, Claude AI, DeepSeek, Copilot, và Cursor
- **Fine-tuned QA Chatbox**: Tích hợp mô hình câu hỏi-đáp được fine-tune trên dữ liệu tiếng Việt
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

Xem hướng dẫn chi tiết tại [INSTALL.md](INSTALL.md)

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
AIMLAPI_API_KEY=your_aimlapi_key
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
Dự án này hỗ trợ nhiều cách để cấu hình API keys, bạn có thể lấy api theo hướng dẫn ở [link_api.md](link_api.md)

### 1. Thông qua giao diện Settings

1. Nhấp vào nút "Settings" trong sidebar
2. Chuyển đến tab "API Keys"
3. Nhập các API keys tương ứng:
   - **ChatGPT**: API key từ OpenAI
   - **Gemini**: API key từ Google AI Studio
   - **Grok**: API key từ X.AI
   - **Claude AI**: API key từ Anthropic
   - **DeepSeek**: API key từ DeepSeek
   - **AIMLAPI**: API key từ AIMLAPI (Sử dụng cho General API Chatbox)
   - **N8N API URL**: Webhook URL từ n8n (Sử dụng cho Domain-based Chatbox)

4. Trong tab "Preferences", bạn có thể cấu hình:
   - **Author Name**: Tên tác giả hiển thị trên sidebar
   - **N8N_API_URL**: URL webhook của n8n cho Domain-based Chatbox
   - **FINETUNE_MODEL_PATH**: Đường dẫn đến mô hình fine-tuned (mặc định: ./phobert-finetuned-viquad2)
   - **FINETUNE_KB_PATH**: Đường dẫn đến file knowledge base (mặc định: ./knowledge_base.csv)

5. Nhấp "Save Settings" để lưu cấu hình

Lưu ý:
- API keys sẽ được lưu an toàn trong localStorage của trình duyệt
- Các keys cũng được tự động lưu vào file `.env.local` để backend sử dụng
- Một số mô hình (v0, Copilot, Cursor) không yêu cầu API key và sẽ chuyển hướng đến trang web chính thức
- General API Chatbox sử dụng AIMLAPI (https://aimlapi.com/app/keys/)
- Domain-based Chatbox sử dụng N8N webhook
- Fine-tuned Chatbox sử dụng mô hình local, không cần API key

### 2. Thông qua file .env.local

Bạn có thể cấu hình API keys thông qua biến môi trường:

```plaintext
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
GROK_API_KEY=your_grok_api_key
CLAUDE_API_KEY=your_claude_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
AIMLAPI_API_KEY=your_aimlapi_key
```

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
- **Đào Minh Hoàng** - [GitHub Profile](https://github.com/minhhoang15)

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

## Tải và cấu hình mô hình Fine-tuned (phobert-finetuned-viquad2) và Knowledge Base

### 1. Sử dụng chức năng Download Models trên UI
- Vào phần **Settings > API Keys**.
- Nhấn nút **Download Models** để tự động tải và giải nén model cùng knowledge base từ Google Drive về thư mục `models`.
- Đường dẫn sẽ được cập nhật tự động vào file `.env.local`.

### 2. Yêu cầu hệ thống
- Máy cần cài đặt **Python 3** và thư viện **gdown**:
  ```sh
  pip install gdown
  ```
- Script sẽ tự động gọi `gdown` để tải folder từ Google Drive nếu không tìm thấy file `models.zip` trong thư mục `public`.

### 3. Cách hoạt động tự động
- Nếu có file `public/models.zip` → script sẽ giải nén vào thư mục `models`.
- Nếu không có file zip, script sẽ tự động tải folder từ Google Drive: [Tải model tại đây](https://drive.google.com/drive/folders/1vi95ZM9cfAD75l1NpoMjEo-X4wQZperD?usp=sharing)
- Sau khi tải hoặc giải nén xong, script sẽ tự động cập nhật các biến môi trường:
  - `FINETUNE_MODEL_PATH=./models/phobert-finetuned-viquad2`
  - `FINETUNE_KB_PATH=./models/knowledge_base.csv`

### 4. Tùy chọn: Tạo file models.zip thủ công (dùng offline)
- Nếu muốn sử dụng offline, bạn có thể tự tạo file `models.zip` chứa:
  - Thư mục `phobert-finetuned-viquad2`
  - File `knowledge_base.csv`
- Đặt file `models.zip` vào thư mục `public` của dự án.
- Khi nhấn Download Models, script sẽ giải nén file này thay vì tải từ Google Drive.

### 5. Lưu ý
- Nếu gặp lỗi về quyền truy cập hoặc thiếu file, kiểm tra lại vị trí và tên file/thư mục.
- Đảm bảo đã cài Python và gdown trước khi sử dụng chức năng này.

## Câu hỏi thường gặp (FAQ)

### 1. Lấy Hugging Face API Token và model_id, điền vào biến môi trường như thế nào?

- **API Token:**
  1. Truy cập [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
  2. Nhấn "New token" để tạo token mới (chọn quyền "Read")
  3. Sao chép token, ví dụ: `hf_xxxxxxxxxxxxxxxxxxxxx`

- **Model ID:**
  - Là tên model trên Hugging Face Hub, ví dụ: `An-CNT/phobert-finetuned-viquad2` hoặc `deepset/roberta-base-squad2`
  - Xem trên URL model: `https://huggingface.co/An-CNT/phobert-finetuned-viquad2`

- **Khai báo vào biến môi trường:**
  - Thêm vào file `.env.local` ở thư mục gốc dự án:
    ```env
    HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx
    HF_MODEL_ID=An-CNT/phobert-finetuned-viquad2
    ```
  - Hoặc cấu hình biến môi trường tương ứng trên nền tảng deploy (Vercel, Docker, ...)

### 2. Định dạng knowledge base và vị trí đặt file

- **Định dạng knowledge base:**
  - File CSV, mã hóa UTF-8, có ít nhất 2 cột: `Category` và `Answer`
  - Ví dụ mẫu:
    ```csv
    Category,Answer
    FAQ,Trường Đại học Bách Khoa được thành lập năm 1957.
    SP,Chuyên ngành Khoa học Máy tính đào tạo các kiến thức về lập trình, AI, dữ liệu lớn...
    EVEN,Lịch thi học kỳ sẽ được công bố vào đầu tháng 6.
    FAQ,Trường có nhiều câu lạc bộ học thuật và kỹ năng mềm.
    ```
- **Vị trí đặt file:**
  - Mặc định: `./models/knowledge_base.csv` (tức là thư mục `models` trong root dự án)
  - Có thể thay đổi đường dẫn bằng biến môi trường trong `.env.local`:
    ```env
    FINETUNE_KB_PATH=./models/knowledge_base.csv
    ```
- **Lưu ý:**
  - Đảm bảo file CSV không có BOM, không có dòng trống đầu/cuối.
  - Nếu deploy server, cần upload file knowledge base lên đúng vị trí cấu hình.

### Fine-tuned QA Chatbox

Fine-tuned QA Chatbox là một tính năng đặc biệt sử dụng mô hình ngôn ngữ được fine-tune trên dữ liệu tiếng Việt để trả lời câu hỏi chính xác và phù hợp với ngữ cảnh.

#### Cấu hình Fine-tuned QA Chatbox

1. **Hugging Face API Token**
   - Truy cập [Hugging Face](https://huggingface.co/settings/tokens) để tạo API token
   - Thêm token vào Settings với key `HF_TOKEN`

2. **Model và Knowledge Base**
   - Model ID mặc định: `An-CNT/phobert-finetuned-viquad2`
   - Knowledge base path mặc định: `./models/knowledge_base.csv`
   - Các giá trị này được cố định và không thể thay đổi trong UI

3. **Định dạng Knowledge Base**
   - File CSV với các cột: question, answer, category
   - Categories hỗ trợ: FAQ, SP (Special), EVEN (Event)
   - Tải knowledge base từ Google Drive đã cung cấp

4. **Biến môi trường**
   ```plaintext
   HF_TOKEN=your_huggingface_token
   HF_MODEL_ID=An-CNT/phobert-finetuned-viquad2
   FINETUNE_KB_PATH=./models/knowledge_base.csv
   ```

#### Luồng hoạt động

1. Người dùng gửi câu hỏi
2. Hệ thống phân loại câu hỏi (FAQ, SP, EVEN)
3. Lấy context phù hợp từ knowledge base
4. Gọi Hugging Face Inference API để sinh câu trả lời
5. Trả về kết quả bao gồm:
   - Câu trả lời
   - Độ tin cậy
   - Loại câu hỏi
