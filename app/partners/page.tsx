import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Meet the partners of SW Law Advocates LLP — experienced legal professionals in maritime law, ESG, and corporate practice.",
};

export default async function PartnersPage() {
  const [s, partners] = await Promise.all([
    getPageSettings("partners"),
    prisma.partner.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <PageHero
          imageUrl={s["hero.imageUrl"]}
          category="Our Team"
          title={s["hero.title"]}
          subtitle={s["hero.subtitle"]}
        />

        {/* ─── Partner Profiles ─────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-8">
            {partners.map((partner, i) => {
              const bioParas = partner.bio.split("\n\n").filter(Boolean);
              const expertiseItems = partner.expertise.split("\n").filter(Boolean);
              const educationItems = partner.education.split("\n").filter(Boolean);

              return (
                <div
                  key={partner.id}
                  className={`border border-gray-100 hover:border-gold/30 transition-colors overflow-hidden flex flex-col md:flex-row ${
                    i % 2 !== 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Photo */}
                  <div className="relative w-full md:w-64 flex-shrink-0 min-h-80">
                    <Image
                      src={
                        partner.imageUrl ||
                        `https://picsum.photos/seed/sw-partner-${partner.id}/500/700`
                      }
                      alt={partner.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex-1 p-7 md:p-8">
                    {expertiseItems.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {expertiseItems.map((area) => (
                          <span
                            key={area}
                            className="text-xs border border-navy/20 text-navy px-3 py-1 font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-xl md:text-2xl font-black text-navy mb-1">
                      {partner.name}
                    </h2>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-6 h-px bg-gold" />
                      <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
                        {partner.role}
                      </p>
                    </div>

                    <div className="space-y-3 mb-7">
                      {bioParas.map((para, j) => (
                        <p key={j} className="text-gray-600 leading-relaxed text-sm">
                          {para}
                        </p>
                      ))}
                    </div>

                    {educationItems.length > 0 && (
                      <div>
                        <h3 className="font-black text-navy mb-3 text-xs uppercase tracking-widest">
                          Education &amp; Qualifications
                        </h3>
                        <ul className="space-y-2">
                          {educationItems.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="w-3 h-px bg-gold mt-2 shrink-0 block" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-navy-dark text-center">
          <div className="max-w-xl mx-auto border border-white/15 p-10">
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              Speak with a Partner
            </h2>
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/60 text-sm mb-8">
              We welcome enquiries from prospective clients and are happy to discuss how we can
              assist with your legal needs.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-gray-900 font-bold px-8 py-3 text-xs tracking-widest uppercase hover:bg-gold-dark transition-colors inline-block"
            >
              Contact the Firm
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
