import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Submit a legal enquiry to SW Law Advocates LLP. We will respond promptly to discuss your needs.",
};

export default async function ContactPage() {
  const s = await getPageSettings("contact");
  const officeHoursLines = s["officeHours"].split("\n");

  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col md:flex-row min-h-screen">

          {/* ─── Left: Form ───────────────────────────────────────────── */}
          <div className="flex-1 px-8 py-20 md:py-28 md:px-14 lg:px-20">
            <div className="max-w-lg mx-auto md:mx-0 md:ml-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-gold" />
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                  Get in Touch
                </p>
              </div>

              <h1 className="text-3xl font-black text-navy mb-2">Contact SW Law Advocates LLP</h1>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                Submit your enquiry and a member of our team will respond promptly. All
                communications are treated with strict confidentiality.
              </p>

              <ContactForm />

              <div className="mt-8 pt-6 border-t border-gold/30 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-black text-navy mb-1 text-xs uppercase tracking-widest">Email</h3>
                  <p className="text-gray-500 text-sm">{s["email"]}</p>
                </div>
                <div>
                  <h3 className="font-black text-navy mb-1 text-xs uppercase tracking-widest">Office Hours</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {officeHoursLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < officeHoursLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-l-4 border-gold bg-light-gray p-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-navy">Confidentiality Notice:</strong> All information
                  submitted through this form is treated as strictly confidential and subject to
                  legal professional privilege.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Right: Image ─────────────────────────────────────────── */}
          <div className="relative hidden md:block w-full md:w-5/12 lg:w-1/2">
            <Image
              src={s["imageUrl"]}
              alt="SW Law Advocates LLP office"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-dark/92 to-navy/80 flex flex-col items-center justify-center p-12 text-white text-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-gold" />
                <p className="text-gold text-xs tracking-[0.4em] uppercase font-medium">
                  SW Law Advocates LLP
                </p>
                <div className="w-6 h-px bg-gold" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-snug mb-4">{s["tagline"]}</h2>
              <div className="w-10 h-px bg-gold mb-4" />
              <p className="text-white/50 text-xs tracking-widest uppercase">Nairobi, Kenya</p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
