import type { Metadata } from "next";
import { AboutPage } from "./AboutPage";

export const metadata: Metadata = {
  title: "About Cata-Kor | Science-Backed Wellness",
  description:
    "Discover Cata-Kor's mission to make science-backed longevity support accessible through quality ingredients and transparent testing.",
};

export default function Page() {
  return <AboutPage />;
}
