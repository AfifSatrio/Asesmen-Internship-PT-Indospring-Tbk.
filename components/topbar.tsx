"use client";
import Link from "next/link";
import { NAVIGATION } from "@/data";
export function Topbar({ path }: { path: string }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <strong>INDOSPRING</strong>
          <span>Inventori</span>
        </div>
        <nav aria-label="Navigasi utama">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={path === item.href ? "active" : ""}
              aria-current={path === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
