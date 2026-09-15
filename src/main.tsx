import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router'
import './index.css'
import { AuthProvider, useAuth } from './providers/AuthProvider'


function AppRouter() {
  const auth = useAuth()

  useEffect(() => {
    if(!auth.loading) {
      router.invalidate()
    }
  }, [auth.loading, auth.isAuthenticated])

  if (auth.loading) {
    return <div>Cargando...</div>
  }

  return (
    <RouterProvider router={router} context={{ auth }}/>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <AppRouter/>
     </AuthProvider>
  </StrictMode>,
)