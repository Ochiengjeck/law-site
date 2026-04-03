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
          className="bg-navy-dark text-white text-xs font-medium px-5 py-2.5 hover:opacity-90 transition-opacity tracking-widest uppercase"
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 flex flex-col overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-100 flex-shrink-0">
                {post.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                )}
                <span
                  className={`absolute top-2 right-2 text-xs px-2 py-0.5 border font-medium ${
                    post.published
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-4">
                <p className="font-semibold text-navy leading-snug line-clamp-2">{post.title}</p>
                {post.excerpt && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
                )}
                <p className="mt-auto pt-3 text-xs text-gray-400">
                  {post.author} · {new Date(post.createdAt).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 border-t border-gray-100 px-4 py-2.5">
                <Link
                  href={`/admin/dashboard/blog/${post.id}/edit`}
                  className="text-xs font-medium text-navy hover:underline"
                >
                  Edit
                </Link>
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="text-xs text-gray-400 hover:text-navy hover:underline"
                >
                  View
                </Link>
                <form
                  className="ml-auto"
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
