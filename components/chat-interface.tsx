"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessages } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { useSidebar } from "@/components/sidebar-provider"
import type { AIModel, Message } from "@/lib/types"
import { defaultModels } from "@/lib/models"

export function ChatInterface() {
  const { isSidebarOpen } = useSidebar()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>(defaultModels[0])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          model: selectedModel.id,
          history: messages,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        model: selectedModel.name,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, there was an error processing your request. Please check your API configuration and try again.",
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
