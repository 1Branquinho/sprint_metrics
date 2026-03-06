import { useQuery } from "@tanstack/react-query";

import { getCollaboratorMetrics } from "@/api/collaboratorMetrics";
import { queryKeys } from "@/api/queryKeys";

export function useCollaboratorMetrics(collaboratorId: number | null, sprintNumber: number | null) {
  return useQuery({
    queryKey: queryKeys.collaboratorMetrics(collaboratorId, sprintNumber),
    queryFn: () => getCollaboratorMetrics(collaboratorId as number, sprintNumber ?? undefined),
    enabled: collaboratorId !== null,
  });
}
