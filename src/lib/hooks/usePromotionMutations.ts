"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  callCreatePromotion,
  callUpdatePromotion,
  callTogglePromotionStatus,
  callDeletePromotion,
} from "@/lib/api/partner";
import type {
  CreatePromotionPayload,
  UpdatePromotionPayload,
  PromotionResponse,
  ApiErrorBody,
} from "@/types/api";
import type { AxiosError } from "axios";

function useInvalidatePromotions() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: ["partner", "promotions"] });
}

export function useCreatePromotion() {
  const invalidate = useInvalidatePromotions();
  return useMutation<
    PromotionResponse,
    AxiosError<ApiErrorBody>,
    CreatePromotionPayload
  >({
    mutationFn: callCreatePromotion,
    onSuccess: () => invalidate(),
  });
}

export function useUpdatePromotion(id: string) {
  const invalidate = useInvalidatePromotions();
  return useMutation<
    PromotionResponse,
    AxiosError<ApiErrorBody>,
    UpdatePromotionPayload
  >({
    mutationFn: (payload) => callUpdatePromotion(id, payload),
    onSuccess: () => invalidate(),
  });
}

export function useTogglePromotionStatus(id: string) {
  const invalidate = useInvalidatePromotions();
  return useMutation<void, AxiosError<ApiErrorBody>, "active" | "inactive">({
    mutationFn: (status) => callTogglePromotionStatus(id, status),
    onSuccess: () => invalidate(),
  });
}

export function useDeletePromotion() {
  const invalidate = useInvalidatePromotions();
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorBody>, string>({
    mutationFn: callDeletePromotion,
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["partner", "dashboard"] });
    },
  });
}
