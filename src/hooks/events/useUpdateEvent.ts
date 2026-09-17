import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { updateEvent } from '@/services/event.service'

export function useUpdateEvent() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({eventId, title, start, end}: {eventId: string, title: string, start: string, end: string}) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            await updateEvent(eventId, {title, start, end});
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user-events', user?.uid]})
            queryClient.invalidateQueries({queryKey: ['family-events']})
        }
    })
}