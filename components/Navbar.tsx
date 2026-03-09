import { prisma } from "@/lib/prisma";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const logoSetting = await prisma.siteSetting.findUnique({
    where: { key: "site.logoUrl" },
  });
  const logoUrl = logoSetting?.value || undefined;

  return <NavbarClient logoUrl={logoUrl} />;
}
