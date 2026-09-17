import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getUserVacations } from "@/services/vacation.service";

export function useVacations() {
  const { user } = useAuth();

  const userId = user?.uid;

  const vacationsQuery = useQuery({
    queryKey: ["vacations", userId],
    queryFn: () => getUserVacations(userId!),
    enabled: !!userId,
  });

  return {
    vacations: vacationsQuery.data ?? [],
    isLoading: vacationsQuery.isLoading,
    isError: vacationsQuery.isError,
    error: vacationsQuery.error,
  };
}
