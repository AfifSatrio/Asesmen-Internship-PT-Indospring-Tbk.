"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/footer";
export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <Sidebar path={path} />
      <div className="main-area">
        <Topbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
