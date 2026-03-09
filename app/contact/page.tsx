import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getPageSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Submit a legal enquiry to SW Law LLP. We will respond promptly to discuss your needs.",
};

export default async function ContactPage() {
  const s = await getPageSettings("contact");
  const officeHoursLines = s["officeHours"].split("\n");

  return (
    <>
      <Navbar />
      <main>
        <div className="flex flex-col md:flex-row min-h-screen">
          {/* Left: Form */}
          <div className="flex-1 px-8 py-24 md:py-36 md:px-14 lg:px-20">
            <div className="max-w-lg mx-auto md:mx-0 md:ml-auto">
              <p className="text-gold text-xs tracking-widest uppercase mb-3 font-medium">
                Get in Touch
              </p>
              <h1 className="text-3xl font-bold text-navy mb-2">Contact SW Law LLP</h1>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                Submit your enquiry and a member of our team will respond promptly. All
                communications are treated with strict confidentiality.
              </p>

              <ContactForm />

              <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-navy mb-1 text-sm">Email</h3>
                  <p className="text-gray-500 text-sm">{s["email"]}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-1 text-sm">Office Hours</h3>
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

              <div className="mt-6 bg-light-gray rounded-lg p-4 border-l-4 border-gold">
                <p className="text-sm text-gray-600 leading-relaxed">
                  <strong className="text-navy">Confidentiality Notice:</strong> All information
                  submitted through this form is treated as strictly confidential and subject to
                  legal professional privilege.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Image with overlay */}
          <div className="relative hidden md:block w-full md:w-5/12 lg:w-1/2">
            <Image
              src={s["imageUrl"]}
              alt="SW Law LLP office"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/75 flex flex-col items-center justify-center p-12 text-white text-center">
              <p className="text-gold text-xs tracking-widest uppercase mb-6 font-medium">
                SW Law LLP
              </p>
              <h2 className="text-3xl font-bold leading-snug mb-6">{s["tagline"]}</h2>
              <p className="text-white/60 text-sm">Nairobi, Kenya</p>
              <div className="mt-10 w-12 h-0.5 bg-gold" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
