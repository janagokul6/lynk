"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface HealthResponse {
  status: string;
  db: string;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data } = await api.get<HealthResponse>("/api/health");
      return data;
    },
  });
}
