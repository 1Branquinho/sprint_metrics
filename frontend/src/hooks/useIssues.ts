import { useQuery } from "@tanstack/react-query";

import { listIssues, type IssueFilters } from "@/api/issues";
import { queryKeys } from "@/api/queryKeys";

export function useIssues(filters: IssueFilters) {
  return useQuery({
    queryKey: queryKeys.issues(filters),
    queryFn: () => listIssues(filters),
  });
}
