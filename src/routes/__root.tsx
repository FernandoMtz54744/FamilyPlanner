import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { useAuth } from '@/providers/AuthProvider'

type AuthContext = ReturnType<typeof useAuth>

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})