import type { Metadata } from "next";
import { ProductPage } from "../../CataKorSite";

export const metadata: Metadata = {
  title: "Liposomal NAD+ Advanced | Cata-Kor",
  description: "Cata-Kor Liposomal NAD+ Advanced, 500mg cellular energy and healthy aging support.",
};

export default function Page() {
  return <ProductPage />;
}
