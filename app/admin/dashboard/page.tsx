import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [totalInquiries, newInquiries, publishedPosts, draftPosts] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: false } }),
    ]);

  const stats = [
    { label: "Total Inquiries", value: totalInquiries, href: "/admin/dashboard/inquiries" },
    { label: "New Inquiries", value: newInquiries, href: "/admin/dashboard/inquiries", highlight: newInquiries > 0 },
    { label: "Published Posts", value: publishedPosts, href: "/admin/dashboard/blog" },
    { label: "Draft Posts", value: draftPosts, href: "/admin/dashboard/blog" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p
              className={`text-4xl font-bold ${
                stat.highlight ? "text-gold" : "text-navy"
              }`}
            >
              {stat.value}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-semibold text-navy mb-1">Quick Actions</h2>
        <div className="flex gap-4 mt-4">
          <a
            href="/admin/dashboard/blog/new"
            className="bg-navy text-white text-sm font-medium px-5 py-2 rounded hover:bg-navy-dark transition-colors"
          >
            New Blog Post
          </a>
          <a
            href="/admin/dashboard/inquiries"
            className="border border-navy text-navy text-sm font-medium px-5 py-2 rounded hover:bg-light-gray transition-colors"
          >
            View Inquiries
          </a>
        </div>
      </div>
    </div>
  );
}
