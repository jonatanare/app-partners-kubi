// ─────────────────────────────────────────────────────────────────────────────
// Kubi API — TypeScript interfaces matching the backend schema (Mongoose models)
// Reference: docs/partner-integration-guide.md
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoPoint {
  type: "Point";
  /** [longitude, latitude] — GeoJSON standard (longitude first) */
  coordinates: [number, number];
}

export interface ContactInfo {
  phone?: string;
  address?: string;
  website?: string;
}

export interface Partner {
  _id: string;
  business_name: string;
  category: string;
  email: string;
  contact_info?: ContactInfo;
  location: GeoPoint;
  status: "active" | "inactive";
  role: "partner";
  wallet_balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qr_code_id: string;
  balance: number;
  status: "active" | "inactive";
  role: "driver";
  location: GeoPoint;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  _id: string;
  partner_id: string | Partner;
  title: string;
  description: string;
  reward_value: string;
  commission_per_lead: number;
  status: "active" | "inactive";
  is_deleted: boolean;
  valid_from: string;
  valid_until: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  driver_id: string | Driver;
  promo_id: string | Promotion;
  status: "pending" | "completed";
  validation_code: string;
  commission_amount: number;
  /** 80% of commission_amount — set when lead is completed, 0 while pending */
  driver_amount: number;
  /** 20% of commission_amount — set when lead is completed, 0 while pending */
  platform_fee_amount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/** Minimal user info stored in the session cookie and returned to the client. */
export interface SessionUser {
  _id: string;
  business_name?: string;
  name?: string;
  email: string;
  role: "partner" | "driver";
}

export interface AuthClientResponse {
  user: SessionUser;
}

// ─── Partner endpoints ────────────────────────────────────────────────────────

export interface ValidateResponse {
  message: string;
  lead: Lead;
}

// Dashboard — GET /api/v1/partners/dashboard
export interface PromotionDashboardItem {
  promo_id: string;
  title: string;
  status: "active" | "inactive";
  total_leads: number;
  completed_leads: number;
  pending_leads: number;
  total_commission_paid: number;
}

export interface DashboardResponse {
  wallet_balance: number;
  active_promotions: number;
  inactive_promotions: number;
  total_leads: number;
  completed_leads: number;
  pending_leads: number;
  total_commission_paid: number;
  promotions: PromotionDashboardItem[];
}

// Promotions — GET /api/v1/partners/promotions
export interface PromotionsListResponse {
  promotions: Promotion[];
}

// Promotions — POST /api/v1/partners/promotions
export interface CreatePromotionPayload {
  title: string;
  description: string;
  reward_value: string;
  commission_per_lead: number;
  valid_from: string;
  valid_until: string;
}

// Promotions — PATCH /api/v1/partners/promotions/:id
export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export interface PromotionResponse {
  promotion: Promotion;
}

// Leads — GET /api/v1/partners/promotions/:id/leads
export interface LeadsResponse {
  leads: Lead[];
}

// ─── API error ────────────────────────────────────────────────────────────────

/** The backend uses the key `error` (not `message`) for all error responses. */
export interface ApiErrorBody {
  error: string;
}

// ─── Partner profile ──────────────────────────────────────────────────────────

export interface ProfileResponse {
  partner: Partner;
}

export interface UpdateProfilePayload {
  business_name?: string;
  category?: string;
  manager_name?: string;
  contact_info?: ContactInfo;
}
