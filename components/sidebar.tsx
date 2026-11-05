"use client";
import { NAVIGATION } from "@/data";
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
          {"INDOSPRING"}
          <small>{"INVENTORY MANAGEMENT"}</small>
        </span>
      </Link>
      <div className="workspace-label">{"RUANG KERJA"}</div>
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
        <strong>{"Pencatatan terpusat"}</strong>
        <p>{"Kelola pergerakan barang dengan data yang terhubung."}</p>
      </div>
      <div className="sidebar-footer">
        {"PT Indospring Tbk."}
        <span>{"Asesmen IT Software · 2026"}</span>
      </div>
    </aside>
  );
}
