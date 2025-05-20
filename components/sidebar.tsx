"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AIModel } from "@/lib/types"
import { defaultModels } from "@/lib/models"
import { useSidebar } from "@/components/sidebar-provider"
import { Settings, Trash2, ExternalLink, MessageCircle, Globe, Layers } from "lucide-react"
import { useState, useEffect } from "react"
import { SettingsDialog } from "@/components/settings-dialog"
import { useTheme } from "next-themes"

interface SidebarProps {
  isOpen: boolean
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
  onClearChat: () => void
  selectedChatbox: string
  onSelectChatbox: (key: string) => void
}

export function Sidebar({ isOpen, selectedModel, onSelectModel, onClearChat, selectedChatbox, onSelectChatbox }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [authorName, setAuthorName] = useState("Your Name")
  const { toggleSidebar } = useSidebar()
  const { theme } = useTheme()

  // Load tên tác giả khi component mount
  useEffect(() => {
    const savedAuthorName = localStorage.getItem("ai_models_chatbox_author_name")
    if (savedAuthorName) {
      setAuthorName(savedAuthorName)
    }
  }, [])

  // Danh sách nhóm sidebar
  const chatboxItems = [
    { key: "general", label: "General API Chatbox", icon: MessageCircle, redirect: false },
    { key: "domain", label: "Domain-based API Chatbox", icon: Globe, redirect: false },
    { key: "finetuned", label: "Fine-tuned Chatbox", icon: Layers, redirect: false },
  ]
  const apiModels = defaultModels.filter(m => !m.redirectToWebsite && !["domain","finetuned","general"].includes(m.id))
  const ideModels = defaultModels.filter(m => m.redirectToWebsite)
  const ideItems = ideModels.map(model => ({
    key: model.id,
    label: model.name,
    icon: model.icon,
    redirect: true,
    websiteUrl: model.websiteUrl
  }))

  const handleSidebarItemClick = (item: any) => {
    if (item.redirect && item.websiteUrl) {
      window.open(item.websiteUrl, "_blank")
    } else if (apiModels.some(m => m.id === item.key)) {
      // Nếu là API Chatbox (model AI)
      const model = defaultModels.find(m => m.id === item.key)
      if (model) onSelectModel(model)
      onSelectChatbox(item.key)
    } else {
      // Chatbox thường
      onSelectChatbox(item.key)
      // Nếu là General API Chatbox, set model là AIMLAPI
      if (item.key === "general") {
        const aimlModel = defaultModels.find(m => m.id === "aimlapi")
        if (aimlModel) onSelectModel(aimlModel)
      }
    }
  }

  return (
    <div
      className={`fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r bg-background transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">AI Models Chatbox</h2>
        <p className="text-sm text-muted-foreground">By: {authorName}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Chatbox</h3>
            {chatboxItems.map((item) => (
              <Button
                key={item.key}
                variant={selectedChatbox === item.key ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleSidebarItemClick(item)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">API Models</h3>
            {apiModels.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel.id === model.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleSidebarItemClick({ key: model.id })}
              >
                <model.icon className="mr-2 h-4 w-4" />
                {model.name}
              </Button>
            ))}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">IDE Models</h3>
            {ideItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSidebarItemClick(item)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
                <ExternalLink className="ml-auto h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" onClick={onClearChat}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
