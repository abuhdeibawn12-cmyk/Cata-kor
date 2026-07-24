import type { Metadata } from "next";
import { CollectionPage } from "./CollectionPage";

export const metadata: Metadata = {
  title: "Shop All | Cata-Kor",
  description: "Shop Cata-Kor longevity supplements and check current product availability.",
};

export default function Page() {
  return <CollectionPage />;
}
