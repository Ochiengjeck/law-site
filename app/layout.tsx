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
      default: "SW Law Advocates LLP",
      template: "%s | SW Law Advocates LLP",
    },
    description:
      "SW Law Advocates LLP is a premier law firm specialising in Maritime & Shipping Law, ESG Compliance, Corporate Law, and Conveyancing in Kenya.",
    ...(iconUrl && {
      icons: {
        icon: iconUrl,
        shortcut: iconUrl,
        apple: iconUrl,
      },
    }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeRows = await prisma.siteSetting.findMany({
    where: { key: { in: ["theme.navy", "theme.navyDark", "theme.gold", "theme.goldDark", "theme.lightGray"] } },
  });
  const theme: Record<string, string> = {
    "theme.navy":      "#0CB8CC",
    "theme.navyDark":  "#097A8C",
    "theme.gold":      "#C9A84C",
    "theme.goldDark":  "#b8953e",
    "theme.lightGray": "#F5F7FA",
  };
  for (const row of themeRows) theme[row.key] = row.value;

  const themeStyle = {
    "--color-navy":       theme["theme.navy"],
    "--color-navy-dark":  theme["theme.navyDark"],
    "--color-gold":       theme["theme.gold"],
    "--color-gold-dark":  theme["theme.goldDark"],
    "--color-light-gray": theme["theme.lightGray"],
  } as React.CSSProperties;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={themeStyle}
      >
        {children}
      </body>
    </html>
  );
}
