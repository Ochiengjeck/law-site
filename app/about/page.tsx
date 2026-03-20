import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SW Law Advocates LLP — our philosophy, maritime expertise, and commitment to the Blue Economy.",
};

export default async function AboutPage() {
  const s = await getPageSettings("about");

  const blueEconomy = [1, 2, 3].map((i) => ({
    heading: s[`blueEconomy.${i}.heading`] ?? "",
    body: s[`blueEconomy.${i}.body`] ?? "",
    imageUrl: s[`blueEconomy.${i}.imageUrl`] ?? "",
  }));

  const values = [1, 2, 3, 4].map((i) => ({
    icon: s[`value.${i}.icon`] ?? "",
    title: s[`value.${i}.title`] ?? "",
    description: s[`value.${i}.description`] ?? "",
  }));

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <PageHero
          imageUrl={s["hero.imageUrl"]}
          category="About the Firm"
          title={s["hero.title"]}
          subtitle={s["hero.subtitle"]}
        />

        {/* ─── Mission ──────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-gold" />
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                  Our Philosophy
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-navy mb-6 leading-tight">
                {s["mission.title"]}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">{s["mission.text1"]}</p>
              <p className="text-gray-600 leading-relaxed">{s["mission.text2"]}</p>
            </div>

            <div className="relative">
              <div className="border-l-4 border-gold pl-4">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={s["mission.imageUrl"]}
                    alt="SW Law Advocates LLP office"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold/10 -z-10" />
            </div>
          </div>
        </section>

        {/* ─── Pull Quote ───────────────────────────────────────────── */}
        <section className="py-12 px-6 bg-light-gray">
          <div className="max-w-4xl mx-auto">
            <div className="text-7xl text-gold/10 font-black leading-none mb-2 select-none" aria-hidden="true">
              &ldquo;
            </div>
            <blockquote className="border-l-4 border-gold pl-8 -mt-6">
              <p className="text-xl md:text-2xl text-navy font-black leading-relaxed">
                {s["quote"]}
              </p>
            </blockquote>
          </div>
        </section>

        {/* ─── Blue Economy ─────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-gold" />
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                  Focus Area
                </p>
              </div>
              <h2 className="text-3xl font-black text-navy mb-3">{s["blueEconomy.title"]}</h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl">
                {s["blueEconomy.subtitle"]}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {blueEconomy.map((item, i) => (
                <div
                  key={item.heading}
                  className="border border-gray-100 hover:border-gold/30 transition-colors group overflow-hidden"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.heading}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                    <span className="absolute top-3 right-3 text-4xl font-black text-gold/20 leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-navy mb-2">{item.heading}</h3>
                    <div className="w-0 group-hover:w-full h-px bg-gold transition-all duration-500 mb-3" />
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Values ───────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-navy">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-gold" />
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                  What We Stand For
                </p>
              </div>
              <h2 className="text-3xl font-black text-white">Our Values</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <div key={value.title} className="border-t-2 border-gold/40 pt-5">
                  <div className="text-2xl mb-3">{value.icon}</div>
                  <h3 className="font-black text-white text-base mb-2">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-navy-dark text-center">
          <div className="max-w-xl mx-auto border border-white/15 p-10">
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              Work with a firm that shares your values
            </h2>
            <div className="w-10 h-px bg-gold mx-auto mb-5" />
            <p className="text-white/60 text-sm mb-8">
              Contact us to discuss how we can assist with your legal needs.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-bold px-8 py-3 text-xs tracking-widest uppercase hover:bg-gold-dark transition-colors inline-block"
            >
              Contact Us Today
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
