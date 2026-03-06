import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createIssue,
  deleteIssue,
  listIssues,
  type IssueCreateInput,
  type IssueFilters,
  type IssueUpdateInput,
  updateIssue,
} from "@/api/issues";
import { queryKeys } from "@/api/queryKeys";

export function useIssues(filters: IssueFilters) {
  return useQuery({
    queryKey: queryKeys.issues(filters),
    queryFn: () => listIssues(filters),
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IssueCreateInput) => createIssue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["sprintMetrics"] });
    },
  });
}

export function useUpdateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, payload }: { issueId: number; payload: IssueUpdateInput }) =>
      updateIssue(issueId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["sprintMetrics"] });
    },
  });
}

export function useDeleteIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (issueId: number) => deleteIssue(issueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      queryClient.invalidateQueries({ queryKey: ["sprintMetrics"] });
    },
  });
}
