import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/api/queryKeys";
import { listSprints } from "@/api/sprints";

export function useSprints(limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.sprints({ limit, offset }),
    queryFn: () => listSprints(limit, offset),
  });
}
