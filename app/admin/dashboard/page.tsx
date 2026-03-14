import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Dashboard" };

function countMediaFiles(): number {
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) return 0;
  let count = 0;
  for (const cat of fs.readdirSync(uploadsDir)) {
    const catPath = path.join(uploadsDir, cat);
    if (fs.statSync(catPath).isDirectory()) {
      count += fs.readdirSync(catPath).length;
    }
  }
  return count;
}

export default async function DashboardPage() {
  const [totalInquiries, newInquiries, publishedPosts, draftPosts] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "new" } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.blogPost.count({ where: { published: false } }),
    ]);

  const mediaCount = countMediaFiles();

  const stats = [
    { label: "Total Inquiries", value: totalInquiries, href: "/admin/dashboard/inquiries" },
    { label: "New Inquiries", value: newInquiries, href: "/admin/dashboard/inquiries", highlight: newInquiries > 0 },
    { label: "Published Posts", value: publishedPosts, href: "/admin/dashboard/blog" },
    { label: "Draft Posts", value: draftPosts, href: "/admin/dashboard/blog" },
    { label: "Media Files", value: mediaCount, href: "/admin/dashboard/media" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p
              className={`text-3xl font-black ${
                stat.highlight ? "text-gold" : "text-navy"
              }`}
            >
              {stat.value}
            </p>
          </a>
        ))}
      </div>

      <div className="mt-10 bg-white border border-gray-200 p-6">
        <h2 className="font-semibold text-navy mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <a
            href="/admin/dashboard/blog/new"
            className="bg-navy text-white text-xs font-medium px-5 py-2.5 hover:bg-navy-dark transition-colors tracking-widest uppercase"
          >
            New Blog Post
          </a>
          <a
            href="/admin/dashboard/inquiries"
            className="border border-navy text-navy text-xs font-medium px-5 py-2.5 hover:bg-light-gray transition-colors tracking-widest uppercase"
          >
            View Inquiries
          </a>
          <a
            href="/admin/dashboard/media"
            className="border border-gray-300 text-gray-600 text-xs font-medium px-5 py-2.5 hover:border-navy hover:text-navy transition-colors tracking-widest uppercase"
          >
            Media Library
          </a>
        </div>
      </div>
    </div>
  );
}
