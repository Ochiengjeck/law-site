import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/admin/ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id: parseInt(id, 10) } });
  if (!service) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Edit Service</h1>
        <p className="text-gray-500 text-sm mt-1">{service.title}</p>
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
