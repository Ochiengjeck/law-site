import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PartnerForm from "@/components/admin/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id: parseInt(id, 10) } });
  if (!partner) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Edit Partner</h1>
        <p className="text-gray-500 text-sm mt-1">{partner.name}</p>
      </div>
      <PartnerForm partner={partner} />
    </div>
  );
}
