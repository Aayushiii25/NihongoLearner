import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useProgress(type?: string) {
  return useQuery({
    queryKey: ["/api/progress", type],
    queryFn: async () => {
      const url = type ? `/api/progress?type=${type}` : "/api/progress";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch progress");
      return response.json();
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (progressData: {
      wordId: number;
      correct: number;
      incorrect: number;
      masteryLevel: number;
    }) => {
      const response = await apiRequest("POST", "/api/progress", progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ["/api/user/stats"],
  });
}
