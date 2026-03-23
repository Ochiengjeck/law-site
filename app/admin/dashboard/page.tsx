import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusBadgeClass: Record<string, string> = {
  new: "bg-blue-50 text-blue-600 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-600 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-600 border-emerald-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusDot: Record<string, string> = {
  new: "bg-blue-500",
  "in-progress": "bg-amber-400",
  resolved: "bg-emerald-500",
  closed: "bg-gray-400",
};

const statusBarColor: Record<string, string> = {
  new: "bg-blue-500",
  "in-progress": "bg-amber-400",
  resolved: "bg-emerald-500",
  closed: "bg-gray-400",
};

export default async function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [
    totalInquiries,
    newInquiries,
    inProgressInquiries,
    resolvedInquiries,
    closedInquiries,
    publishedPosts,
    draftPosts,
    recentInquiries,
    recentPosts,
    allServiceTypes,
    partnerCount,
    serviceCount,
    settingsCount,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
    prisma.inquiry.count({ where: { status: "in-progress" } }),
    prisma.inquiry.count({ where: { status: "resolved" } }),
    prisma.inquiry.count({ where: { status: "closed" } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: false } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, name: true, email: true, serviceType: true, status: true, createdAt: true },
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true, author: true, published: true, createdAt: true },
    }),
    prisma.inquiry.findMany({ select: { serviceType: true } }),
    prisma.partner.count(),
    prisma.service.count(),
    prisma.siteSetting.count(),
  ]);

  let mediaCount = 0;
  try {
    mediaCount = await prisma.media.count();
  } catch {
    // Media table may not exist yet — silent fallback
  }

  const serviceBreakdown = allServiceTypes.reduce<Record<string, number>>(
    (acc, { serviceType }) => {
      acc[serviceType] = (acc[serviceType] ?? 0) + 1;
      return acc;
    },
    {}
  );
  const topServices = Object.entries(serviceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const maxServiceCount = topServices[0]?.[1] ?? 1;

  const statusCounts = [
    { label: "New", key: "new", count: newInquiries },
    { label: "In Progress", key: "in-progress", count: inProgressInquiries },
    { label: "Resolved", key: "resolved", count: resolvedInquiries },
    { label: "Closed", key: "closed", count: closedInquiries },
  ];

  const resolutionRate =
    totalInquiries > 0
      ? Math.round(((resolvedInquiries + closedInquiries) / totalInquiries) * 100)
      : 0;

  const kpiCards = [
    {
      label: "Total Inquiries",
      value: totalInquiries,
      sub: `${newInquiries} awaiting`,
      accent: "border-t-[3px] border-t-navy",
      iconBg: "bg-navy/10",
      iconColor: "text-navy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
        </svg>
      ),
      href: "/admin/dashboard/inquiries",
    },
    {
      label: "New",
      value: newInquiries,
      sub: newInquiries > 0 ? "Needs attention" : "All clear",
      accent: "border-t-[3px] border-t-amber-400",
      iconBg: newInquiries > 0 ? "bg-amber-50" : "bg-gray-100",
      iconColor: newInquiries > 0 ? "text-amber-500" : "text-gray-400",
      highlight: newInquiries > 0,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      ),
      href: "/admin/dashboard/inquiries",
    },
    {
      label: "In Progress",
      value: inProgressInquiries,
      sub: "active cases",
      accent: "border-t-[3px] border-t-blue-400",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      href: "/admin/dashboard/inquiries",
    },
    {
      label: "Resolved",
      value: resolvedInquiries,
      sub: `${closedInquiries} closed`,
      accent: "border-t-[3px] border-t-emerald-400",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      href: "/admin/dashboard/inquiries",
    },
    {
      label: "Published",
      value: publishedPosts,
      sub: `${draftPosts} draft${draftPosts !== 1 ? "s" : ""}`,
      accent: "border-t-[3px] border-t-navy",
      iconBg: "bg-navy/10",
      iconColor: "text-navy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
      href: "/admin/dashboard/blog",
    },
    {
      label: "Drafts",
      value: draftPosts,
      sub: "unpublished posts",
      accent: "border-t-[3px] border-t-gray-300",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-400",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      ),
      href: "/admin/dashboard/blog",
    },
    {
      label: "Media",
      value: mediaCount,
      sub: `${partnerCount} partners · ${serviceCount} svc`,
      accent: "border-t-[3px] border-t-indigo-400",
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
      href: "/admin/dashboard/media",
    },
  ];

  const quickActions = [
    {
      label: "New Blog Post", href: "/admin/dashboard/blog/new",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" /></svg>,
    },
    {
      label: "View Inquiries", href: "/admin/dashboard/inquiries",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" /></svg>,
    },
    {
      label: "Media Library", href: "/admin/dashboard/media",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>,
    },
    {
      label: "Partners", href: "/admin/dashboard/partners",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
    },
    {
      label: "Services", href: "/admin/dashboard/services",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
    },
    {
      label: "Site Settings", href: "/admin/dashboard/settings",
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-navy to-navy-dark p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold mb-2">
            SW Law Advocates LLP · Admin Panel
          </p>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {greeting}, Admin.
          </h1>
          <p className="text-sm text-white/50 mt-1">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          {newInquiries > 0 && (
            <span className="text-[10px] font-semibold bg-amber-400 text-navy px-2.5 py-1 uppercase tracking-wider">
              {newInquiries} new {newInquiries === 1 ? "inquiry" : "inquiries"}
            </span>
          )}
          <Link
            href="/admin/dashboard/blog/new"
            className="bg-gold text-white text-[10px] font-semibold px-4 py-2.5 hover:bg-gold-dark transition-colors tracking-widest uppercase"
          >
            + New Post
          </Link>
          <Link
            href="/admin/dashboard/inquiries"
            className="border border-white/20 text-white/80 text-[10px] font-medium px-4 py-2.5 hover:border-white/50 hover:text-white transition-colors tracking-widest uppercase"
          >
            Inquiries
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {kpiCards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className={`bg-white shadow-sm hover:shadow-md transition-all group overflow-hidden ${card.accent}`}
          >
            <div className="p-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
              <p className={`text-3xl font-black leading-none ${card.highlight ? "text-gold" : "text-navy"}`}>
                {card.value}
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-2 font-medium">{card.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{card.sub}</p>
            </div>
          </a>
        ))}
      </div>

      {/* ── Row 2: Inquiries Table + Status Breakdown ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Recent Inquiries */}
        <div className="col-span-2 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-navy text-sm">Recent Inquiries</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">{totalInquiries} total · last 6 shown</p>
            </div>
            <Link href="/admin/dashboard/inquiries" className="text-xs text-gold hover:text-gold-dark font-medium transition-colors">
              View all →
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No inquiries yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy/[0.03] border-b border-gray-100">
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium">Client</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Service</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Status</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-gray-50 hover:bg-navy/[0.015] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-navy text-xs">{inq.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{inq.email}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      <span className="truncate block max-w-[110px]">{inq.serviceType}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 border font-medium ${statusBadgeClass[inq.status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[inq.status] ?? "bg-gray-400"}`} />
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-gray-400 whitespace-nowrap">
                      {timeAgo(new Date(inq.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Status Breakdown */}
        <div className="bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy text-sm">Status Breakdown</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">{totalInquiries} total inquiries</p>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {statusCounts.map(({ label, key, count }) => {
              const pct = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusDot[key]}`} />
                      <span className="text-xs text-gray-700 font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">{pct}%</span>
                      <span className="text-xs font-bold text-navy w-4 text-right">{count}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${statusBarColor[key]} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resolution Rate */}
          <div className="bg-gradient-to-br from-navy to-navy-dark p-5">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium mb-1">Resolution Rate</p>
            <p className="text-4xl font-black text-white leading-none">
              {resolutionRate}
              <span className="text-lg font-normal text-white/40">%</span>
            </p>
            <p className="text-[10px] text-white/50 mt-1">resolved or closed</p>
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-1 bg-gold rounded-full" style={{ width: `${resolutionRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Practice Areas + Blog Posts ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Practice Area Breakdown */}
        <div className="bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy text-sm">By Practice Area</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Top inquiry sources</p>
          </div>
          <div className="p-5 space-y-4">
            {topServices.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No inquiry data yet.</p>
            ) : (
              topServices.map(([type, count], i) => {
                const pct = Math.round((count / maxServiceCount) * 100);
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-white bg-navy/30 font-bold w-4 h-4 flex items-center justify-center flex-shrink-0 rounded-sm">
                          {i + 1}
                        </span>
                        <span className="text-xs text-gray-700 truncate" title={type}>{type}</span>
                      </div>
                      <span className="text-xs font-bold text-navy flex-shrink-0 ml-2">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gold transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="col-span-2 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="font-semibold text-navy text-sm">Recent Blog Posts</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">{publishedPosts} published · {draftPosts} draft</p>
            </div>
            <Link href="/admin/dashboard/blog/new" className="text-xs text-gold hover:text-gold-dark font-medium transition-colors">
              + New Post
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">No posts yet.{" "}
                <Link href="/admin/dashboard/blog/new" className="text-navy underline">Create one</Link>
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy/[0.03] border-b border-gray-100">
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3 font-medium">Title</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Author</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Status</th>
                  <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-navy/[0.015] transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-navy text-xs truncate max-w-[200px]" title={post.title}>
                        {post.title}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{post.author}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] px-2 py-0.5 border font-medium inline-flex items-center gap-1.5 ${
                        post.published
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/dashboard/blog/${post.id}/edit`} className="text-[10px] text-navy hover:text-gold font-medium transition-colors">
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Content Overview ── */}
      <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark overflow-hidden">
        <div className="px-6 py-5 flex flex-wrap items-center gap-x-10 gap-y-4">
          <div className="mr-4">
            <p className="text-[10px] text-gold tracking-[0.2em] uppercase font-semibold">Content Overview</p>
            <p className="text-xs text-white/40 mt-0.5">Site-wide summary</p>
          </div>
          {[
            { label: "Partners", value: partnerCount, href: "/admin/dashboard/partners" },
            { label: "Services", value: serviceCount, href: "/admin/dashboard/services" },
            { label: "Media Files", value: mediaCount, href: "/admin/dashboard/media" },
            { label: "Settings", value: settingsCount, href: "/admin/dashboard/settings" },
            { label: "Blog Posts", value: publishedPosts + draftPosts, href: "/admin/dashboard/blog" },
          ].map((item, i, arr) => (
            <div key={item.label} className="flex items-center gap-10">
              <a href={item.href} className="group text-center">
                <p className="text-3xl font-black text-white group-hover:text-gold transition-colors leading-none">{item.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{item.label}</p>
              </a>
              {i < arr.length - 1 && <div className="h-8 w-px bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white shadow-sm p-5">
        <h2 className="font-semibold text-navy text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2 p-4 border border-gray-100 hover:border-gold hover:shadow-sm transition-all text-center"
            >
              <div className="w-8 h-8 bg-navy/5 group-hover:bg-gold flex items-center justify-center transition-colors text-navy group-hover:text-white">
                {action.icon}
              </div>
              <span className="text-[10px] text-gray-600 group-hover:text-navy font-medium uppercase tracking-wide leading-tight transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
