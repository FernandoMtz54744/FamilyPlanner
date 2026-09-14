import FullCalendar, { type EventSourceInput } from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import timeGridPlugin from '@fullcalendar/react/timegrid'

// stylesheets
import '@fullcalendar/react/skeleton.css'; // ALWAYS NEED SKELETON
import '@fullcalendar/react/themes/monarch/theme.css'; // YOUR THEME
import '@fullcalendar/react/themes/monarch/palettes/purple.css'; // YOUR THEME'S PALETTE

const eventos: EventSourceInput = [
             {
                title: "Test1",
                start: "2026-09-13T13:00:00",
                end: "2026-09-13T19:00:00",
            },
            {
            title: "Test2",
            start: "2026-09-13T08:00:00",
            end: "2026-09-13T16:30:00",
            },
            {
            title: "Evento 3",
            start: "2026-09-13T09:00:00",
            end: "2026-09-13T16:30:00",
            },
            {
            title: "Evento 4",
            start: "2026-09-13T09:00:00",
            end: "2026-09-13T16:30:00",
            },
        ];

export default function Calendar() {
  return (
    <div className="px-24 w-full">
        <FullCalendar
        plugins={[themePlugin, timeGridPlugin]}
         headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="timeGridWeek"
        slotDuration="01:00:00"
        events={eventos}
        height="80vh"
      />
    </div>
  )
}
