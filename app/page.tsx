import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export default async function Home() {
  const [s, partners, services, recentPosts] = await Promise.all([
    getPageSettings("home"),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { category: "main" },
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const [heroLine1] = s["hero.title"].split("\n");
  const [aboutLine1, aboutLine2] = s["about.title"].split("\n");
  // const stats = [1, 2, 3, 4].map((i) => ({
  //   value: s[`stat.${i}.value`] ?? "",
  //   label: s[`stat.${i}.label`] ?? "",
  // }));

  const [featuredPost, ...sidePosts] = recentPosts;

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <HeroSection
          imageUrl={s["hero.imageUrl"]}
          badge={s["hero.badge"]}
          line1={heroLine1}
          typingWords={services.map((sv) => sv.title)}
          subtitle={s["hero.subtitle"]}
          cta1={s["hero.cta1"]}
          cta2={s["hero.cta2"]}
          // stats={stats}
        />

        {/* ─── About ────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-light-gray border-t-4 border-gold">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* Decorative quote mark */}
              <div className="absolute -top-8 -left-4 text-[10rem] leading-none text-gold/10 font-black select-none pointer-events-none">
                &ldquo;
              </div>

              {/* Rotated section label */}
              <div className="flex items-start gap-6">
                <span
                  className="hidden md:block text-gold text-xs tracking-[0.3em] uppercase font-medium shrink-0 mt-1"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  About the Firm
                </span>

                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-navy mb-6 leading-tight">
                    {aboutLine1}
                    {aboutLine2 && (
                      <>
                        <br />
                        {aboutLine2}
                      </>
                    )}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {s["about.text1"]}
                  </p>
                  <hr className="border-none h-px bg-gold/40 mb-6" />
                  <p className="text-gray-500 leading-relaxed mb-10">{s["about.text2"]}</p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-3 text-navy font-bold text-sm tracking-wide border-b-2 border-gold pb-1 hover:text-gold transition-colors group"
                  >
                    Learn more about our firm
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Image with architectural border treatment */}
            <div className="relative">
              <div className="border-l-4 border-gold pl-4">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={s["about.imageUrl"]}
                    alt="About SW Law Advocates LLP"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Offset decorative block */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold/10 -z-10" />
            </div>
          </div>
        </section>

        {/* ─── Services ─────────────────────────────────────────────── */}
        {services.length > 0 && (
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3 font-medium">
                    What We Do
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-navy leading-tight">
                    Practice Areas
                  </h2>
                </div>
                <Link
                  href="/services"
                  className="hidden md:inline-flex items-center gap-2 text-sm text-navy font-semibold border-b border-navy/30 pb-0.5 hover:border-gold hover:text-gold transition-colors group"
                >
                  View all
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service, i) => (
                  <Link
                    key={service.id}
                    href={`/services${service.slug ? `#${service.slug}` : ""}`}
                    className="group relative h-64 overflow-hidden block border border-white/5"
                  >
                    <Image
                      src={
                        service.imageUrl ||
                        `https://picsum.photos/seed/sw-${service.slug || service.id}/600/500`
                      }
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-navy-dark/70 to-transparent" />

                    {/* Large pale numeral */}
                    <span className="absolute top-4 right-4 text-5xl font-black text-gold/20 select-none leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-base mb-1.5 leading-snug">
                        {service.title}
                      </h3>
                      {/* Animated gold underline */}
                      <div className="w-0 group-hover:w-full h-px bg-gold transition-all duration-500 mb-2" />
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10 md:hidden">
                <Link
                  href="/services"
                  className="text-navy font-semibold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors text-sm tracking-wide"
                >
                  View All Services →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ─── Partners ─────────────────────────────────────────────── */}
        {partners.length > 0 && (
          <section className="py-16 px-6 bg-navy">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10">
                <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3 font-medium">
                  Our Team
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  Meet Our Partners
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex border border-white/10 hover:border-gold/30 transition-colors duration-300 group"
                  >
                    {/* Portrait image */}
                    <div className="relative w-32 shrink-0 overflow-hidden">
                      <Image
                        src={
                          partner.imageUrl ||
                          `https://picsum.photos/seed/sw-partner-${partner.id}/300/400`
                        }
                        alt={partner.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Gold vertical divider */}
                    <div className="w-px bg-gold/30 shrink-0 mx-4 self-stretch" />

                    {/* Text */}
                    <div className="py-5 pr-5 flex flex-col justify-center">
                      <h3 className="text-xl font-black text-white mb-1">{partner.name}</h3>
                      <p className="text-gold text-xs tracking-widest uppercase font-medium mb-4">
                        {partner.role}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {partner.expertise.split("\n")[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 border border-gold text-gold px-6 py-2.5 text-sm font-semibold tracking-wide hover:bg-gold hover:text-navy transition-colors group"
                >
                  Meet the Full Team
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ─── Blog Preview ─────────────────────────────────────────── */}
        {recentPosts.length > 0 && (
          <section className="py-16 px-6 bg-light-gray">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-gold text-xs tracking-[0.25em] uppercase mb-3 font-medium">
                    Thought Leadership
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black text-navy leading-tight">
                    Latest Insights
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden md:inline-flex items-center gap-2 text-sm text-navy font-semibold border-b border-navy/30 pb-0.5 hover:border-gold hover:text-gold transition-colors group"
                >
                  All insights
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Featured post — spans 2 columns */}
                {featuredPost && (
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="md:col-span-2 bg-white border-l-4 border-gold overflow-hidden hover:-translate-y-0.5 transition-transform duration-300 group block"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={featuredPost.imageUrl || `https://picsum.photos/seed/${featuredPost.slug}/800/500`}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-gray-400 mb-3">
                        <span className="text-gold">•</span>{" "}
                        {new Date(featuredPost.createdAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        &middot; {featuredPost.author}
                      </p>
                      <h3 className="text-navy font-black text-lg mb-3 group-hover:text-gold transition-colors leading-snug line-clamp-2">
                        {featuredPost.title}
                      </h3>
                      {featuredPost.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <span className="text-gold text-sm font-semibold tracking-wide">Read more →</span>
                    </div>
                  </Link>
                )}

                {/* Side stack — 2 smaller posts */}
                {sidePosts.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {sidePosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="bg-white overflow-hidden hover:-translate-y-0.5 transition-transform duration-300 group flex-1 flex flex-col block"
                      >
                        <div className="relative h-28 overflow-hidden">
                          <Image
                            src={post.imageUrl || `https://picsum.photos/seed/${post.slug}/600/400`}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <p className="text-xs text-gray-400 mb-2">
                            <span className="text-gold">•</span>{" "}
                            {new Date(post.createdAt).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="text-navy font-bold text-sm group-hover:text-gold transition-colors leading-snug line-clamp-2">
                            {post.title}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center mt-10 md:hidden">
                <Link
                  href="/blog"
                  className="text-navy font-semibold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors text-sm tracking-wide"
                >
                  View all insights →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="relative py-20 px-6">
          <Image
            src={s["cta.imageUrl"]}
            alt="CTA background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/96 to-navy/88" />
          <div className="relative z-10 max-w-2xl mx-auto text-center text-white border border-white/20 p-8 md:p-12">
            {/* Gold rule above */}
            <div className="w-12 h-px bg-gold mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-black mb-5 leading-tight">{s["cta.title"]}</h2>
            {/* Gold rule below heading */}
            <div className="w-12 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/70 text-lg mb-8 leading-relaxed">{s["cta.subtitle"]}</p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-bold px-12 py-4 text-sm tracking-widest uppercase hover:bg-gold-dark transition-colors inline-block"
            >
              Get in Touch
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
