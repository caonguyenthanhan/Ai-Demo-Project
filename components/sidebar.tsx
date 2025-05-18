"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AIModel } from "@/lib/types"
import { defaultModels } from "@/lib/models"
import { useSidebar } from "@/components/sidebar-provider"
import { Settings, Trash2, ExternalLink, MessageCircle, Globe, Layers, Settings as SettingsIcon } from "lucide-react"
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
  const apiModels = defaultModels.filter(m => !m.redirectToWebsite && !["general","domain","finetuned"].includes(m.id))
  const apiItems = apiModels.map(model => ({
    key: model.id,
    label: model.name,
    icon: model.icon,
    redirect: false
  }))
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
    } else if (apiItems.some(m => m.key === item.key)) {
      // Nếu là API Chatbox (model AI)
      const model = defaultModels.find(m => m.id === item.key)
      if (model) onSelectModel(model)
      onSelectChatbox(item.key)
    } else {
      // Chatbox thường
      onSelectChatbox(item.key)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold">AI Models Chatbox</h2>
              <p className="text-sm text-muted-foreground">By: {authorName}</p>
            </div>
            <ScrollArea className="px-3 py-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium px-2 py-1.5">Chatbox</h3>
                {chatboxItems.map(item => (
                  <Button
                    key={item.key}
                    variant={selectedChatbox === item.key ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${selectedChatbox === item.key ? (theme === "dark" ? "bg-white text-black" : "bg-black text-white") : ""}`}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
                <h3 className="text-sm font-medium px-2 py-1.5 mt-4">API Chatbox</h3>
                {apiItems.map(item => (
                  <Button
                    key={item.key}
                    variant={selectedChatbox === item.key ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${selectedChatbox === item.key ? (theme === "dark" ? "bg-white text-black" : "bg-black text-white") : ""}`}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
                <h3 className="text-sm font-medium px-2 py-1.5 mt-4">IDE Chatbox</h3>
                {ideItems.map(item => (
                  <Button
                    key={item.key}
                    variant={selectedChatbox === item.key ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${selectedChatbox === item.key ? (theme === "dark" ? "bg-white text-black" : "bg-black text-white") : ""}`}
                    onClick={() => handleSidebarItemClick(item)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 border-t border-border rounded-b-lg bg-card">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={onClearChat}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
