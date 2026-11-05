"use client";
import { NAVIGATION } from "@/data";

import { UI } from "@/data";

import Link from "next/link";
import {
  Boxes,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Database,
} from "lucide-react";
export function Sidebar({ path }: { path: string }) {
  return (
    <aside className="sidebar">
      <Link href={NAVIGATION[0].href} className="brand">
        <span className="brand-mark">
          <Boxes size={24} />
        </span>
        <span>
          {UI.indospring}
          <small>{UI.inventoryManagement}</small>
        </span>
      </Link>
      <div className="workspace-label">{UI.ruangKerjaEyebrow}</div>
      <nav>
        {NAVIGATION.map((item) => (
          <Link
            key={item.href}
            className={path === item.href ? "active" : ""}
            href={item.href}
          >
            {item.icon === "transactions" ? (
              <ArrowLeftRight size={19} />
            ) : (
              <ChartNoAxesCombined size={19} />
            )}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-note">
        <Database size={18} />
        <strong>{UI.pencatatanTerpusat}</strong>
        <p>{UI.kelolaPergerakanBarangDenganDataYangTerhubung}</p>
      </div>
      <div className="sidebar-footer">
        {UI.ptIndospringTbk}
        <span>{UI.asesmenItSoftware2026}</span>
      </div>
    </aside>
  );
}
