# Active Context

## Trạng thái hiện tại
- Dự án đang trong giai đoạn khởi tạo
- Đã tạo cấu trúc cơ bản và documentation
- Cần thiết lập môi trường phát triển

## Các bước tiếp theo
1. Thiết lập môi trường phát triển
   - Cài đặt Node.js
   - Cài đặt dependencies
   - Cấu hình API keys

2. Phát triển tính năng cốt lõi
   - Giao diện chat
   - Quản lý API keys
   - Tích hợp các mô hình AI

3. Testing và Deployment
   - Unit testing
   - Integration testing
   - Deployment trên Vercel

## Quyết định đang hoạt động
1. Sử dụng Next.js App Router
2. TypeScript cho type safety
3. Tailwind CSS cho styling
4. shadcn/ui cho components
5. Vercel AI SDK cho AI integration

## Mẫu và sở thích
1. Code style
   - ESLint configuration
   - Prettier formatting
   - TypeScript strict mode

2. Git workflow
   - Feature branches
   - Pull requests
   - Semantic versioning

3. Testing
   - Jest for unit testing
   - React Testing Library
   - Cypress for E2E testing

## Thay đổi mới nhất
- Toàn bộ lệnh gọi API AI đã chuyển sang backend proxy (app/api/proxy/{model}/route.ts)
- API key lấy từ .env.local, không lộ ra frontend, không bị CORS/CSP
- Đã hoàn thiện proxy cho các model: OpenAI, Gemini, Claude, DeepSeek, Grok, AIMLAPI

## Hướng dẫn sử dụng
- Đặt key vào .env.local
- Khởi động lại server
- Frontend chỉ gọi endpoint proxy 