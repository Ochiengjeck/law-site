import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  const [heroLine1, heroLine2] = s["hero.title"].split("\n");
  const [aboutLine1, aboutLine2] = s["about.title"].split("\n");
  const stats = [1, 2, 3, 4].map((i) => ({
    value: s[`stat.${i}.value`] ?? "",
    label: s[`stat.${i}.label`] ?? "",
  }));

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center">
          <Image
            src={s["hero.imageUrl"]}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/20" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 w-full">
            <span className="inline-block bg-gold/20 border border-gold/60 text-gold text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6 font-medium">
              {s["hero.badge"]}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-3xl">
              {heroLine1}
              {heroLine2 && (
                <>
                  <br />
                  <span className="text-gold">{heroLine2}</span>
                </>
              )}
            </h1>
            <p className="text-lg text-white/75 max-w-xl mb-10 leading-relaxed">
              {s["hero.subtitle"]}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-gold text-navy font-semibold px-8 py-4 rounded hover:bg-gold-dark transition-colors inline-block text-center"
              >
                {s["hero.cta1"]}
              </Link>
              <Link
                href="/services"
                className="border border-white/50 text-white font-semibold px-8 py-4 rounded hover:bg-white/10 transition-colors inline-block text-center"
              >
                {s["hero.cta2"]}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-white border-b border-gray-100 py-10 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* About split */}
        <section className="py-24 px-6 bg-light-gray">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
                About the Firm
              </p>
              <h2 className="text-4xl font-bold text-navy mb-6 leading-tight">
                {aboutLine1}
                {aboutLine2 && (
                  <>
                    <br />
                    {aboutLine2}
                  </>
                )}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                {s["about.text1"]}
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">{s["about.text2"]}</p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-navy font-semibold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
              >
                Learn more about our firm →
              </Link>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden ring-4 ring-gold/25">
                <Image
                  src={s["about.imageUrl"]}
                  alt="About SW Law LLP"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/15 rounded-2xl -z-10" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-navy/10 rounded-2xl -z-10" />
            </div>
          </div>
        </section>

        {/* Services */}
        {services.length > 0 && (
          <section className="py-24 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                  What We Do
                </p>
                <h2 className="text-4xl font-bold text-navy mb-4">Practice Areas</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Specialised legal services delivered by sector experts
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services${service.slug ? `#${service.slug}` : ""}`}
                    className="group relative h-72 rounded-xl overflow-hidden block"
                  >
                    <Image
                      src={
                        service.imageUrl ||
                        `https://picsum.photos/seed/sw-${service.slug || service.id}/600/500`
                      }
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-sm mb-1.5 group-hover:text-gold transition-colors leading-snug">
                        {service.title}
                      </h3>
                      <p className="text-white/65 text-xs leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/services"
                  className="text-navy font-semibold border-2 border-navy px-8 py-3 rounded hover:bg-navy hover:text-white transition-colors inline-block"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Partners */}
        {partners.length > 0 && (
          <section className="py-24 px-6 bg-navy">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                  Our Team
                </p>
                <h2 className="text-4xl font-bold text-white mb-4">Meet Our Partners</h2>
                <p className="text-gray-300 max-w-xl mx-auto">
                  Seasoned legal professionals with deep sector expertise
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
                {partners.map((partner) => (
                  <div key={partner.id} className="text-center">
                    <div className="relative w-36 h-36 rounded-full overflow-hidden mx-auto mb-5 ring-4 ring-gold/40">
                      <Image
                        src={
                          partner.imageUrl ||
                          `https://picsum.photos/seed/sw-partner-${partner.id}/300/300`
                        }
                        alt={partner.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                    <p className="text-gold text-sm font-medium mt-1 mb-2">{partner.role}</p>
                    <p className="text-gray-400 text-sm">
                      {partner.expertise.split("\n")[0]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/partners"
                  className="border border-gold text-gold px-8 py-3 rounded hover:bg-gold hover:text-navy transition-colors font-semibold inline-block"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Blog preview */}
        {recentPosts.length > 0 && (
          <section className="py-24 px-6 bg-light-gray">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                  Thought Leadership
                </p>
                <h2 className="text-4xl font-bold text-navy mb-4">Latest Insights</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Commentary and analysis from the SW Law LLP team
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
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
                      <p className="text-xs text-gray-400 mb-3">
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
              <div className="text-center mt-10">
                <Link
                  href="/blog"
                  className="text-navy font-semibold border-b-2 border-gold pb-0.5 hover:text-gold transition-colors"
                >
                  View all insights →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative py-32 px-6">
          <Image
            src={s["cta.imageUrl"]}
            alt="CTA background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-5">{s["cta.title"]}</h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">{s["cta.subtitle"]}</p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-semibold px-10 py-4 rounded hover:bg-gold-dark transition-colors inline-block"
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
