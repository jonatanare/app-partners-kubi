"use client";

import { useQuery } from "@tanstack/react-query";
import { callGetPromotionLeads } from "@/lib/api/partner";
import type { LeadsResponse } from "@/types/api";

export function usePromotionLeads(
  promoId: string | null,
  status?: "pending" | "completed"
) {
  return useQuery<LeadsResponse>({
    queryKey: ["partner", "promotions", promoId, "leads", status ?? "all"],
    queryFn: () => callGetPromotionLeads(promoId!, status),
    enabled: promoId !== null,
    staleTime: 1000 * 30,
  });
}
