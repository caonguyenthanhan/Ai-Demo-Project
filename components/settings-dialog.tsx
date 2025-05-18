"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { defaultModels } from "@/lib/models"
import { useToast } from "@/hooks/use-toast"
import { loadAllApiKeys, loadApiKey, saveAllApiKeys } from "@/lib/api-storage"
import { ExternalLink } from "lucide-react"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [authorName, setAuthorName] = useState("Your Name")
  const [n8nApiUrl, setN8nApiUrl] = useState("")
  const [finetuneModelPath, setFinetuneModelPath] = useState("")
  const [finetuneKbPath, setFinetuneKbPath] = useState("")

  // Load API keys khi component mount
  useEffect(() => {
    if (isOpen) {
      loadAllApiKeys()
      const keys: Record<string, string> = {}
      defaultModels.forEach((model) => {
        keys[model.id] = loadApiKey(model.id)
      })
      setApiKeys(keys)
      const savedAuthorName = localStorage.getItem("ai_models_chatbox_author_name")
      if (savedAuthorName) {
        setAuthorName(savedAuthorName)
      }
      const savedN8nApiUrl = localStorage.getItem("N8N_API_URL")
      if (savedN8nApiUrl) setN8nApiUrl(savedN8nApiUrl)
      const savedFinetuneModelPath = localStorage.getItem("FINETUNE_MODEL_PATH")
      if (savedFinetuneModelPath) setFinetuneModelPath(savedFinetuneModelPath)
      const savedFinetuneKbPath = localStorage.getItem("FINETUNE_KB_PATH")
      if (savedFinetuneKbPath) setFinetuneKbPath(savedFinetuneKbPath)
    }
  }, [isOpen])

  const handleSaveSettings = () => {
    saveAllApiKeys(apiKeys)
    localStorage.setItem("ai_models_chatbox_author_name", authorName)
    localStorage.setItem("N8N_API_URL", n8nApiUrl)
    localStorage.setItem("FINETUNE_MODEL_PATH", finetuneModelPath)
    localStorage.setItem("FINETUNE_KB_PATH", finetuneKbPath)
    toast({
      title: "Settings saved",
      description: "Your API keys and preferences have been saved successfully.",
    })
    onClose()
  }

  const handleApiKeyChange = (modelId: string, value: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [modelId]: value,
    }))
  }

  const handleOpenWebsite = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Configure your API keys and preferences for the AI models.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-keys">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4 mt-4">
            <div className="max-h-[60vh] overflow-y-auto space-y-4">
              {defaultModels.map((model) => (
                <div key={model.id} className="space-y-2">
                  <Label htmlFor={`api-key-${model.id}`}>
                    <div className="flex items-center">
                      <model.icon className="h-4 w-4 mr-2" />
                      {model.name} API Key
                      {model.redirectToWebsite && model.websiteUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto h-6 px-2"
                          onClick={() => handleOpenWebsite(model.websiteUrl!)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit Website
                        </Button>
                      )}
                    </div>
                  </Label>
                  {model.redirectToWebsite ? (
                    <div className="text-sm text-muted-foreground italic">
                      {model.name} không cung cấp API key công khai. Vui lòng truy cập trang web chính thức để sử dụng.
                    </div>
                  ) : (
                    <Input
                      id={`api-key-${model.id}`}
                      type="password"
                      placeholder={`Enter your ${model.name} API key`}
                      value={apiKeys[model.id] || ""}
                      onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="author-name">Author Name</Label>
              <Input
                id="author-name"
                placeholder="Enter your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="n8n-api-url">N8N_API_URL</Label>
              <Input
                id="n8n-api-url"
                placeholder="Enter N8N API URL"
                value={n8nApiUrl}
                onChange={(e) => setN8nApiUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finetune-model-path">FINETUNE_MODEL_PATH</Label>
              <Input
                id="finetune-model-path"
                placeholder="Enter Fine-tune Model Path"
                value={finetuneModelPath}
                onChange={(e) => setFinetuneModelPath(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finetune-kb-path">FINETUNE_KB_PATH</Label>
              <Input
                id="finetune-kb-path"
                placeholder="Enter Fine-tune Knowledge Base Path"
                value={finetuneKbPath}
                onChange={(e) => setFinetuneKbPath(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
