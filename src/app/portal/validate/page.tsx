import type { Metadata } from "next";
import { ValidatorScreen } from "@/components/portal/ValidatorScreen";

export const metadata: Metadata = {
  title: "Validar Cupón — Kubi Partners",
};

export default function ValidatePage() {
  return <ValidatorScreen />;
}
