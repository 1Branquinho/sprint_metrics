import { useQuery } from "@tanstack/react-query";

import { listCollaborators } from "@/api/collaborators";
import { queryKeys } from "@/api/queryKeys";

export function useCollaborators(active?: boolean, limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.collaborators({ active, limit, offset }),
    queryFn: () => listCollaborators(active, limit, offset),
  });
}
