import type { AIModel } from "@/lib/types"
import { Bot, BrainCircuit, Sparkles, MessageSquare, Cpu, Zap, Github, Code, Globe } from "lucide-react"

export const defaultModels: AIModel[] = [
  {
    id: "general",
    name: "General API Chatbox",
    description: "AIMLAPI for general chat and completions",
    icon: MessageSquare,
    apiKeyName: "AIMLAPI_API_KEY",
    websiteUrl: "https://aimlapi.com/",
  },
  {
    id: "openai",
    name: "ChatGPT",
    description: "OpenAI's GPT models for general purpose chat and content generation",
    icon: Sparkles,
    apiKeyName: "OPENAI_API_KEY",
    websiteUrl: "https://openai.com/chatgpt",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google's Gemini models for multimodal understanding",
    icon: BrainCircuit,
    apiKeyName: "GEMINI_API_KEY",
    websiteUrl: "https://gemini.google.com/",
  },
  {
    id: "grok",
    name: "Grok",
    description: "xAI's Grok model for conversational AI",
    icon: Zap,
    apiKeyName: "GROK_API_KEY",
    websiteUrl: "https://grok.com/chat",
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    description: "Vercel's v0 model for code and content generation",
    icon: Bot,
    apiKeyName: "V0_API_KEY",
    websiteUrl: "https://v0.dev/",
    redirectToWebsite: true, // Chỉ định rằng nên chuyển hướng đến trang web
  },
  {
    id: "claude",
    name: "Claude AI",
    description: "Anthropic's Claude models for helpful, harmless, and honest AI",
    icon: MessageSquare,
    apiKeyName: "CLAUDE_API_KEY",
    websiteUrl: "https://claude.ai/",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek's language models for various tasks",
    icon: Cpu,
    apiKeyName: "DEEPSEEK_API_KEY",
    websiteUrl: "https://chat.deepseek.com/",
  },
  {
    id: "copilot",
    name: "Copilot",
    description: "GitHub's Copilot for code assistance",
    icon: Github,
    apiKeyName: "COPILOT_API_KEY",
    websiteUrl: "https://copilot.microsoft.com/",
    redirectToWebsite: true, // Chỉ định rằng nên chuyển hướng đến trang web
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Cursor AI code editor capabilities",
    icon: Code,
    apiKeyName: "CURSOR_API_KEY",
    websiteUrl: "https://www.cursor.com/",
    redirectToWebsite: true, // Chỉ định rằng nên chuyển hướng đến trang web
  },
  {
    id: "domain",
    name: "Domain-based API Chatbox",
    description: "N8N webhook URL for domain-specific tasks",
    icon: Globe,
    apiKeyName: "N8N_API_URL",
    websiteUrl: "",
  },
  {
    id: "aimlapi",
    name: "AIMLAPI",
    description: "AIMLAPI for general chat and completions",
    icon: Sparkles,
    apiKeyName: "AIMLAPI_API_KEY",
    websiteUrl: "https://aimlapi.com/",
  },
]
