import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const iconSetting = await prisma.siteSetting.findUnique({
    where: { key: "site.iconUrl" },
  });
  const iconUrl = iconSetting?.value || undefined;

  return {
    title: {
      default: "SW Law LLP – Legal Consultancy",
      template: "%s | SW Law LLP",
    },
    description:
      "SW Law LLP is a premier legal consultancy specialising in Maritime & Shipping Law, ESG Compliance, Corporate Law, and Conveyancing in Kenya.",
    ...(iconUrl && {
      icons: {
        icon: iconUrl,
        shortcut: iconUrl,
        apple: iconUrl,
      },
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
