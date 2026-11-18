import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { ThemeProvider } from "@/src/components/providers/theme-provider";
import { ToastProvider } from "@/src/components/providers/toast-provider";
import { AuthProvider } from "@/src/components/providers/auth-provider";
import "./globals.css";

const arabicFont = IBM_Plex_Sans_Arabic({
  variable: "--font-elsory",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ELSORY STORE",
    template: "%s | ELSORY STORE",
  },
  description: "Elsory Store Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${arabicFont.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full font-sans">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
