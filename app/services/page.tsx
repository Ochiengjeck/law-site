import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SW Law LLP's legal services: Maritime & Shipping Law, ESG Compliance, Corporate Law, Conveyancing, and more.",
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
        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6">
          <Image
            src={s["hero.imageUrl"]}
            alt="Services hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
              What We Do
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {s["hero.title"]}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{s["hero.subtitle"]}</p>
          </div>
        </section>

        {/* Main practice areas — alternating layout */}
        {mainServices.map((area, i) => (
          <section
            key={area.id}
            id={area.slug || undefined}
            className={`py-24 px-6 scroll-mt-20 ${i % 2 === 0 ? "bg-white" : "bg-light-gray"}`}
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div
                className={`relative h-96 rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-2" : ""}`}
              >
                <Image
                  src={
                    area.imageUrl ||
                    `https://picsum.photos/seed/sw-${area.slug || area.id}/900/700`
                  }
                  alt={area.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
              </div>

              <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                {area.badge && (
                  <span className="inline-block text-xs text-gold font-semibold tracking-widest uppercase mb-3">
                    {area.badge}
                  </span>
                )}
                <h2 className="text-3xl font-bold text-navy mb-5">{area.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{area.description}</p>
                {area.items && (
                  <ul className="grid grid-cols-1 gap-2.5">
                    {area.items.split("\n").filter(Boolean).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <span className="text-gold mt-0.5 flex-shrink-0">✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        ))}

        {/* Other practice areas */}
        {otherServices.length > 0 && (
          <section
            id="other"
            className={`py-24 px-6 bg-navy scroll-mt-20 ${mainServices.length % 2 === 0 ? "" : ""}`}
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                  Additional Services
                </p>
                <h2 className="text-3xl font-bold text-white mb-4">Other Practice Areas</h2>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
                {otherServices.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-gold/40 transition-colors"
                  >
                    <h3 className="font-bold text-white mb-2 text-sm">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-4">Need legal assistance?</h2>
            <p className="text-gray-500 mb-8">
              Contact us to discuss your matter with one of our specialists.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-semibold px-8 py-3 rounded hover:bg-gold-dark transition-colors inline-block"
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
