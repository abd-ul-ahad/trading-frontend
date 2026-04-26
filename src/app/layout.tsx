import type { Metadata } from "next";
import { Crimson_Text, Inter } from "next/font/google";
import StoreProvider from "@/lib/redux/StoreProvider";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  variable: "--font-crimson",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oroviax - Verified Performance",
  description: "Where capital meets verified performance. Discover strategies and track the value of your investments real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${crimsonText.variable} ${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <StoreProvider>
            <Navbar />
            {children}
            <Footer />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
