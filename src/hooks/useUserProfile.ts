import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getUserById, saveUserInfo } from '@/services/user.service'
import type { SchedulerEventColor } from '@mui/x-scheduler/models'

export function useUserProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const userId = user?.uid

  const userQuery = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })

  const userInfoMutation = useMutation({
    mutationFn: (color: SchedulerEventColor) => {
      if (!userId || !user.displayName) {
        throw new Error('No hay usuario autenticado')
      }
      return saveUserInfo(userId, color, user.displayName, user.photoURL ?? undefined);
    },

    onSuccess: (_, color) => {
      queryClient.setQueryData(
        ['user-profile', userId],
        (current: typeof userQuery.data) =>
          current ? {
                ...current,
                color,
              }
            : current,
      )
    },
  })

  return {
    profile: userQuery.data,
    isLoading: userQuery.isLoading,
    isSavingInfo: userInfoMutation.isPending,
    saveUserInfo: userInfoMutation.mutateAsync,
  }
}