import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogPostForm from "@/components/BlogPostForm";

export const metadata = { title: "Edit Blog Post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id: parseInt(id) },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
