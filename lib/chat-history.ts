import { Message } from "./types"

// Giới hạn số lượng tin nhắn trong lịch sử
const MAX_HISTORY_LENGTH = 10

// Lưu trữ lịch sử chat cho từng model
const chatHistories: { [key: string]: Message[] } = {}

// Thêm tin nhắn vào lịch sử
export function addMessageToHistory(modelId: string, role: "user" | "assistant" | "system", content: string) {
  if (!chatHistories[modelId]) {
    chatHistories[modelId] = []
  }

  chatHistories[modelId].push({ role, content })

  // Giới hạn độ dài lịch sử
  if (chatHistories[modelId].length > MAX_HISTORY_LENGTH) {
    chatHistories[modelId].shift() // Xóa tin nhắn cũ nhất
  }
}

// Lấy lịch sử chat của một model
export function getChatHistory(modelId: string): Message[] {
  return chatHistories[modelId] || []
}

// Xóa lịch sử chat của một model
export function clearChatHistory(modelId: string) {
  chatHistories[modelId] = []
}

// Xóa tất cả lịch sử chat
export function clearAllChatHistories() {
  Object.keys(chatHistories).forEach(key => {
    chatHistories[key] = []
  })
} 