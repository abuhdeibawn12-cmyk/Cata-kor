import type { Metadata } from "next";
import { GlutathioneProductPage } from "../../SupplementProductPage";

export const metadata: Metadata = {
  title: "Liposomal Glutathione | Cata-Kor",
  description:
    "Cata-Kor Liposomal Glutathione with vitamin C, selenium, vitamin B2 and resveratrol.",
};

export default function Page() {
  return <GlutathioneProductPage />;
}
