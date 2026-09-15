import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger className="hover:cursor-pointer"/>
        <span className="font-semibold">Family Planner</span>
      </header>
        {children}
      </main>
    </SidebarProvider>
  )
}