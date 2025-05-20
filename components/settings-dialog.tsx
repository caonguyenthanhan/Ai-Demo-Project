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
import { ExternalLink, Download } from "lucide-react"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

const KNOWLEDGE_BASE_URL = "https://drive.google.com/uc?export=download&id=1s9hiyVUjmfBC3L_vJZAUzQolvWW4iGGW";

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [authorName, setAuthorName] = useState("Your Name")
  const [finetuneModelPath, setFinetuneModelPath] = useState("")
  const [finetuneKbPath, setFinetuneKbPath] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)

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
      const savedFinetuneModelPath = localStorage.getItem("FINETUNE_MODEL_PATH")
      if (savedFinetuneModelPath) setFinetuneModelPath(savedFinetuneModelPath)
      const savedFinetuneKbPath = localStorage.getItem("FINETUNE_KB_PATH")
      if (savedFinetuneKbPath) setFinetuneKbPath(savedFinetuneKbPath)
    }
  }, [isOpen])

  const handleSaveSettings = async () => {
    saveAllApiKeys(apiKeys)
    localStorage.setItem("ai_models_chatbox_author_name", authorName)
    localStorage.setItem("FINETUNE_MODEL_PATH", finetuneModelPath)
    localStorage.setItem("FINETUNE_KB_PATH", finetuneKbPath)

    // Gửi từng API key lên backend để lưu vào .env.local
    for (const [model, apiKey] of Object.entries(apiKeys)) {
      if (apiKey) {
        await fetch("/api/save-api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, apiKey })
        })
      }
    }

    toast({
      title: "Settings saved",
      description: "Your API keys and preferences have been saved successfully.",
    })
    onClose()
  }

  const handleDownloadModels = async () => {
    try {
      setIsDownloading(true);
      // Gọi API mới để tải knowledge_base.csv từ Google Drive
      const response = await fetch("/api/download-knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to download knowledge base");
      }
      setFinetuneKbPath("./models/knowledge_base.csv");
      toast({
        title: "Knowledge base downloaded",
        description: "File knowledge_base.csv đã được tải thành công.",
      });
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
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
              {defaultModels.filter(model => !model.redirectToWebsite && model.apiKeyName).map((model) => (
                <div key={model.id} className="space-y-2">
                  <Label htmlFor={`api-key-${model.id}`}>
                    <div className="flex items-center">
                      <model.icon className="h-4 w-4 mr-2" />
                      {model.name}
                      {model.websiteUrl && (
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
                  <Input
                    id={`api-key-${model.id}`}
                    type="password"
                    placeholder={`Enter your ${model.name}`}
                    value={apiKeys[model.id] || ""}
                    onChange={(e) => handleApiKeyChange(model.id, e.target.value)}
                  />
                </div>
              ))}

              {/* Fine-tuned Model Path */}
              <div className="space-y-2">
                <Label htmlFor="finetune-model-path">Fine-tuned Model Path</Label>
                <Input
                  id="finetune-model-path"
                  placeholder="./phobert-finetuned-viquad2"
                  value={finetuneModelPath}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Path to the fine-tuned model</p>
              </div>

              {/* Knowledge Base Path */}
              <div className="space-y-2">
                <Label htmlFor="finetune-kb-path">Knowledge Base Path</Label>
                <Input
                  id="finetune-kb-path"
                  placeholder="./models/knowledge_base.csv"
                  value={finetuneKbPath}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Path to the knowledge base file</p>
              </div>

              {/* HF_TOKEN */}
              <div className="space-y-2">
                <Label htmlFor="hf-token">HF_TOKEN</Label>
                <Input
                  id="hf-token"
                  placeholder="Enter your HF_TOKEN"
                  value={apiKeys["HF_TOKEN"] || ""}
                  onChange={(e) => handleApiKeyChange("HF_TOKEN", e.target.value)}
                />
              </div>

              {/* HF_MODEL_ID */}
              <div className="space-y-2">
                <Label htmlFor="hf-model-id">HF_MODEL_ID</Label>
                <Input
                  id="hf-model-id"
                  placeholder="An-CNT/phobert-finetuned-viquad2"
                  value={apiKeys["HF_MODEL_ID"] || "An-CNT/phobert-finetuned-viquad2"}
                  disabled
                />
              </div>

              {/* FINETUNE_KB_PATH */}
              <div className="space-y-2">
                <Label htmlFor="finetune-kb-path">FINETUNE_KB_PATH</Label>
                <Input
                  id="finetune-kb-path"
                  placeholder="./models/knowledge_base.csv"
                  value={apiKeys["FINETUNE_KB_PATH"] || "./models/knowledge_base.csv"}
                  disabled
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleDownloadModels}
                disabled={isDownloading}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download Models"}
              </Button>
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
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
