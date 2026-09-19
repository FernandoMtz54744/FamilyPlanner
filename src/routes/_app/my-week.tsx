import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { SchedulerEvent, SchedulerEventColor } from '@mui/x-scheduler/models'
import Loading from '@/components/spinner/Loading'
import Calendar from '@/pages/calendar/Calendar'
import { useAuth } from '@/providers/AuthProvider'
import { useMyWeek } from '@/hooks/useMyWeek'
import { generateScheduleEvents, generateVacationEvents} from '@/lib/utils'
import { useVacations } from '@/hooks/vacations/useVacations'
import { useVacationMutations } from '@/hooks/vacations/useVacationMutations'
import type { Vacation } from '@/services/vacation.service'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useEventMutations } from '@/hooks/useEventMutations'
import ErrorPage from '@/components/error/ErrorPage'

export const Route = createFileRoute('/_app/my-week')({
  component: MyWeek,
})

function MyWeek() {
  const { user } = useAuth()
  const { schedule, events, isLoading: isLoadingSchedule, isError: isScheduleError } = useMyWeek()
  const { profile } = useUserProfile();
  
  const { create: createEvent, update: updateEvent, remove: deleteEvent } = useEventMutations();
  const { create: createVacation, update: updateVacation, remove: deleteVacation } = useVacationMutations();
  const { vacations, isLoading: isVacationsLoading, isError: isVacationsError } = useVacations()

  const [visibleDate, setVisibleDate] = useState(() => new Date())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [editingVacationId, setEditingVacationId] = useState<string | null>(null)

  const calendarEvents = useMemo(() => {
    if (!user) {
      return []
    }

    const currentUser = {
      id: user.uid,
      displayName: user.displayName ?? 'Yo',
      horario: schedule ?? undefined,
      color: '',
    }

    const eventosHorario = generateScheduleEvents([currentUser], visibleDate, vacations)
    const eventosVacaciones = generateVacationEvents(vacations, visibleDate)
    const eventosReales: SchedulerEvent[] = events.map((event) => ({
      id: event.id!,
      title: event.title,
      start: event.start,
      end: event.end,
      resource: event.userId,
    }))

    return [...eventosHorario, ...eventosReales, ...eventosVacaciones]
  }, [user, schedule, events, vacations, visibleDate])

  const handleEventsChange = (newEvents: SchedulerEvent[]) => {
    console.log('handleEvent');
    
    const existingEvents = new Map(events.map((event) => [String(event.id), event ]))
    // Evento nuevo
    const newEvent = newEvents.find((event) =>
      !existingEvents.has(String(event.id)) &&
      !String(event.id).startsWith('schedule-') &&
      !String(event.id).startsWith('vacation-'),
    )

    if (newEvent) {
      createEvent.mutate({
        title: newEvent.title || 'Tiempo extra',
        start: String(newEvent.start),
        end: String(newEvent.end),
      })

      return
    }

    // Evento eliminado
    const currentIds = new Set(newEvents.map((event) => String(event.id)))
    const deletedEvent = events.find((event) => event.id && !currentIds.has(String(event.id)))
    if (deletedEvent?.id) {
      deleteEvent.mutate(deletedEvent.id)
      return
    }

    // Evento editado
    const updatedEvent = newEvents.find((event) => {
      const existingEvent = existingEvents.get(String(event.id))

      if (!existingEvent) {
        return false
      }

      return (
        existingEvent.title !== event.title ||
        existingEvent.start !== String(event.start) ||
        existingEvent.end !== String(event.end)
      )
    })

    if (updatedEvent) {
      updateEvent.mutate({
        eventId: String(updatedEvent.id),
        title: updatedEvent.title || 'Tiempo extra',
        start: String(updatedEvent.start),
        end: String(updatedEvent.end),
      })
    }
  }

  const handleSaveVacation = () => {
    if (!startDate || !endDate || startDate > endDate) {
      return
    }

    if (editingVacationId) {
      updateVacation.mutate(
        {
          vacationId: editingVacationId,
          startDate,
          endDate,
        },
        {
          onSuccess: () => {
            setEditingVacationId(null)
            setStartDate('')
            setEndDate('')
          },
        }
      )

      return
    }

    createVacation.mutate(
      {
        startDate,
        endDate,
      },
      {
        onSuccess: () => {
          setStartDate('')
          setEndDate('')
        },
      },
    )
  }

  const handleEditVacation = (vacation: Vacation) => {
    setEditingVacationId(vacation.id)
    setStartDate(vacation.startDate)
    setEndDate(vacation.endDate)
  }

  const handleCancelEdit = () => {
    setEditingVacationId(null)
    setStartDate('')
    setEndDate('')
  }

  if (isLoadingSchedule || isVacationsLoading) {
    return <Loading texto="Cargando mi semana" />
  }

  if(createEvent.isPending || updateEvent.isPending){
    return <Loading texto='Modificando semana'/>
  }

  if (isScheduleError || isVacationsError) {
    return <ErrorPage text='Ocurrió un error al cargar la información'/>
  }

  if (!user) {
    return null
  }

  const resources = [{
    id: user.uid,
    title: user.displayName ?? 'Yo',
    eventColor: profile?.color as SchedulerEventColor
  }]

  const isSavingVacation = createVacation.isPending || updateVacation.isPending

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">
          {editingVacationId
            ? 'Editar vacaciones'
            : 'Agregar vacaciones'}
        </h2>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="vacation-start" className="text-sm font-medium">
              Desde
            </label>

            <input
              id="vacation-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border px-3 py-2 hover:cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="vacation-end" className="text-sm font-medium">
              Hasta
            </label>

            <input
              id="vacation-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border px-3 py-2 hover:cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveVacation}
            disabled={ !startDate || !endDate || startDate > endDate || isSavingVacation}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50 hover:cursor-pointer"
          >
            {isSavingVacation
              ? 'Guardando...'
              : editingVacationId
                ? 'Guardar cambios'
                : 'Guardar vacaciones'}
          </button>

          {editingVacationId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md border px-4 py-2 hover:cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        {startDate && endDate && startDate > endDate && (
            <p className="mt-3 text-sm text-destructive">
              La fecha de inicio debe ser anterior o igual a la fecha de fin.
            </p>
          )}

        <div className="mt-6">
          <h3 className="mb-3 font-medium">
            Mis vacaciones
          </h3>

          {vacations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tienes vacaciones registradas.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {vacations.map((vacation) => (
                <div key={vacation.id} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">
                    {format(parseISO(vacation.startDate), "EEEE d 'de' MMMM 'del' yyyy", { locale: es })}
                    {' → '}
                    {format(parseISO(vacation.endDate), "EEEE d 'de' MMMM 'del' yyyy", { locale: es })}
                  </span>

                  <div className="flex gap-2">
                    <button type="button"
                      onClick={() => handleEditVacation(vacation)}
                      disabled={deleteVacation.isPending || isSavingVacation}
                      className="rounded-md border px-3 py-1 text-sm hover:cursor-pointer">
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteVacation.mutate(vacation.id)}
                      disabled={ deleteVacation.isPending}
                      className="rounded-md border px-3 py-1 text-sm text-destructive hover:cursor-pointer">
                      {deleteVacation.isPending
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Calendar
        eventos={calendarEvents}
        resources={resources}
        visibleDate={visibleDate}
        onVisibleDateChange={setVisibleDate}
        onEventsChange={handleEventsChange}
        readonly = {false}
      />
    </div>
  )
}
