import Calendar from '@/pages/calendar/Calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/planner')({
  component: Planner,
})

function Planner() {
  
    const resources = [
  {
    id: 'fer',
    title: 'Fernando',
    eventColor: 'blue'
  },
  {
    id: 'liz',
    title: 'Lizbeth',
    eventColor: 'pink'
  },
  {
    id: 'javis',
    title: 'Javier',
    eventColor: 'green',
  },
  {
    id: 'olga',
    title: 'Olga',
    eventColor: 'orange',
  }
]

const eventos: SchedulerEvent[] = [
  {
    id: 1,
    title: 'Liz Reforma',
    start: '2026-09-14T07:00:00',
    end: '2026-09-14T13:00:00',
    resource: 'liz',
  },
  {
    id: 2,
    title: 'Liz Culhuacan',
    start: '2026-09-14T13:00:00',
    end: '2026-09-14T19:00:00',
    resource: 'liz',
  },
  {
    id: 3,
    title: 'Javier',
    start: '2026-09-14T15:30:00',
    end: '2026-09-14T23:00:00',
    resource: 'javis',
  },
  {
    id: 4,
    title: 'Fer',
    start: '2026-09-14T08:30:00',
    end: '2026-09-14T16:30:00',
    resource: 'fer',
  },
   {
    id: 5,
    title: 'Tiempo extra',
    start: '2026-09-14T08:00:00',
    end: '2026-09-14T15:30:00',
    resource: 'javis',
  },
  {
    id: 6,
    title: 'Liz Reforma',
    start: '2026-09-15T07:00:00',
    end: '2026-09-15T13:00:00',
    resource: 'liz',
  },
  {
    id: 7,
    title: 'Liz Culhuacan',
    start: '2026-09-15T13:00:00',
    end: '2026-09-15T19:00:00',
    resource: 'liz',
  },
  {
    id: 8,
    title: 'Javier',
    start: '2026-09-15T15:30:00',
    end: '2026-09-15T23:00:00',
    resource: 'javis',
  },
  {
    id: 9,
    title: 'Fer',
    start: '2026-09-15T08:30:00',
    end: '2026-09-15T16:30:00',
    resource: 'fer',
  },
   {
    id: 10,
    title: 'Tiempo extra',
    start: '2026-09-15T08:00:00',
    end: '2026-09-15T15:30:00',
    resource: 'javis',
  },
]
  return (
    <Calendar eventos={eventos} resources={resources}/>
  )
}