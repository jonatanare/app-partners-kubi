"use client";

import { useQuery } from "@tanstack/react-query";
import { callListPromotions } from "@/lib/api/partner";
import type { PromotionsListResponse } from "@/types/api";

export function usePromotions(status?: "active" | "inactive") {
  return useQuery<PromotionsListResponse>({
    queryKey: ["partner", "promotions", status ?? "all"],
    queryFn: () => callListPromotions(status),
    staleTime: 1000 * 30, // 30 seconds
  });
}
