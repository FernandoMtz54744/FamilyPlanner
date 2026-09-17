import { useState } from 'react'
import { motion } from 'motion/react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { loginWithGoogle } from '@/services/auth.service'
import { House } from 'lucide-react'
import Google from '@/assets/Google.webp';

export const Route = createFileRoute('/login')({
  component: Login,
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  }
})


function CalendarCard({ className, delay = 0, rotate = 0,}: {className: string, delay?: number, rotate?: number}) {
  return (
    <motion.div className={`absolute w-36 rounded-xl border bg-card/40 p-3 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, scale: 0.8, rotate: rotate - 5}}
      animate={{ opacity: 1, scale: 1, rotate: rotate, y: [0, -10, 0]}}
      transition={{
        opacity: { duration: 0.8, delay },
        scale: { duration: 0.8, delay, type: 'spring', stiffness: 100 },
        rotate: { duration: 0.8, delay },
        y: { duration: 6, delay, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div className="flex items-center justify-between">
        <div className="h-2 w-12 rounded-full bg-primary/30" />
        <div className="size-2 rounded-full bg-primary/40" />
      </div>

      <div className="mt-3 space-y-2">
        <div className="h-2 w-full rounded-full bg-muted-foreground/10" />
        <div className="h-2 w-4/5 rounded-full bg-muted-foreground/10" />
        <div className="h-2 w-3/5 rounded-full bg-muted-foreground/10" />
      </div>

      <div className="mt-3 flex gap-1">
        <div className="h-1.5 w-6 rounded-full bg-primary/20" />
        <div className="h-1.5 w-8 rounded-full bg-primary/10" />
      </div>
    </motion.div>
  )
}

function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithGoogle()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Aurora superior */}
        <motion.div
          className="absolute -left-40 -top-40 size-125 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, 40, -20, 0], y: [0, 20, 50, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Aurora inferior */}
        <motion.div
          className="absolute -bottom-48 -right-40 size-125 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [0, -30, 20, 0], y: [0, -30, -10, 0], scale: [1, 0.95, 1.08, 1] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grid */}
        <motion.div className="absolute inset-0 opacity-[0.035]"
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: `
              linear-gradient(
                to right,
                currentColor 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                currentColor 1px,
                transparent 1px
              )
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Tarjeta izquierda */}
        <CalendarCard
          className="left-[7%] top-[18%] hidden lg:block"
          delay={0.3}
          rotate={-6}
        />

        {/* Tarjeta derecha */}
        <CalendarCard
          className="right-[7%] top-[25%] hidden lg:block"
          delay={0.5}
          rotate={5}
        />

        {/* Tarjeta inferior izquierda */}
        <CalendarCard
          className="bottom-[15%] left-[12%] hidden xl:block"
          delay={0.7}
          rotate={4}
        />

        {/* Tarjeta inferior derecha */}
        <CalendarCard
          className="bottom-[12%] right-[13%] hidden xl:block"
          delay={0.9}
          rotate={-4}
        />

        {/* Puntos flotantes */}
        <motion.div
          className="absolute left-[25%] top-[15%] size-2 rounded-full bg-primary/30"
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute right-[25%] top-[18%] size-3 rounded-full bg-primary/20"
          animate={{
            y: [0, 20, 0],
            x: [0, -10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute bottom-[22%] left-[25%] size-2 rounded-full bg-primary/25"
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Líneas decorativas */}
        <motion.div
          className="absolute left-0 top-[35%] h-px w-64 bg-gradient-to from-transparent via-primary/20 to-transparent"
          animate={{
            x: ['-20%', '120%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute right-0 bottom-[35%] h-px w-72 bg-gradient-to from-transparent via-primary/15 to-transparent"
          animate={{
            x: ['120%', '-20%'],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* LOGIN */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="rounded-2xl border bg-card/95 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10"
          whileHover={{ boxShadow: '0 25px 70px rgba(0,0,0,0.10)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <motion.div
              className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
              initial={{
                opacity: 0,
                scale: 0.6,
                rotate: -10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: 'spring',
                stiffness: 180,
                damping: 14,
              }}
              whileHover={{
                scale: 1.07,
                rotate: 3,
              }}
            >
            <House/>
            </motion.div>

            <motion.h1
              className="text-2xl font-semibold tracking-tight"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.35,
                duration: 0.4,
              }}
            >
              Family con Plan
            </motion.h1>

            <motion.p
              className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground"
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.45,
                duration: 0.4,
              }}
            >
              Aplicación para organizar los horarios familiares en un solo lugar
            </motion.p>
          </div>

          {/* Botón Google */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-3 text-sm font-medium shadow-sm hover:cursor-pointer"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
            <img src={Google} className='h-6 w-6'/>
              {isLoading
                ? 'Iniciando sesión...'
                : 'Continuar con Google'}
            </Button>
          </motion.div>

          {/* Separador visual */}
          <motion.div
            className="my-7 h-px bg-border"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          />

          {/* Texto inferior */}
          <motion.p
            className="text-center text-xs leading-5 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            Accede al calendario familiar y administra
            tus horarios desde un solo lugar.
          </motion.p>
        </motion.div>

        <motion.p
          className="mt-6 text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Family Planner
        </motion.p>
      </motion.div>
    </main>
  )
}