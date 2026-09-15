import SidebarLayout from '@/components/sidebar/SidebarLayout'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => 
    <SidebarLayout>
      <div className='p-5'>
        <Outlet/>
      </div>
    </SidebarLayout>,
})