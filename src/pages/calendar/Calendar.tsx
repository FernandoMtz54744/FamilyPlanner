import { EventCalendar } from '@mui/x-scheduler/event-calendar'
import type { SchedulerEvent } from '@mui/x-scheduler/models'
import { es } from 'date-fns/locale'

interface Props {
  eventos: SchedulerEvent[],
  resources: Object[]
};

export default function Calendar({ eventos, resources }: Props) {
  return (
    <div className="w-full h-[85vh]">
         <EventCalendar events={eventos} resources={resources}
          preferencesMenuConfig={false}
          dateLocale={es}
          defaultPreferences={{
            isSidePanelOpen: false,
            weekStartsOn: 1,
            ampm: true,
          }}
         />
    </div>
  )
}
