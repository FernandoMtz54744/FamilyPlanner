import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { SchedulerEvent } from '@mui/x-scheduler/models'

import Loading from '@/components/spinner/Loading'
import Calendar from '@/pages/calendar/Calendar'

import { useAuth } from '@/providers/AuthProvider'
import { useMyWeek } from '@/hooks/useMyWeek'

import {
  generateScheduleEvents,
  generateVacationEvents,
} from '@/lib/utils'

import { useCreateEvent } from '@/hooks/events/useCreateEvent'
import { useDeleteEvent } from '@/hooks/events/useDeleteEvent'
import { useUpdateEvent } from '@/hooks/events/useUpdateEvent'

import { useVacations } from '@/hooks/vacations/useVacations'
import { useCreateVacation } from '@/hooks/vacations/useCreateVacation'
import { useUpdateVacation } from '@/hooks/vacations/useUpdateVacation'
import { useDeleteVacation } from '@/hooks/vacations/useDeleteVacation'

import type { Vacation } from '@/services/vacation.service'

export const Route = createFileRoute('/_app/my-week')({
  component: MyWeek,
})

function MyWeek() {
  const { user } = useAuth()

  const {
    schedule,
    events,
    isLoading,
    isError,
  } = useMyWeek()

  const {
    vacations,
    isLoading: isVacationsLoading,
    isError: isVacationsError,
  } = useVacations()

  const createEventMutation = useCreateEvent()
  const deleteEventMutation = useDeleteEvent()
  const updateEventMutation = useUpdateEvent()

  const createVacationMutation = useCreateVacation()
  const updateVacationMutation = useUpdateVacation()
  const deleteVacationMutation = useDeleteVacation()

  const [visibleDate, setVisibleDate] = useState(
    () => new Date(),
  )

  const [calendarEvents, setCalendarEvents] = useState<
    SchedulerEvent[]
  >([])

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [editingVacationId, setEditingVacationId] =
    useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    const currentUser = {
      id: user.uid,
      displayName: user.displayName ?? 'Yo',
      horario: schedule ?? undefined,
    }

    const eventosHorario = generateScheduleEvents(
      [currentUser],
      visibleDate,
      vacations,
    )

    const eventosVacaciones = generateVacationEvents(
      vacations,
      visibleDate,
    )

    const eventosReales: SchedulerEvent[] = events.map(
      (event) => ({
        id: event.id!,
        title: event.title,
        start: event.start,
        end: event.end,
        resource: event.userId,
      }),
    )

    setCalendarEvents([
      ...eventosHorario,
      ...eventosReales,
      ...eventosVacaciones,
    ])
  }, [user, schedule, vacations, visibleDate])

  const handleEventsChange = (
    newEvents: SchedulerEvent[],
  ) => {
    setCalendarEvents(newEvents)

    const existingEvents = new Map(
      events.map((event) => [
        String(event.id),
        event,
      ]),
    )

    // 1. Evento nuevo
    const newEvent = newEvents.find(
      (event) =>
        !existingEvents.has(String(event.id)) &&
        !String(event.id).startsWith('schedule-') &&
        !String(event.id).startsWith('vacation-'),
    )

    if (newEvent) {
      createEventMutation.mutate({
        title: newEvent.title || 'Tiempo extra',
        start: String(newEvent.start),
        end: String(newEvent.end),
      })

      return
    }

    // 2. Evento eliminado
    const currentIds = new Set(
      newEvents.map((event) => String(event.id)),
    )

    const deletedEvent = events.find(
      (event) =>
        event.id &&
        !currentIds.has(String(event.id)),
    )

    if (deletedEvent?.id) {
      deleteEventMutation.mutate(deletedEvent.id)

      return
    }

    // 3. Evento editado
    const updatedEvent = newEvents.find((event) => {
      const existingEvent = existingEvents.get(
        String(event.id),
      )

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
      updateEventMutation.mutate({
        eventId: String(updatedEvent.id),
        title: updatedEvent.title || 'Tiempo extra',
        start: String(updatedEvent.start),
        end: String(updatedEvent.end),
      })
    }
  }

  const handleSaveVacation = () => {
    if (!startDate || !endDate) {
      return
    }

    if (startDate > endDate) {
      return
    }

    if (editingVacationId) {
      updateVacationMutation.mutate(
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
        },
      )

      return
    }

    createVacationMutation.mutate(
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

  const handleEditVacation = (
    vacation: Vacation,
  ) => {
    setEditingVacationId(vacation.id)
    setStartDate(vacation.startDate)
    setEndDate(vacation.endDate)
  }

  const handleCancelEdit = () => {
    setEditingVacationId(null)
    setStartDate('')
    setEndDate('')
  }

  if (isLoading || isVacationsLoading) {
    return <Loading texto="Cargando mi semana" />
  }

  if (isError || isVacationsError) {
    return (
      <div>
        Error al cargar tu semana
      </div>
    )
  }

  if (!user) {
    return null
  }

  const resources = [
    {
      id: user.uid,
      title: user.displayName ?? 'Yo',
    },
  ]

  const isSavingVacation =
    createVacationMutation.isPending ||
    updateVacationMutation.isPending

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
            <label
              htmlFor="vacation-start"
              className="text-sm font-medium"
            >
              Desde
            </label>

            <input
              id="vacation-start"
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="vacation-end"
              className="text-sm font-medium"
            >
              Hasta
            </label>

            <input
              id="vacation-end"
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveVacation}
            disabled={
              !startDate ||
              !endDate ||
              startDate > endDate ||
              isSavingVacation
            }
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
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
              className="rounded-md border px-4 py-2"
            >
              Cancelar
            </button>
          )}
        </div>

        {startDate &&
          endDate &&
          startDate > endDate && (
            <p className="mt-3 text-sm text-destructive">
              La fecha de inicio debe ser anterior o igual
              a la fecha de fin.
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
                <div
                  key={vacation.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <span className="text-sm">
                    {vacation.startDate}
                    {' → '}
                    {vacation.endDate}
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleEditVacation(vacation)
                      }
                      disabled={
                        deleteVacationMutation.isPending ||
                        isSavingVacation
                      }
                      className="rounded-md border px-3 py-1 text-sm"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteVacationMutation.mutate(
                          vacation.id,
                        )
                      }
                      disabled={
                        deleteVacationMutation.isPending
                      }
                      className="rounded-md border px-3 py-1 text-sm text-destructive"
                    >
                      {deleteVacationMutation.isPending
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
      />
    </div>
  )
}
