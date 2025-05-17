import { ChatInterface } from "@/components/chat-interface"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function Home() {
  return (
    <SidebarProvider>
      <main className="flex min-h-screen flex-col">
        <ChatInterface />
      </main>
    </SidebarProvider>
  )
}
