import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth } from "@/providers/AuthProvider"
import { logout } from "@/services/auth.service";
import { Link } from "@tanstack/react-router";
import { Calendar, Contact, LogOut, UserGroup } from 'lucide-react'

const items = [
  { title: 'Plan Familiar', url: '/planner', icon: UserGroup },
  { title: 'Mi semana', url: '/my-week', icon: Calendar },
  { title: 'Mis horarios', url: '/my-schedule', icon: Contact },
]

export function AppSidebar() {

  const { user } = useAuth();

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Sidebar>

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <img src={user?.photoURL ?? ''} alt={user?.displayName ?? 'Usuario'} className="h-9 w-9 rounded-full"/>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {user?.displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Opciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  }>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión" className="hover:cursor-pointer">
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
      </SidebarFooter>

    </Sidebar>
  )
}