import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '@/providers/AuthProvider'
import { getFamilyByUserId } from '@/services/family.service'
import {
  createVacation,
  type Vacation,
} from '@/services/vacation.service'

export function useCreateVacation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      vacation: Omit<Vacation, 'id' | 'userId' | 'familyId'>,
    ) => {
      if (!user) {
        throw new Error('No hay usuario autenticado')
      }

      const family = await getFamilyByUserId(user.uid)

      if (!family) {
        throw new Error(
          'El usuario no pertenece a una familia',
        )
      }

      return createVacation({
        ...vacation,
        userId: user.uid,
        familyId: family.id,
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vacations', user?.uid],
      })
    },
  })
}