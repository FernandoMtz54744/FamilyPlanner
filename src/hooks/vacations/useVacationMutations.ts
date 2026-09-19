import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getFamilyByUserId } from '@/services/family.service'
import { createVacation, deleteVacation,updateVacation, type Vacation } from '@/services/vacation.service'

export function useVacationMutations() {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const invalidateVacations = () => {
        queryClient.invalidateQueries({
            queryKey: ['vacations', user?.uid],
        })
    }

    const create = useMutation({
        mutationFn: async (
            vacation: Omit<Vacation, 'id' | 'userId' | 'familyId'>
        ) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            const family = await getFamilyByUserId(user.uid)

            if (!family) {
                throw new Error('El usuario no pertenece a una familia')
            }

            return createVacation({
                ...vacation,
                userId: user.uid,
                familyId: family.id,
            })
        },

        onSuccess: invalidateVacations,
    })

    const update = useMutation({
        mutationFn: async ({ vacationId, startDate, endDate }: { vacationId: string, startDate: string, endDate: string}) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            return updateVacation(vacationId, {
                startDate,
                endDate,
            })
        },

        onSuccess: invalidateVacations,
    })

    const remove = useMutation({
        mutationFn: async (vacationId: string) => {
            if (!user) {
                throw new Error('No hay usuario autenticado')
            }

            return deleteVacation(vacationId)
        },

        onSuccess: invalidateVacations,
    })

    return {
        create,
        update,
        remove
    }
}