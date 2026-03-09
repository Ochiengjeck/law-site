import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Meet the partners of SW Law LLP — experienced legal professionals in maritime law, ESG, and corporate practice.",
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
        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6">
          <Image
            src={s["hero.imageUrl"]}
            alt="Partners hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
              Our Team
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {s["hero.title"]}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{s["hero.subtitle"]}</p>
          </div>
        </section>

        {/* Partner profiles */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto space-y-12">
            {partners.map((partner, i) => {
              const bioParas = partner.bio.split("\n\n").filter(Boolean);
              const expertiseItems = partner.expertise.split("\n").filter(Boolean);
              const educationItems = partner.education.split("\n").filter(Boolean);

              return (
                <div
                  key={partner.id}
                  className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col md:flex-row ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Photo */}
                  <div className="relative w-full md:w-72 flex-shrink-0 min-h-80">
                    <Image
                      src={
                        partner.imageUrl ||
                        `https://picsum.photos/seed/sw-partner-${partner.id}/500/700`
                      }
                      alt={partner.name}
                      fill
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
                  </div>

                  {/* Bio */}
                  <div className="flex-1 p-8 md:p-10">
                    {expertiseItems.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {expertiseItems.map((area) => (
                          <span
                            key={area}
                            className="text-xs bg-light-gray text-navy px-3 py-1 rounded-full font-medium border border-gray-200"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="text-2xl font-bold text-navy mb-1">{partner.name}</h2>
                    <p className="text-gold font-medium mb-5">{partner.role}</p>

                    <div className="space-y-3 mb-8">
                      {bioParas.map((para, j) => (
                        <p key={j} className="text-gray-600 leading-relaxed text-sm">
                          {para}
                        </p>
                      ))}
                    </div>

                    {educationItems.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-navy mb-3 text-xs uppercase tracking-widest">
                          Education &amp; Qualifications
                        </h3>
                        <ul className="space-y-1.5">
                          {educationItems.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <span className="text-gold flex-shrink-0">✦</span>
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

        {/* CTA */}
        <section className="py-20 px-6 bg-navy text-white text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Speak with a Partner</h2>
            <p className="text-gray-300 mb-8">
              We welcome enquiries from prospective clients and are happy to discuss how we can
              assist with your legal needs.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-semibold px-8 py-3 rounded hover:bg-gold-dark transition-colors inline-block"
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
