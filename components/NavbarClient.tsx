"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/partners", label: "Partners" },
  { href: "/blog", label: "Insights" },
];

interface Props {
  logoUrl?: string;
}

export default function NavbarClient({ logoUrl }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const brandTextClass = scrolled ? "text-navy" : "text-white";
  const brandSubtextClass = scrolled ? "text-navy/70" : "text-white/75";
  const brandMarkTextClass = scrolled ? "text-navy" : "text-white";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300 sm:h-28 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center justify-center rounded-xl bg-white/95 px-2 py-1 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
            {logoUrl && !logoError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="SW Law Advocates LLP"
                className="block h-16 w-auto max-w-none object-contain sm:h-20"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className={`text-xl font-bold tracking-[0.22em] sm:text-2xl ${brandMarkTextClass}`}>
                SW
              </span>
            )}
          </div>

          <span className="min-w-0">
            <span
              className={`block truncate text-base font-semibold leading-none tracking-[0.08em] sm:text-[1.45rem] ${brandTextClass}`}
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              SW Law Advocates
            </span>
            <span
              className={`mt-1 block truncate text-[10px] font-semibold uppercase tracking-[0.38em] sm:text-xs ${brandSubtextClass}`}
            >
              LLP
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => {
            const active = isActive(l.href);

            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative group ${
                  active
                    ? scrolled
                      ? "text-navy"
                      : "text-white"
                    : scrolled
                      ? "text-gray-700 hover:text-navy"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 bg-gold transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
          <Link
            href="/contact"
            className={`px-5 py-2 rounded font-semibold transition-colors ${
              isActive("/contact")
                ? "bg-white text-navy"
                : "bg-gold text-navy hover:bg-gold-dark"
            }`}
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden ${scrolled ? "text-navy" : "text-white"}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden px-6 py-4 flex flex-col gap-4 text-sm font-medium border-t ${
          scrolled ? "bg-white border-gray-100" : "bg-navy-dark border-white/10"
        }`}>
          {links.map((l) => {
            const active = isActive(l.href);

            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`transition-colors hover:text-gold ${
                  active
                    ? "text-gold"
                    : scrolled
                      ? "text-gray-700"
                      : "text-white/90"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className={`font-semibold ${
              isActive("/contact")
                ? "text-gold"
                : scrolled
                  ? "text-navy"
                  : "text-gold"
            }`}
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
