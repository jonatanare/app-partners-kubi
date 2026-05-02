"use client";

import { useQuery } from "@tanstack/react-query";
import { callDashboard } from "@/lib/api/partner";
import type { DashboardResponse } from "@/types/api";

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["partner", "dashboard"],
    queryFn: callDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
