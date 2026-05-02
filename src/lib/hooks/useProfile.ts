"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callGetProfile, callUpdateProfile } from "@/lib/api/partner";
import type { UpdateProfilePayload } from "@/types/api";

export function useProfile() {
  return useQuery({
    queryKey: ["partner-profile"],
    queryFn: callGetProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes — profile data rarely changes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => callUpdateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner-profile"] });
    },
  });
}
