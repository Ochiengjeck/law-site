import { prisma } from "@/lib/prisma";
import { updateInquiryStatus } from "@/app/admin/dashboard/blog/actions";

export const metadata = { title: "Inquiries" };

const STATUS_OPTIONS = ["new", "in-progress", "resolved", "closed"];

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusDot: Record<string, string> = {
  new: "bg-blue-500",
  "in-progress": "bg-amber-400",
  resolved: "bg-emerald-500",
  closed: "bg-gray-400",
};

const serviceIcon: Record<string, string> = {
  maritime: "⚓",
  esg: "🌿",
  corporate: "🏢",
  conveyancing: "🏠",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    new: inquiries.filter((i) => i.status === "new").length,
    "in-progress": inquiries.filter((i) => i.status === "in-progress").length,
    resolved: inquiries.filter((i) => i.status === "resolved").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Client Inquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            {inquiries.length} total · {counts.new} new
          </p>
        </div>
      </div>

      {/* Status summary pills */}
      {inquiries.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3">
          {(["new", "in-progress", "resolved", "closed"] as const).map((s) => (
            <div
              key={s}
              className={`flex items-center gap-2 border px-3 py-1.5 text-xs font-medium ${statusColors[s]}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot[s]}`} />
              <span className="capitalize">{s}</span>
              <span className="ml-1 font-bold">{counts[s]}</span>
            </div>
          ))}
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center text-gray-400">
          No inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              {/* Top accent bar by status */}
              <div className={`h-0.5 w-full ${statusDot[inq.status] ?? "bg-gray-300"}`} />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-navy text-white text-sm font-bold select-none">
                    {getInitials(inq.name)}
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      {/* Identity */}
                      <div>
                        <p className="font-semibold text-navy leading-tight">{inq.name}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                          <span>{inq.email}</span>
                          {inq.phone && <span>{inq.phone}</span>}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-sm">
                            {serviceIcon[inq.serviceType.toLowerCase()] ?? "⚖️"}
                          </span>
                          <span className="text-xs font-medium text-gold-dark">
                            {inq.serviceType}
                          </span>
                        </div>
                      </div>

                      {/* Current status badge */}
                      <span
                        className={`flex-shrink-0 flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${
                          statusColors[inq.status] ?? "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot[inq.status] ?? "bg-gray-400"}`} />
                        <span className="capitalize">{inq.status === "in-progress" ? "In Progress" : inq.status}</span>
                      </span>
                    </div>

                    {/* Message */}
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-l-2 border-gray-200 pl-3">
                      {inq.message}
                    </p>

                    {/* Timestamp */}
                    <p className="mt-3 text-xs text-gray-400">
                      Received{" "}
                      {new Date(inq.createdAt).toLocaleDateString("en-KE", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(inq.createdAt).toLocaleTimeString("en-KE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-2.5">
                {/* Contact shortcuts */}
                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${inq.email}`}
                    title={`Email ${inq.name}`}
                    className="flex items-center gap-1.5 rounded-none border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-navy hover:text-navy"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Mail
                  </a>
                  {inq.phone && (
                    <a
                      href={`tel:${inq.phone}`}
                      title={`Call ${inq.name}`}
                      className="flex items-center gap-1.5 rounded-none border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-navy hover:text-navy"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      Call
                    </a>
                  )}
                </div>

                {/* Status icon buttons */}
                <div className="flex items-center gap-1">
                  {(
                    [
                      {
                        s: "new",
                        label: "New",
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.238 5.338a2.25 2.25 0 0 0-2.15-1.588H15M9 3.75h6M9 3.75v6.75m6-6.75v6.75m0 0H9" />
                          </svg>
                        ),
                        active: "bg-blue-600 text-white border-blue-600",
                        idle: "border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500",
                      },
                      {
                        s: "in-progress",
                        label: "In Progress",
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        ),
                        active: "bg-amber-500 text-white border-amber-500",
                        idle: "border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500",
                      },
                      {
                        s: "resolved",
                        label: "Resolved",
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        ),
                        active: "bg-emerald-600 text-white border-emerald-600",
                        idle: "border-gray-200 text-gray-400 hover:border-emerald-400 hover:text-emerald-500",
                      },
                      {
                        s: "closed",
                        label: "Closed",
                        icon: (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        ),
                        active: "bg-gray-500 text-white border-gray-500",
                        idle: "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-500",
                      },
                    ] as const
                  ).map(({ s, label, icon, active, idle }) => (
                    <form
                      key={s}
                      action={async () => {
                        "use server";
                        await updateInquiryStatus(inq.id, s);
                      }}
                    >
                      <button
                        type="submit"
                        title={`Mark as ${label}`}
                        className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium transition-colors ${
                          inq.status === s ? active : idle
                        }`}
                      >
                        {icon}
                        {label}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
