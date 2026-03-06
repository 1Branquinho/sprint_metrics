import { useQuery } from "@tanstack/react-query";

import { getSprintMetrics } from "@/api/metrics";
import { queryKeys } from "@/api/queryKeys";

export function useSprintMetrics(sprintNumber: number | null) {
  return useQuery({
    queryKey: queryKeys.sprintMetrics(sprintNumber),
    queryFn: () => getSprintMetrics(sprintNumber as number),
    enabled: sprintNumber !== null,
  });
}
