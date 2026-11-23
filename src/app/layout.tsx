import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const unbounded = Unbounded({ variable: "--font-unbounded", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theorycloud.ai"),
  title: {
    default: "Theory Cloud: AI agents your customers and regulators can trust",
    template: "%s · Theory Cloud",
  },
  description:
    "Theory Cloud helps businesses put AI agents in front of customers safely: every answer sourced, every customer's data kept separate, every change approved.",
  openGraph: {
    title: "Theory Cloud",
    description: "AI agents your customers and regulators can trust.",
    url: "https://www.theorycloud.ai",
    siteName: "Theory Cloud",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${unbounded.variable}`}>
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
