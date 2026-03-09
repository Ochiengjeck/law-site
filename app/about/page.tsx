import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SW Law LLP — our philosophy, maritime expertise, and commitment to the Blue Economy.",
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
        {/* Hero */}
        <section className="relative pt-36 pb-24 px-6">
          <Image
            src={s["hero.imageUrl"]}
            alt="About hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
              About the Firm
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {s["hero.title"]}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">{s["hero.subtitle"]}</p>
          </div>
        </section>

        {/* Mission: 2-col text + image */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-xs tracking-widest uppercase mb-4 font-medium">
                Our Philosophy
              </p>
              <h2 className="text-3xl font-bold text-navy mb-6">{s["mission.title"]}</h2>
              <p className="text-gray-600 leading-relaxed mb-5">{s["mission.text1"]}</p>
              <p className="text-gray-600 leading-relaxed">{s["mission.text2"]}</p>
            </div>
            <div className="relative">
              <div className="relative h-80 rounded-2xl overflow-hidden ring-4 ring-gold/25">
                <Image
                  src={s["mission.imageUrl"]}
                  alt="SW Law LLP office"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-gold/15 rounded-2xl -z-10" />
            </div>
          </div>
        </section>

        {/* Pull quote */}
        <section className="py-16 px-6 bg-light-gray">
          <div className="max-w-4xl mx-auto">
            <blockquote className="border-l-4 border-gold pl-8 py-2">
              <p className="text-2xl md:text-3xl text-navy font-medium italic leading-relaxed">
                &ldquo;{s["quote"]}&rdquo;
              </p>
            </blockquote>
          </div>
        </section>

        {/* Blue Economy */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                Focus Area
              </p>
              <h2 className="text-3xl font-bold text-navy mb-4">{s["blueEconomy.title"]}</h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                {s["blueEconomy.subtitle"]}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {blueEconomy.map((item) => (
                <div
                  key={item.heading}
                  className="rounded-xl overflow-hidden border border-gray-100 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.heading}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-navy mb-2">{item.heading}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 px-6 bg-navy">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                What We Stand For
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="text-4xl mb-4 text-gold">{value.icon}</div>
                  <h3 className="font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-white text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Work with a firm that shares your values
            </h2>
            <p className="text-gray-500 mb-8">
              Contact us to discuss how we can assist with your legal needs.
            </p>
            <Link
              href="/contact"
              className="bg-gold text-navy font-semibold px-8 py-3 rounded hover:bg-gold-dark transition-colors inline-block"
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
