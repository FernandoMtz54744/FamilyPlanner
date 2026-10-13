import EventDialogGeneralTab from '@/components/calendar/EventDialogGeneralTab'
import { EventCalendar } from '@mui/x-scheduler/event-calendar'
import type { SchedulerEvent, SchedulerEventColor, SchedulerResource } from '@mui/x-scheduler/models'
import { es } from 'date-fns/locale'
import CalendarLegend from './CalendarLegend'
import type { Usuario } from '@/services/user.service'

interface Props {
  eventos: SchedulerEvent[],
  resources: SchedulerResource[],
  visibleDate: Date,
  usuarios?: Usuario[],
  onVisibleDateChange: (date: Date) => void,
  readonly: boolean,
  onEventsChange?: (events: SchedulerEvent[]) => void,
};

const colores: Record<SchedulerEventColor, string> = {
  red: '#ef4444',
  pink: '#ec4899',
  purple: '#a855f7',
  indigo: '#6366f1',
  blue: '#3b82f6',
  teal: '#14b8a6',
  green: '#22c55e',
  lime: '#84cc16',
  amber: '#f59e0b',
  orange: '#f97316',
  grey: '#6b7280',
}

function estilosBordeEventos(){
  return Object.fromEntries(
    Object.entries(colores).map(([color, valor]) => [
      `& .MuiEventCalendar-timeGridEvent[data-palette="${color}"]`, {
        border: `1px solid ${valor}`,
        boxSizing: 'border-box',
      }
    ])
  )
}

export default function Calendar({ eventos, resources, visibleDate, usuarios, onVisibleDateChange, readonly, onEventsChange }: Props) {

  return (
    <div className="w-full h-[85vh]">
      {usuarios && <CalendarLegend usuarios={usuarios} />}
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

        sx={{
          ...estilosBordeEventos(),
          '& .MuiEventCalendar-dayTimeGridColumn': {
            borderRight: '1px solid #d1d5db',
          },
          '& .MuiEventCalendar-dayTimeGridHeaderCell': {
            borderRight: '1px solid #d1d5db',
            borderBottom: '1px solid #d1d5db',
          },
        }}
      />
    </div>
  )
}
