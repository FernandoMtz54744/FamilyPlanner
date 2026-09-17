import type { Horario } from "@/services/schedule.service"
import type { Usuario } from "@/services/user.service"
import type { Vacation } from "@/services/vacation.service"
import type { SchedulerEvent } from "@mui/x-scheduler/models"
import { addDays, format, isAfter, isBefore, parseISO, startOfWeek } from 'date-fns'

export { cn } from "cn"

// Convertir el horario habitual a evento
export function generateScheduleEvents(users: Usuario[], visibleDate: Date, vacations: Vacation[] = []): SchedulerEvent[] {
  const dias: (keyof Horario)[] = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']
  const inicioSemana = startOfWeek(visibleDate, {
    weekStartsOn: 1,
  })

  const events: SchedulerEvent[] = []
  users.forEach((user) => {
    if (!user.horario) {
      return
    }

    dias.forEach((dia, index) => {
      const horario = user.horario![dia]

      if (horario.descanso) {
        return
      }

      if (!horario.entrada || !horario.salida) {
        return
      }

      const fecha = addDays(inicioSemana, index)
      const fechaString = format(fecha,'yyyy-MM-dd')

      // Se verifica si el usuario está de vacaciones
      const estaDeVacaciones = vacations.some((vacation) =>
          vacation.userId === user.id &&
          fechaString >= vacation.startDate &&
          fechaString <= vacation.endDate,
      )

      // Si está de vacaciones, no se genera el horario
      if (estaDeVacaciones) {
        return
      }

      events.push({
        id: `schedule-${user.id}-${fechaString}`,
        title: `${user.displayName} trabajo`,
        start: `${fechaString}T${horario.entrada}:00`,
        end: `${fechaString}T${horario.salida}:00`,
        resource: user.id,
        readOnly: true,
      })
    })
  })

  return events
}

//Generar las vaciones
export function generateVacationEvents(vacations: Vacation[], visibleDate: Date): SchedulerEvent[] {
  const inicioSemana = startOfWeek(visibleDate, {
    weekStartsOn: 1,
  })

  const finSemana = addDays(inicioSemana, 6)

  return vacations.flatMap((vacation) => {
    const inicioVacaciones = parseISO(vacation.startDate)
    const finVacaciones = parseISO(vacation.endDate)

    if (isAfter(inicioVacaciones, finSemana) || isBefore(finVacaciones, inicioSemana)) {
      return []
    }

    const inicio = inicioVacaciones < inicioSemana ? inicioSemana : inicioVacaciones
    const fin = finVacaciones > finSemana ? finSemana : finVacaciones
    
    return [{
        id: `vacation-${vacation.id}`,
        title: 'Vacaciones',
        start: format(inicio, 'yyyy-MM-dd'),
        end: format(fin, 'yyyy-MM-dd'),
        resource: vacation.userId,
        readOnly: true,
        allDay: true,
      }
    ]
  })
}