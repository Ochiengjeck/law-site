import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteService } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Manage practice areas</p>
        </div>
        <Link
          href="/admin/dashboard/services/new"
          className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded hover:bg-navy-dark transition-colors"
        >
          + New Service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl">
          <p className="text-lg">No services yet.</p>
          <Link
            href="/admin/dashboard/services/new"
            className="text-navy text-sm mt-2 inline-block hover:underline"
          >
            Add the first service →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Title</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Category</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Slug</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Order</th>
                <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-navy">{service.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        service.category === "main"
                          ? "bg-navy/10 text-navy"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {service.category === "main" ? "Main" : "Other"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                    {service.slug || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{service.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/admin/dashboard/services/${service.id}/edit`}
                        className="text-navy hover:text-gold font-medium transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deleteService(service.id);
                        }}
                        confirmMessage={`Delete "${service.title}"?`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
