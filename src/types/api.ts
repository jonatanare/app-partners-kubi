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
  manager_name?: string;
  contact_info?: ContactInfo;
  location: GeoPoint;
  status: "active" | "inactive";
  role: "partner";
  wallet_balance: number;
  /** Zona horaria IANA. Por defecto "America/Cancun" si no se configuró. */
  timezone: string;
  /** Horarios de apertura por día. Ausente si nunca se configuraron. */
  opening_hours?: OpeningHours;
  createdAt: string;
  updatedAt: string;
}

/** Tier earned by monthly validated lead count. Resets on the 1st of each month. */
export type DriverTier = "Base" | "Plata" | "Oro";

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  platform?: "Uber" | "DiDi" | "InDrive" | "Otro";
  qr_code_id: string;
  balance: number;
  status: "active" | "inactive";
  /** Total leads validated in the current calendar month. */
  monthly_conversions: number;
  /** Tier based on monthly_conversions: Base (0–14), Plata (15–39), Oro (40+). */
  current_tier: DriverTier;
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
  /** Tier-based driver share: Base=50%, Plata=55%, Oro=60%. 0 while pending. */
  driver_amount: number;
  /** Kubi's share: Base=50%, Plata=45%, Oro=40%. 0 while pending. */
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

// Backend returns the partner object directly (no wrapper key)
export type ProfileResponse = Partner;

export interface UpdateProfilePayload {
  business_name?: string;
  category?: string;
  manager_name?: string;
  contact_info?: ContactInfo;
  opening_hours?: OpeningHours;
  timezone?: string;
}

// ─── Opening Hours ────────────────────────────────────────────────────────────

/** Horario de un día. null = cerrado ese día, undefined = no configurado. */
export type DaySchedule = { open: string; close: string } | null;

export interface OpeningHours {
  monday?:    DaySchedule;
  tuesday?:   DaySchedule;
  wednesday?: DaySchedule;
  thursday?:  DaySchedule;
  friday?:    DaySchedule;
  saturday?:  DaySchedule;
  sunday?:    DaySchedule;
}

export interface UpdateOpeningHoursPayload {
  opening_hours?: OpeningHours;
  timezone?: string;
}
