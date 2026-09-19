import Loading from '@/components/spinner/Loading';
import { useFamilyPlanner } from '@/hooks/useFamilyPlanner';
import { generateScheduleEvents, generateVacationEvents } from '@/lib/utils';
import Calendar from '@/pages/calendar/Calendar';
import type { SchedulerEvent, SchedulerEventColor } from '@mui/x-scheduler/models';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/_app/planner')({
  component: Planner,
})

function Planner() {
  const { users, events, vacations, isLoading, isError } = useFamilyPlanner();
  const [visibleDate, setVisibleDate] = useState(() => new Date())
  
  const resources = users.map((user) => ({
    id: user.id,
    title: user.displayName,
    eventColor: user?.color as SchedulerEventColor
  }))

  const eventosReales: SchedulerEvent[] = events.map((event) => ({
    id: event.id!,
    title: event.title,
    start: event.start,
    end: event.end,
    resource: event.userId,
    readOnly: true
  }));

  const eventosHorario = generateScheduleEvents(users,visibleDate, vacations);
  const eventosVacaciones = generateVacationEvents(vacations, visibleDate);
  
  const eventos = [...eventosHorario, ...eventosReales, ...eventosVacaciones,];


  if (isLoading) {
    return <Loading texto='Cargando eventos'/>
  }

  if (isError) {
    return <div>Error al cargar el calendario</div>
  }



  return (
    <Calendar 
      eventos={eventos} 
      resources={resources}
      visibleDate={visibleDate} 
      onVisibleDateChange={setVisibleDate}
      readonly={true}
      />
  )
}