import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SW Law Advocates LLP's legal services: Maritime & Shipping Law, ESG Compliance, Corporate Law, Conveyancing, and more.",
};

export default async function ServicesPage() {
  const [s, mainServices, otherServices] = await Promise.all([
    getPageSettings("services"),
    prisma.service.findMany({
      where: { category: "main" },
      orderBy: { order: "asc" },
    }),
    prisma.service.findMany({
      where: { category: "other" },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <PageHero
          imageUrl={s["hero.imageUrl"]}
          category="What We Do"
          title={s["hero.title"]}
          subtitle={s["hero.subtitle"]}
        />

        {/* ─── Main Practice Areas ───────────────────────────────────── */}
        {mainServices.map((area, i) => (
          <section
            key={area.id}
            id={area.slug || undefined}
            className={`py-16 px-6 scroll-mt-20 ${i % 2 === 0 ? "bg-white" : "bg-light-gray"}`}
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className={`relative ${i % 2 !== 0 ? "md:order-2" : ""}`}>
                <div className="border-l-4 border-gold pl-4">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={
                        area.imageUrl ||
                        `https://picsum.photos/seed/sw-${area.slug || area.id}/900/700`
                      }
                      alt={area.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                {area.badge && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-px bg-gold" />
                    <span className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                      {area.badge}
                    </span>
                  </div>
                )}
                <h2 className="text-2xl md:text-3xl font-black text-navy mb-5 leading-tight">
                  {area.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-7">{area.description}</p>
                {area.items && (
                  <ul className="grid grid-cols-1 gap-3">
                    {area.items.split("\n").filter(Boolean).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="w-3 h-px bg-gold mt-2 shrink-0 block" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* ─── Other Practice Areas ─────────────────────────────────── */}
        {otherServices.length > 0 && (
          <section id="other" className="py-16 px-6 bg-navy scroll-mt-20">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px bg-gold" />
                  <p className="text-white/60 text-xs tracking-[0.4em] uppercase font-medium">
                    Additional Services
                  </p>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">Other Practice Areas</h2>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {otherServices.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 p-5 hover:border-gold/40 transition-colors"
                  >
                    <h3 className="font-black text-white mb-2 text-sm">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-navy-dark text-center">
          <div className="max-w-xl mx-auto border border-white/15 p-10">
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              Need legal assistance?
            </h2>
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/60 text-sm mb-8">
              Contact us to discuss your matter with one of our specialists.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-gray-900 font-bold px-8 py-3 text-xs tracking-widest uppercase hover:bg-gold-dark transition-colors inline-block"
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
