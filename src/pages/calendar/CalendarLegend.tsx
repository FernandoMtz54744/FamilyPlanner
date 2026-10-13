import type { Usuario } from '@/services/user.service'
import type { SchedulerEventColor } from '@mui/x-scheduler/models'

interface Props {
  usuarios: Usuario[]
}

const colores: Record<SchedulerEventColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  lime: 'bg-lime-500',
  green: 'bg-green-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  grey: 'bg-gray-500',
}

const esColorValido = (
  color: string
): color is SchedulerEventColor => color in colores

export default function CalendarLegend({ usuarios }: Props) {
  return (
    <div className="mb-4 rounded-xl border bg-card px-4 py-4 shadow-sm">
      <div className="mb-3 text-center">
        <h3 className="text-base font-semibold tracking-tight">
          Tu family
        </h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center gap-2 rounded-full border bg-background px-3 py-2 transition-colors hover:bg-accent/50"
          >
            <span
              className={`size-4 shrink-0 rounded-full ${
                esColorValido(usuario.color)
                  ? colores[usuario.color]
                  : 'bg-gray-500'
              }`}
            />

            <span className="text-sm font-medium">
              {usuario.displayName?.trim().split(/\s+/)[0] || 'Usuario'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}