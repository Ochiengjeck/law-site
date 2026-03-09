import { prisma } from "@/lib/prisma";
import { updateInquiryStatus } from "@/app/admin/dashboard/blog/actions";

export const metadata = { title: "Inquiries" };

const STATUS_OPTIONS = ["new", "in-progress", "resolved", "closed"];

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Client Inquiries</h1>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-navy">{inq.name}</p>
                  <p className="text-sm text-gray-500">
                    {inq.email}
                    {inq.phone && ` · ${inq.phone}`}
                  </p>
                  <p className="text-xs text-gold font-medium mt-1">
                    {inq.serviceType}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      statusColors[inq.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {inq.status}
                  </span>
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const status = formData.get("status") as string;
                      await updateInquiryStatus(inq.id, status);
                    }}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="status"
                      defaultValue={inq.status}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="text-xs bg-navy text-white px-2 py-1 rounded hover:bg-navy-dark transition-colors"
                    >
                      Update
                    </button>
                  </form>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {inq.message}
              </p>
              <p className="mt-3 text-xs text-gray-400">
                {new Date(inq.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
