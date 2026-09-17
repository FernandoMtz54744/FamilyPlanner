import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { deleteVacation } from '@/services/vacation.service'

export function useDeleteVacation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vacationId: string) => {
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }

      await deleteVacation(vacationId)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacations', user?.uid],
      })
    },
  })
}