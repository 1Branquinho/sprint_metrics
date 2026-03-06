import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCollaborator, listCollaborators, type CollaboratorCreateInput } from "@/api/collaborators";
import { queryKeys } from "@/api/queryKeys";

export function useCollaborators(active?: boolean, limit = 50, offset = 0) {
  return useQuery({
    queryKey: queryKeys.collaborators({ active, limit, offset }),
    queryFn: () => listCollaborators(active, limit, offset),
  });
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CollaboratorCreateInput) => createCollaborator(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}
