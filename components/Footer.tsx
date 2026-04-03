import Link from "next/link";
import { getPageSettings } from "@/lib/siteSettings";

export default async function Footer() {
  const s = await getPageSettings("site");
  const logoUrl = s["logoUrl"];

  return (
    <footer className="bg-navy-dark text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="SW Law Advocates LLP"
              className="h-16 w-auto object-contain mb-4"
            />
          )}
          <h3 className="text-xl font-bold mb-4">SW Law Advocates LLP</h3>
          <p className="text-white/65 text-sm leading-relaxed max-w-xs mb-6">
            Premier law firm specialising in maritime law, ESG
            compliance, corporate and commercial law in Nairobi, Kenya.
          </p>
          <p className="text-white/45 text-xs">
            info@swlawllp.co.ke
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-5 text-gold text-xs tracking-widest uppercase">
            Practice Areas
          </h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li>
              <Link
                href="/services#maritime"
                className="hover:text-white transition-colors"
              >
                Maritime &amp; Shipping
              </Link>
            </li>
            <li>
              <Link
                href="/services#esg"
                className="hover:text-white transition-colors"
              >
                ESG Compliance
              </Link>
            </li>
            <li>
              <Link
                href="/services#corporate"
                className="hover:text-white transition-colors"
              >
                Corporate Law
              </Link>
            </li>
            <li>
              <Link
                href="/services#conveyancing"
                className="hover:text-white transition-colors"
              >
                Conveyancing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-5 text-gold text-xs tracking-widest uppercase">
            Firm
          </h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/partners"
                className="hover:text-white transition-colors"
              >
                Partners
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Insights
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-white/45">
          <p>
            &copy; {new Date().getFullYear()} SW Law Advocates LLP. All rights reserved.
          </p>
          <p className="mt-2 md:mt-0">Nairobi, Kenya &middot; Advocates of the High Court</p>
        </div>
      </div>
    </footer>
  );
}
