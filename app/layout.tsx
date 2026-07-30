import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { CartProvider } from "./CartContext";
import { GlobalCart } from "./GlobalCart";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "catakor.store";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "Cata-Kor longevity supplements for cellular energy, healthy aging, and everyday wellness.";

  return {
    title: {
      default: "Cata-Kor | Age on your terms",
      template: "%s",
    },
    description,
    icons: {
      icon: "/favicon.jpg",
      shortcut: "/favicon.jpg",
    },
    openGraph: {
      title: "Cata-Kor | Age on your terms",
      description,
      images: [{ url: `${origin}/og.png`, width: 1707, height: 909, alt: "Cata-Kor — Age on your terms" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Cata-Kor | Age on your terms",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <GlobalCart />
        </CartProvider>
      </body>
    </html>
  );
}
