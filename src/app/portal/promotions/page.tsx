import type { Metadata } from "next";
import { PromotionsList } from "@/components/portal/PromotionsList";

export const metadata: Metadata = {
  title: "Promociones — Kubi Partners",
};

export default function PromotionsPage() {
  return <PromotionsList />;
}
