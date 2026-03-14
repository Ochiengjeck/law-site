import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminNav from "@/components/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const [logoSetting, nameSetting] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "site.logoUrl" } }),
    prisma.siteSetting.findUnique({ where: { key: "site.name" } }),
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-light-gray">
      <AdminNav logoUrl={logoSetting?.value} siteName={nameSetting?.value} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
