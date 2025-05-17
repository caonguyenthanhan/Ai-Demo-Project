import API_KEYS, { updateApiKey } from "@/config/api-keys"

// Prefix cho localStorage keys
const STORAGE_PREFIX = "ai_models_chatbox_api_key_"

// Hàm để lưu API key vào localStorage
export function saveApiKey(modelId: string, apiKey: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(`${STORAGE_PREFIX}${modelId}`, apiKey)
    // Cập nhật cả trong bộ nhớ
    updateApiKey(modelId, apiKey)
  }
}

// Hàm để lấy API key từ localStorage
export function loadApiKey(modelId: string): string {
  if (typeof window !== "undefined") {
    const storedKey = localStorage.getItem(`${STORAGE_PREFIX}${modelId}`)
    if (storedKey) {
      // Cập nhật cả trong bộ nhớ
      updateApiKey(modelId, storedKey)
      return storedKey
    }
  }
  return API_KEYS[modelId] || ""
}

// Hàm để xóa API key khỏi localStorage
export function removeApiKey(modelId: string): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(`${STORAGE_PREFIX}${modelId}`)
    updateApiKey(modelId, "")
  }
}

// Hàm để tải tất cả API keys từ localStorage khi ứng dụng khởi động
export function loadAllApiKeys(): void {
  if (typeof window !== "undefined") {
    Object.keys(API_KEYS).forEach((modelId) => {
      const storedKey = localStorage.getItem(`${STORAGE_PREFIX}${modelId}`)
      if (storedKey) {
        updateApiKey(modelId, storedKey)
      }
    })
  }
}

// Hàm để lưu tất cả API keys vào localStorage
export function saveAllApiKeys(apiKeys: Record<string, string>): void {
  if (typeof window !== "undefined") {
    Object.entries(apiKeys).forEach(([modelId, apiKey]) => {
      if (apiKey) {
        localStorage.setItem(`${STORAGE_PREFIX}${modelId}`, apiKey)
        updateApiKey(modelId, apiKey)
      }
    })
  }
}
