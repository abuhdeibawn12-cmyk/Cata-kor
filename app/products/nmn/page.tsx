import type { Metadata } from "next";
import { NmnProductPage } from "../../SupplementProductPage";

export const metadata: Metadata = {
  title: "NMN 4-in-1 NAD+ Support | Cata-Kor",
  description: "Cata-Kor NMN with TMG, quercetin and resveratrol for NAD+ pathway support.",
};

export default function Page() {
  return <NmnProductPage />;
}
