import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getFamilyByUserId } from '@/services/family.service'
import { createEvent, type Event } from '@/services/event.service'

export function useCreateEvent() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ( event: Omit<Event, 'id' | 'familyId' | 'userId'>) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            const family = await getFamilyByUserId(user.uid)
            if (!family) {
                throw new Error('El usuario no pertenece a una familia')
            }

            return createEvent({
                ...event,
                familyId: family.id,
                userId: user.uid,
            })
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-events', user?.uid]})
            queryClient.invalidateQueries({ queryKey: ['family-events']})
        }
    })
}