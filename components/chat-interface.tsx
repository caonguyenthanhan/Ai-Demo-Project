"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { useSidebar } from "@/components/sidebar-provider"
import type { AIModel, Message } from "@/lib/types"
import { defaultModels } from "@/lib/models"
import { callOpenAI } from "@/services/openai"
import { callGemini } from "@/services/gemini"
import { callClaude } from "@/services/claude"
import { callDeepSeek } from "@/services/deepseek"
import { callGrok } from "@/services/grok"
import { callAIMLAPI } from "@/services/aimlapi"
import { callContextAPI } from "@/services/contextapi"
import { callDomainAPI } from "@/services/domainapi"
import { callFineTunedAPI } from "@/services/finetuned"

export function ChatInterface() {
  const { isSidebarOpen } = useSidebar()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(defaultModels[0])
  const [selectedChatbox, setSelectedChatbox] = useState("general")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  useEffect(() => {
    // Nếu selectedChatbox là 1 model id thì đổi selectedModel
    const model = defaultModels.find(m => m.id === selectedChatbox)
    if (model) setSelectedModel(model)
    // Nếu là 4 chatbox đầu thì không đổi model
  }, [selectedChatbox])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Kiểm tra xem model có phải là model chuyển hướng không
    if (selectedModel.redirectToWebsite) {
      // Thêm thông báo cho người dùng
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `${selectedModel.name} không có sẵn thông qua API. Vui lòng truy cập ${selectedModel.websiteUrl} để sử dụng dịch vụ này.`,
        timestamp: new Date(),
        model: selectedModel.name,
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      let response: string

      // Gọi API tương ứng với model được chọn
      switch (selectedModel.id) {
        case "openai":
          response = await callOpenAI([...messages, userMessage])
          break
        case "gemini":
          response = await callGemini([...messages, userMessage])
          break
        case "claude":
          response = await callClaude([...messages, userMessage])
          break
        case "deepseek":
          response = await callDeepSeek([...messages, userMessage])
          break
        case "grok":
          response = await callGrok([...messages, userMessage])
          break
        case "aimlapi":
          response = await callAIMLAPI([...messages, userMessage])
          break
        case "context":
          response = await callContextAPI([...messages, userMessage])
          break
        case "domain":
          response = await callDomainAPI([...messages, userMessage])
          break
        case "finetuned":
          response = await callFineTunedAPI([...messages, userMessage])
          break
        case "general":
          response = await callAIMLAPI([...messages, userMessage])
          break
        default:
          throw new Error(`Model ${selectedModel.id} is not supported yet.`)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        model: selectedModel.name,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Sorry, there was an error processing your request. Please check your API configuration and try again.",
        timestamp: new Date(),
        model: selectedModel.name,
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectModel = (model: AIModel) => {
    // Chỉ cập nhật model nếu không phải là model chuyển hướng
    if (!model.redirectToWebsite) {
      setSelectedModel(model)
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        onClearChat={handleClearChat}
        selectedChatbox={selectedChatbox}
        onSelectChatbox={setSelectedChatbox}
      />
      <div className={`flex flex-col flex-1 h-full transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <ChatHeader />
        <div className="flex-1 overflow-hidden bg-background">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            selectedModel={selectedModel}
            messagesEndRef={messagesEndRef}
          />
        </div>
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}
