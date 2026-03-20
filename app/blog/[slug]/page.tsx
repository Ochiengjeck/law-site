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

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <section className="relative pt-28 pb-12 px-6 overflow-hidden">
          <Image
            src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/1920/800`}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/92 via-navy/75 to-navy/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-transparent to-transparent" />

          {/* Decorative ring */}
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-gold/8 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gold/80 hover:text-gold text-xs tracking-widest uppercase font-medium mb-6 transition-colors group"
            >
              <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Insights
            </Link>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
              {post.title}
            </h1>

            {/* Draw-in gold line */}
            <div className="animate-draw-line h-px bg-gold w-32 mb-4" />

            <p className="text-gray-400 text-sm">
              <span className="text-gold">•</span>{" "}
              {new Date(post.createdAt).toLocaleDateString("en-KE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              &middot; {post.author}
            </p>
          </div>
        </section>

        {/* ─── Content ──────────────────────────────────────────────── */}
        <section className="py-12 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            {post.excerpt && (
              <p className="text-lg text-gray-600 leading-relaxed mb-10 font-medium border-l-4 border-gold pl-5">
                {post.excerpt}
              </p>
            )}
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </section>

        {/* ─── Footer CTA ───────────────────────────────────────────── */}
        <section className="py-14 px-6 bg-navy-dark text-center">
          <div className="max-w-md mx-auto border border-white/15 p-8">
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Have a legal question related to this topic?
            </p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-bold px-8 py-3 text-xs tracking-widest uppercase hover:bg-gold-dark transition-colors inline-block"
            >
              Contact SW Law Advocates LLP
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
