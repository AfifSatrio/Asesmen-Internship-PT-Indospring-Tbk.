"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/data";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-900 font-bold text-base tracking-tight hover:text-blue-600 transition-colors"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white font-bold text-xs rounded-[6px]">
              IS
            </span>
            <span className="font-semibold text-sm sm:text-base">
              PT Indospring Tbk.
            </span>
          </Link>
          <span className="hidden sm:inline-block text-xs text-slate-400 border-l border-slate-200 pl-3">
            Sistem Inventori
          </span>
        </div>

        {/* Center: Main Navigation (Only 2 menus: Transaksi Barang & Laporan Stok) */}
        <nav
          className="flex items-center h-full gap-1 sm:gap-2"
          aria-label="Navigasi Utama"
        >
          {NAVIGATION.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative inline-flex items-center h-14 px-3 sm:px-4 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Operational Status / Info */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-[6px]">
            Operasional IT
          </span>
        </div>
      </div>
    </header>
  );
}

