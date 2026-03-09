"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/partners", label: "Partners" },
  { href: "/blog", label: "Insights" },
];

interface Props {
  logoUrl?: string;
}

export default function NavbarClient({ logoUrl }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-navy shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="SW Law LLP"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-bold tracking-wide text-white">SW Law LLP</span>
              <span className="text-gold text-xs tracking-widest uppercase">Legal Consultancy</span>
            </span>
          )}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="relative text-white/90 hover:text-white group">
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-gold text-navy px-5 py-2 rounded font-semibold hover:bg-gold-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
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
        <div className="md:hidden bg-navy-dark px-6 py-4 flex flex-col gap-4 text-sm font-medium border-t border-white/10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/90 hover:text-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-gold font-semibold">
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
}
