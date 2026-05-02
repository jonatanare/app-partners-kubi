"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callValidate } from "@/lib/api/partner";
import type { ValidateResponse, ApiErrorBody } from "@/types/api";
import type { AxiosError } from "axios";

export function useValidateCoupon() {
  const queryClient = useQueryClient();

  return useMutation<ValidateResponse, AxiosError<ApiErrorBody>, string>({
    mutationFn: callValidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "dashboard"] });
    },
  });
}
