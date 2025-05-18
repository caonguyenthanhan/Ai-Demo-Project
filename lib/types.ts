import type { LucideIcon } from "lucide-react"

export interface AIModel {
  id: string
  name: string
  description: string
  icon: LucideIcon
  apiKeyName: string
  websiteUrl?: string
  redirectToWebsite?: boolean
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model?: string
}
