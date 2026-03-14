import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";

export const metadata = { title: "Blog Posts" };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">Blog Posts</h1>
        <Link
          href="/admin/dashboard/blog/new"
          className="bg-navy text-white text-xs font-medium px-5 py-2.5 hover:bg-navy-dark transition-colors tracking-widest uppercase"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center text-gray-400">
          No posts yet.{" "}
          <Link href="/admin/dashboard/blog/new" className="text-navy underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 divide-y divide-gray-100">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div className="min-w-0">
                <p className="font-medium text-navy truncate">{post.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {post.author} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 border font-medium ${
                    post.published
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>

                <Link
                  href={`/admin/dashboard/blog/${post.id}/edit`}
                  className="text-xs text-navy hover:underline"
                >
                  Edit
                </Link>

                <form
                  action={async () => {
                    "use server";
                    await deletePost(post.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
