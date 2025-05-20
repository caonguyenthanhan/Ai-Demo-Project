# Cấu hình API Keys

Để sử dụng các mô hình AI khác nhau, bạn cần cấu hình các API keys tương ứng trong file `.env.local`. Dưới đây là hướng dẫn chi tiết:

## 1. OpenAI API Key
- Đăng ký tại: https://platform.openai.com/
- Thêm vào `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## 2. X.AI (Grok) API Key
- Đăng ký tại: https://x.ai/
- Thêm vào `.env.local`:
```
XAI_API_KEY=your_xai_api_key_here
```

## 3. DeepSeek API Key
- Đăng ký tại: https://deepseek.com/
- Thêm vào `.env.local`:
```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

## 4. Claude API Key (khi có)
- Đăng ký tại: https://www.anthropic.com/
- Thêm vào `.env.local`:
```
CLAUDE_API_KEY=your_claude_api_key_here
```

## 5. AIMLAPI Key
- Đăng ký tại: https://aimlapi.com/
- Thêm vào `.env.local`:
```
AIMLAPI_API_KEY=your_aimlapi_key_here
```

## Lưu ý quan trọng:
1. Không bao giờ commit file `.env.local` vào repository
2. Đảm bảo API keys có đủ quota và quyền truy cập
3. Kiểm tra kỹ các endpoint và model name trước khi sử dụng
4. Một số mô hình có thể yêu cầu thanh toán hoặc đăng ký đặc biệt

## Xử lý lỗi phổ biến:
1. **401 Unauthorized**: Kiểm tra lại API key
2. **404 Not Found**: Kiểm tra endpoint và model name
3. **429 Too Many Requests**: Đã vượt quá quota
4. **500 Internal Server Error**: Kiểm tra cấu hình và thử lại sau

## Cấu hình AIMLAPI đặc biệt:
1. Sử dụng model mặc định: "gpt-3.5-turbo"
2. Nhiệt độ mặc định: 0.7
3. Số token tối đa mặc định: 1000
4. Định dạng tin nhắn: `{ role: string, content: string }` 