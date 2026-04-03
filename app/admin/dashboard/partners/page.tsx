import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePartner } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function PartnersAdminPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Partners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage partner profiles</p>
        </div>
        <Link
          href="/admin/dashboard/partners/new"
          className="bg-navy-dark text-white text-sm font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          + New Partner
        </Link>
      </div>

      {partners.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl">
          <p className="text-lg">No partners yet.</p>
          <Link
            href="/admin/dashboard/partners/new"
            className="text-navy text-sm mt-2 inline-block hover:underline"
          >
            Add the first partner →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Photo</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Name</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Role</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Order</th>
                <th className="text-right px-6 py-3 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {partner.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={partner.imageUrl}
                        alt={partner.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy text-xs font-bold">
                        {partner.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-navy">{partner.name}</td>
                  <td className="px-6 py-4 text-gray-500">{partner.role}</td>
                  <td className="px-6 py-4 text-gray-500">{partner.order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-3 justify-end">
                      <Link
                        href={`/admin/dashboard/partners/${partner.id}/edit`}
                        className="text-navy hover:text-gold font-medium transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={async () => {
                          "use server";
                          await deletePartner(partner.id);
                        }}
                        confirmMessage={`Delete ${partner.name}?`}
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
