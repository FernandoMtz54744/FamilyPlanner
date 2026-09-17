import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { deleteEvent } from '@/services/event.service'

export function useDeleteEvent() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (eventId: string) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            await deleteEvent(eventId)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user-events', user?.uid],
            })

            queryClient.invalidateQueries({
                queryKey: ['family-events'],
            })
        },
    })
}