import BlogPostForm from "@/components/BlogPostForm";

export const metadata = { title: "New Blog Post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
