import { createFileRoute } from '@tanstack/react-router'
import Calendar from '../pages/calendar/Calendar'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <>
    <div>index</div>
  </>
}