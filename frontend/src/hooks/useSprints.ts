import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { createSprint, listSprints, type SprintCreateInput } from "@/api/sprints";

export function useSprints(limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.sprints({ limit, offset }),
    queryFn: () => listSprints(limit, offset),
  });
}

export function useCreateSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SprintCreateInput) => createSprint(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints"] });
    },
  });
}
