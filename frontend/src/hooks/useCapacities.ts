import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCapacity, listCapacities, type CapacityCreateInput } from "@/api/capacities";
import { queryKeys } from "@/api/queryKeys";

export function useCapacities(params: {
  sprint_number?: number;
  collaborator_id?: number;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: queryKeys.capacities(params),
    queryFn: () => listCapacities(params),
  });
}

export function useCreateCapacity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CapacityCreateInput) => createCapacity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["capacities"] });
      queryClient.invalidateQueries({ queryKey: ["sprintMetrics"] });
    },
  });
}
