"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AIModel } from "@/lib/types"
import { defaultModels } from "@/lib/models"
import { useSidebar } from "@/components/sidebar-provider"
import { Settings, Trash2, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { SettingsDialog } from "@/components/settings-dialog"

interface SidebarProps {
  isOpen: boolean
  selectedModel: AIModel
  onSelectModel: (model: AIModel) => void
  onClearChat: () => void
}

export function Sidebar({ isOpen, selectedModel, onSelectModel, onClearChat }: SidebarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [authorName, setAuthorName] = useState("Your Name")
  const { toggleSidebar } = useSidebar()

  // Load tên tác giả khi component mount
  useEffect(() => {
    const savedAuthorName = localStorage.getItem("ai_models_chatbox_author_name")
    if (savedAuthorName) {
      setAuthorName(savedAuthorName)
    }
  }, [])

  const handleModelClick = (model: AIModel) => {
    if (model.redirectToWebsite && model.websiteUrl) {
      // Mở trang web trong tab mới
      window.open(model.websiteUrl, "_blank")
    } else {
      // Chọn model như bình thường
      onSelectModel(model)
    }
  }

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">AI Models Chatbox</h2>
            <p className="text-sm text-muted-foreground">By: {authorName}</p>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium px-2 py-1.5">Available Models</h3>
              {defaultModels.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModel.id === model.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => handleModelClick(model)}
                >
                  <model.icon className="mr-2 h-4 w-4" />
                  {model.name}
                  {model.redirectToWebsite && <ExternalLink className="ml-auto h-3 w-3" />}
                </Button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
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
