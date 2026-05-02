// ─────────────────────────────────────────────────────────────────────────────
// App-level configuration helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Wallet balance below this threshold triggers a low-balance warning. */
export const LOW_WALLET_THRESHOLD = 20;

/**
 * Builds a WhatsApp deep-link for partner support requests.
 *
 * Reads `NEXT_PUBLIC_SUPPORT_WHATSAPP` (format: country code + number, no `+`).
 * Returns `null` when the variable is not set so callers can hide the CTA.
 */
export function getSupportWhatsAppUrl(message: string): string | null {
  const number = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
