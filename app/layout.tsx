import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/lib/i18n/language-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JharSetu | झारसेतु — Societal Innovation Collaboration Portal",
  description:
    "Prototype platform for connecting citizens, public problem management, universities, innovation teams, and industry partners.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSansDevanagari.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-bg-base text-text-primary">
        <LanguageProvider>
          <ClerkProvider
            appearance={{
              variables: {
                colorPrimary: "#0F62B4",
                colorForeground: "#111827",
                colorBackground: "#FFFFFF",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-inter), sans-serif",
              },
              elements: {
                card: "shadow-sm border border-[#E2E5EA] rounded-xl",
                formButtonPrimary: "bg-[#0F62B4] hover:bg-[#0C4E90] text-white font-medium text-sm transition-colors",
                footerActionLink: "text-[#0F62B4] hover:text-[#0C4E90] font-medium",
              },
            }}
          >
            {children}
            <Toaster position="top-right" />
          </ClerkProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}