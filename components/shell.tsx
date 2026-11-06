"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Lewati navigasi
      </a>
      <Topbar path={path} />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}
