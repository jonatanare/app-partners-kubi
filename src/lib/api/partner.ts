import apiClient from "./client";
import type {
  ValidateResponse,
  DashboardResponse,
  PromotionsListResponse,
  PromotionResponse,
  CreatePromotionPayload,
  UpdatePromotionPayload,
  LeadsResponse,
  ProfileResponse,
  UpdateProfilePayload,
} from "@/types/api";

// ─── Validation ───────────────────────────────────────────────────────────────

export async function callValidate(
  validation_code: string
): Promise<ValidateResponse> {
  const { data } = await apiClient.post<ValidateResponse>(
    "/partner/validate",
    { validation_code }
  );
  return data;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function callDashboard(): Promise<DashboardResponse> {
  const { data } = await apiClient.get<DashboardResponse>(
    "/partner/dashboard"
  );
  return data;
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export async function callListPromotions(
  status?: "active" | "inactive"
): Promise<PromotionsListResponse> {
  const params = status ? { status } : {};
  const { data } = await apiClient.get<PromotionsListResponse>(
    "/partner/promotions",
    { params }
  );
  return data;
}

export async function callGetPromotion(id: string): Promise<PromotionResponse> {
  const { data } = await apiClient.get<PromotionResponse>(
    `/partner/promotions/${id}`
  );
  return data;
}

export async function callCreatePromotion(
  payload: CreatePromotionPayload
): Promise<PromotionResponse> {
  const { data } = await apiClient.post<PromotionResponse>(
    "/partner/promotions",
    payload
  );
  return data;
}

export async function callUpdatePromotion(
  id: string,
  payload: UpdatePromotionPayload
): Promise<PromotionResponse> {
  const { data } = await apiClient.patch<PromotionResponse>(
    `/partner/promotions/${id}`,
    payload
  );
  return data;
}

export async function callTogglePromotionStatus(
  id: string,
  status: "active" | "inactive"
): Promise<void> {
  await apiClient.patch(`/partner/promotions/${id}/status`, { status });
}

export async function callDeletePromotion(id: string): Promise<void> {
  await apiClient.delete(`/partner/promotions/${id}`);
}

export async function callGetPromotionLeads(
  id: string,
  status?: "pending" | "completed"
): Promise<LeadsResponse> {
  const params = status ? { status } : {};
  const { data } = await apiClient.get<LeadsResponse>(
    `/partner/promotions/${id}/leads`,
    { params }
  );
  return data;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function callGetProfile(): Promise<ProfileResponse> {
  const { data } = await apiClient.get<ProfileResponse>("/partner/profile");
  return data;
}

export async function callUpdateProfile(
  payload: UpdateProfilePayload
): Promise<ProfileResponse> {
  const { data } = await apiClient.patch<ProfileResponse>(
    "/partner/profile",
    payload
  );
  return data;
}

