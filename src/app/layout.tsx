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
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
