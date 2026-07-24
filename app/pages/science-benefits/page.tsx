import type { Metadata } from "next";
import { SciencePage } from "./SciencePage";

export const metadata: Metadata = {
  title: "The Science and Benefits of NAD+ | Cata-Kor",
  description:
    "Explore Cata-Kor product certificates, liposomal NAD+ research, clinician reviews, video, and supplement FAQs.",
};

export default function Page() {
  return <SciencePage />;
}
