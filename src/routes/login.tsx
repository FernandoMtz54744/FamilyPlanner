import { loginWithGoogle } from '@/services/auth/auth.service'
import { Button } from '@base-ui/react'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
})

const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle()

      console.log('Usuario:', user)
      console.log('UID:', user.uid)
      console.log('Nombre:', user.displayName)
      console.log('Email:', user.email)
      console.log('Foto:', user.photoURL)

    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form>
        <div>INICIAR SESIÓN</div>
        <Button onClick={handleGoogleLogin}>Iniciar con Google</Button>
      </form>
    </div>
  )
}