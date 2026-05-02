import apiClient from "./client";
import type { AuthClientResponse, GeoPoint, ContactInfo } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  business_name: string;
  category: string;
  /** Not yet persisted by the backend — will be stored once the field is added */
  manager_name: string;
  email: string;
  password: string;
  contact_info?: ContactInfo;
  location: GeoPoint;
}

export async function callLogin(
  payload: LoginPayload
): Promise<AuthClientResponse> {
  const { data } = await apiClient.post<AuthClientResponse>(
    "/auth/login",
    payload
  );
  return data;
}

export async function callRegister(
  payload: RegisterPayload
): Promise<AuthClientResponse> {
  const { data } = await apiClient.post<AuthClientResponse>(
    "/auth/register",
    payload
  );
  return data;
}

export async function callLogout(): Promise<void> {
  await apiClient.post("/auth/logout");
}
