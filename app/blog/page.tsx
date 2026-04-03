import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Legal insights and commentary from SW Law Advocates LLP on maritime law, ESG compliance, and regulatory developments in Kenya.",
};

export default async function BlogPage() {
  const [s, posts] = await Promise.all([
    getPageSettings("blog"),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <PageHero
          imageUrl={s["hero.imageUrl"]}
          category="Thought Leadership"
          title={s["hero.title"]}
          subtitle={s["hero.subtitle"]}
        />

        {/* ─── Posts ────────────────────────────────────────────────── */}
        <section className="py-14 px-6 bg-light-gray min-h-[50vh]">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg font-black text-navy">No insights published yet.</p>
                <p className="text-sm mt-2">Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-5">

                {/* Featured post */}
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group relative block overflow-hidden h-64 md:h-80"
                  >
                    <Image
                      src={
                        featured.imageUrl ||
                        `https://picsum.photos/seed/${featured.slug}/1200/600`
                      }
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <span className="inline-block bg-gold text-gray-900 text-xs font-bold px-3 py-1 tracking-widest uppercase mb-3">
                        Featured
                      </span>
                      <h2 className="text-xl md:text-2xl font-black text-white mb-2 group-hover:text-gold transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 max-w-2xl">
                          {featured.excerpt}
                        </p>
                      )}
                      <p className="text-white/65 text-xs mt-3">
                        <span className="text-gold">•</span>{" "}
                        {new Date(featured.createdAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        &middot; {featured.author}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Remaining posts */}
                {rest.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {rest.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="bg-white border border-gray-100 hover:border-gold/20 hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden block"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <Image
                            src={
                              post.imageUrl ||
                              `https://picsum.photos/seed/${post.slug}/600/400`
                            }
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-gray-400 mb-2">
                            <span className="text-gold">•</span>{" "}
                            {new Date(post.createdAt).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            &middot; {post.author}
                          </p>
                          <h3 className="text-navy font-black mb-2 group-hover:text-gold transition-colors line-clamp-2 leading-snug text-sm">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <p className="text-gold text-xs font-semibold mt-4 tracking-wide">Read more →</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
