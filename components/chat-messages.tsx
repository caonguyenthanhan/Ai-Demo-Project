"use client"

import type React from "react"
import type { Message, AIModel } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatTimestamp } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useTheme } from "next-themes"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  selectedModel: AIModel
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export function ChatMessages({ messages, isLoading, selectedModel, messagesEndRef }: ChatMessagesProps) {
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  return (
    <ScrollArea className="h-full p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <selectedModel.icon className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Welcome to AI Models Chatbox</h3>
          <p className="text-muted-foreground max-w-md">
            Start a conversation with {selectedModel.name} or select a different AI model from the sidebar.
          </p>
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-2" : "mr-2"}`}>
                  {message.role === "user" ? (
                    <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-medium">
                      U
                    </div>
                  ) : (
                    <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center">
                      <selectedModel.icon className="h-4 w-4" />
                    </div>
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 text-xs mt-1 ${ // Moved text-xs and mt-1 here
                    message.role === "user"
                      ? isDarkTheme
                        ? "bg-primary text-black/70" // Dark mode: black text with opacity
                        : "bg-primary text-white/70" // Light mode: white text with opacity
                      : "bg-muted text-muted-foreground" // Use text-muted-foreground for model
                  }`}
                >
                  <div className="max-w-none" style={{ color: "inherit", opacity: "inherit" }}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  {formatTimestamp(message.timestamp)}
                  {message.model && ` · ${message.model}`}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row">
                <Avatar className="h-8 w-8 mr-2">
                  <div className="bg-secondary text-secondary-foreground h-full w-full flex items-center justify-center">
                    <selectedModel.icon className="h-4 w-4" />
                  </div>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  )
}