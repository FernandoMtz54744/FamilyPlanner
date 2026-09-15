import SidebarLayout from '@/components/sidebar/SidebarLayout'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login'
      })
    }
  }
})

function AppLayout() {
  return (
    <SidebarLayout>
      <div className='p-5'>
        <Outlet />
      </div>
    </SidebarLayout>
  )
}