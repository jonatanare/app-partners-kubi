"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { callUpdateOpeningHours } from "@/lib/api/partner";
import type {
  ProfileResponse,
  UpdateOpeningHoursPayload,
  ApiErrorBody,
} from "@/types/api";

export function useUpdateOpeningHours() {
  const queryClient = useQueryClient();

  return useMutation<
    ProfileResponse,
    AxiosError<ApiErrorBody>,
    UpdateOpeningHoursPayload
  >({
    mutationFn: callUpdateOpeningHours,
    onSuccess: () => {
      // Invalida el perfil para que useProfile() refleje los horarios actualizados
      queryClient.invalidateQueries({ queryKey: ["partner-profile"] });
    },
  });
}
