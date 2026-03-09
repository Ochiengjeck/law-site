import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero with post title overlaid */}
        <section className="relative h-[60vh] min-h-80 flex items-end">
          <Image
            src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/1920/800`}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 pb-12 w-full">
            <Link
              href="/blog"
              className="text-gold text-sm hover:underline mb-5 inline-block"
            >
              ← Back to Insights
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              &middot; {post.author}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            {post.excerpt && (
              <p className="text-xl text-gray-500 leading-relaxed mb-10 font-medium border-l-4 border-gold pl-5">
                {post.excerpt}
              </p>
            )}
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-14 px-6 bg-light-gray text-center">
          <div className="max-w-xl mx-auto">
            <p className="text-gray-500 mb-5 text-sm">
              Have a legal question related to this topic?
            </p>
            <Link
              href="/contact"
              className="bg-navy text-white font-semibold px-8 py-3 rounded hover:bg-navy-dark transition-colors inline-block text-sm"
            >
              Contact SW Law LLP
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
