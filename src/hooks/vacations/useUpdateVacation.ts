import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { updateVacation } from '@/services/vacation.service'

export function useUpdateVacation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({vacationId, startDate, endDate}: {
      vacationId: string
      startDate: string
      endDate: string
    }) => {
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }

      await updateVacation(vacationId, {
        startDate,
        endDate,
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacations', user?.uid],
      })
    }
  })
}