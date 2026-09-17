import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getSchedule } from '@/services/schedule.service'
import { getUserEvents } from '@/services/event.service'

export function useMyWeek() {
    const { user } = useAuth()

    const userId = user?.uid

    const scheduleQuery = useQuery({
        queryKey: ['schedule', userId],
        queryFn: () => getSchedule(userId!),
        enabled: !!userId,
    })

    const eventsQuery = useQuery({
        queryKey: ['user-events', userId],
        queryFn: () => getUserEvents(userId!),
        enabled: !!userId,
    })

    return {
        schedule: scheduleQuery.data,
        events: eventsQuery.data ?? [],
        isLoading: scheduleQuery.isLoading || eventsQuery.isLoading,
        isError: scheduleQuery.isError || eventsQuery.isError,
        error: scheduleQuery.error ?? eventsQuery.error,
    }
}