import { useQuery } from "@tanstack/react-query";

import { listCapacities } from "@/api/capacities";
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
