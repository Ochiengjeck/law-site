import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Legal insights and commentary from SW Law LLP on maritime law, ESG compliance, and regulatory developments in Kenya.",
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
        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6">
          <Image
            src={s["hero.imageUrl"]}
            alt="Insights hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
              Thought Leadership
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {s["hero.title"]}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{s["hero.subtitle"]}</p>
          </div>
        </section>

        {/* Posts */}
        <section className="py-16 px-6 bg-light-gray min-h-[50vh]">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">No insights published yet.</p>
                <p className="text-sm mt-2">Check back soon.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Featured post — full width */}
                {featured && (
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group relative block rounded-2xl overflow-hidden h-80 md:h-96"
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
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <span className="inline-block bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                        Featured
                      </span>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 max-w-2xl">
                          {featured.excerpt}
                        </p>
                      )}
                      <p className="text-gray-400 text-xs mt-3">
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

                {/* Remaining posts — 3-col grid */}
                {rest.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    {rest.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group border border-gray-100"
                      >
                        <div className="relative h-44 overflow-hidden">
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
                        <div className="p-6">
                          <p className="text-xs text-gray-400 mb-2">
                            {new Date(post.createdAt).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}{" "}
                            &middot; {post.author}
                          </p>
                          <h3 className="text-navy font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <p className="text-gold text-sm font-medium mt-4">Read more →</p>
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
