import EventDialogGeneralTab from '@/components/calendar/EventDialogGeneralTab'
import { EventCalendar } from '@mui/x-scheduler/event-calendar'
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models'
import { es } from 'date-fns/locale'

interface Props {
  eventos: SchedulerEvent[],
  resources: SchedulerResource[],
  visibleDate: Date,
  onVisibleDateChange: (date: Date) => void,
  readonly: boolean,
  onEventsChange?: (events: SchedulerEvent[]) => void,
};

export default function Calendar({ eventos, resources, visibleDate, onVisibleDateChange, readonly, onEventsChange }: Props) {

  return (
    <div className="w-full h-[85vh]">
      <EventCalendar 
        events={eventos}
        resources={resources}
        preferencesMenuConfig={false}
        dateLocale={es}
        visibleDate={visibleDate}
        onVisibleDateChange={onVisibleDateChange}
        defaultView="week"
        readOnly={readonly}
        
        viewConfig={{
          week:{ initialScrollTime: 7 },
          day:{ initialScrollTime: 7 }
        }}
        
        defaultPreferences={{
          isSidePanelOpen: false,
          weekStartsOn: 1,
          ampm: true,
        }}
        
        eventCreation={{
          duration: 60,
          interaction: 'click'
        }}

        slots={{
          eventDialogGeneralTab: EventDialogGeneralTab
        }}

        onEventsChange={onEventsChange ?? (() => {})}
      />
    </div>
  )
}
