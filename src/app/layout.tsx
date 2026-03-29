import type { Metadata } from "next";
import { Geist_Mono, Onest } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/lib/providers/QueryProvider";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

const onestSans = Onest({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServZEN",
  description: "ServZEN is a service and Prompt management web application From faulty wiring to new appliance installation, our certified electricians ensure your home's safety and power efficiency. Fast and reliable service at your doorstep. Residential & Commercial Plumbing Services: From leaky faucets to full pipe installations, our expert plumbers provide top-notch service for your home or business. Fast, reliable, and affordable plumbing solutions. HVAC Services: Stay comfortable year-round with our expert HVAC services. From installation to maintenance and repairs, we ensure your heating and cooling systems run efficiently. Fast, reliable, and affordable solutions for your home or business.AC & Home Appliance Care Services: Keep your home cool and appliances running smoothly with our AC and home appliance care services. From installation to maintenance and repairs, we provide fast, reliable, and affordable solutions for your comfort and convenience.Interior & Painting Services: Transform your space with our interior and painting services. From design consultation to flawless execution, we bring your vision to life with quality craftsmanship and attention to detail. Fast, reliable, and affordable solutions for your home or business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${onestSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
