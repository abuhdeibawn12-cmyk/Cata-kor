import type { Metadata } from "next";
import { HomePage } from "./CataKorSite";

export const metadata: Metadata = {
  title: "Cata-Kor NAD | Age on your terms",
  description: "Everyday longevity support built with transparent dosing, quality ingredients, and trusted testing.",
};

export default function Page() {
  return <HomePage />;
}
