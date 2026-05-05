import { SidebarInset } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/routes/(root)/chats/Partials/ChatSidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </div>
  );
}