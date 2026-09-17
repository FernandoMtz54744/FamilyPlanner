import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'
import { getFamilyByUserId } from '@/services/family.service'
import { getUsersByIds } from '@/services/user.service'
import { getFamilyEvents } from '@/services/event.service'
import { getFamilyVacations } from '@/services/vacation.service'

export function useFamilyPlanner() {
  const { user } = useAuth()
  const userId = user?.uid

  const familyQuery = useQuery({
    queryKey: ['family', userId],
    queryFn: () => getFamilyByUserId(userId!),
    enabled: !!userId,
  })

  const family = familyQuery.data;

  const usersQuery = useQuery({
    queryKey: ['family-users', family?.id, family?.members],
    queryFn: () => getUsersByIds(family!.members),
    enabled: !!family,
  })

  const eventsQuery = useQuery({
    queryKey: ['family-events', family?.id],
    queryFn: () => getFamilyEvents(family!.id),
    enabled: !!family,
  })

  const vacationsQuery = useQuery({
    queryKey: ['family-vacations', family?.id],
    queryFn: () => getFamilyVacations(family!.id),
    enabled: !!family,
  })

  return {
    family,
    users: usersQuery.data ?? [],
    events: eventsQuery.data ?? [],
    vacations: vacationsQuery.data ?? [],

    isLoading:
      familyQuery.isLoading ||
      usersQuery.isLoading ||
      eventsQuery.isLoading ||
      vacationsQuery.isLoading,

    isError:
      familyQuery.isError ||
      usersQuery.isError ||
      eventsQuery.isError || 
      vacationsQuery.isError,

    error:
      familyQuery.error ??
      usersQuery.error ??
      eventsQuery.error ??
      vacationsQuery.error
  }
}