"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const navLinks = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/dashboard/inquiries", label: "Inquiries" },
  { href: "/admin/dashboard/blog", label: "Blog Posts" },
  { href: "/admin/dashboard/partners", label: "Partners" },
  { href: "/admin/dashboard/services", label: "Services" },
  { href: "/admin/dashboard/settings", label: "Site Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-navy text-white min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-white/10">
        <p className="font-bold text-sm">SW Law LLP</p>
        <p className="text-gold text-xs mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-3 py-2 rounded text-sm transition-colors ${
              pathname === link.href ||
                (link.href !== "/admin/dashboard" && pathname.startsWith(link.href + "/"))
                ? "bg-gold text-navy font-semibold"
                : "hover:bg-white/10"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white"
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
