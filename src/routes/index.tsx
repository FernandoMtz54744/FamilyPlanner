import { createFileRoute } from '@tanstack/react-router'
import Calendar from '../pages/calendar/Calendar'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <>
    <div className=" bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Family Planner
      </h1>
    </div>
    <Calendar/>
  </>
}