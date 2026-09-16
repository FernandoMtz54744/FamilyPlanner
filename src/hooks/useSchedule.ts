import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSchedule, saveSchedule, type Horario } from '@/services/schedule/schedule.service'

export function useSchedule(userId?: string) {
    const queryClient = useQueryClient()

    const scheduleQuery = useQuery({
        queryKey: ['schedule', userId],
        queryFn: () => getSchedule(userId!),
        enabled: !!userId,
    })

    const saveMutation = useMutation({
        mutationFn: (horario: Horario) => {
        if (!userId) {
            throw new Error('No hay usuario autenticado')
        }
      return saveSchedule(userId, horario)
    },

    onSuccess: (_, horario) => {
        queryClient.setQueryData(['schedule', userId], horario)
    }
  })

    return { 
        schedule: scheduleQuery.data,
        isLoading: scheduleQuery.isLoading,
        isSaving: saveMutation.isPending,
        saveSchedule: saveMutation.mutateAsync,
    }
}