import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getFamilyByUserId } from '@/services/family.service'
import { createEvent, deleteEvent, updateEvent, type Event } from '@/services/event.service'

export function useEventMutations() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const invalidateEvents = () => {
        queryClient.invalidateQueries({ queryKey: ['user-events', user?.uid] })
        queryClient.invalidateQueries({ queryKey: ['family-events'] })
    }

    const create = useMutation({
        mutationFn: async (event: Omit<Event, 'id' | 'familyId' | 'userId'>) => {
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

        onSuccess: invalidateEvents,
    })

    const update = useMutation({
        mutationFn: async ({ eventId, title,start, end }: { eventId: string, title: string, start: string, end: string }) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            return updateEvent(eventId, {
                title,
                start,
                end
            })
        },

        onSuccess: invalidateEvents,
    })

    const remove = useMutation({
        mutationFn: async (eventId: string) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            return deleteEvent(eventId)
        },
        onSuccess: invalidateEvents,
    })

    return {
        create,
        update,
        remove,
    }
}