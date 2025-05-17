import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown className={cn("prose dark:prose-invert prose-sm max-w-none", className)}>{content}</ReactMarkdown>
  )
}
