"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ArrowLeftRight,
  ChartNoAxesCombined,
  Database,
  PanelLeft,
} from "lucide-react";
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <Boxes size={24} />
          </span>
          <span>
            INDOSPRING<small>INVENTORY MANAGEMENT</small>
          </span>
        </Link>
        <div className="workspace-label">RUANG KERJA</div>
        <nav>
          <Link className={path === "/" ? "active" : ""} href="/">
            <ArrowLeftRight size={19} />
            Transaksi Barang
          </Link>
          <Link className={path === "/laporan" ? "active" : ""} href="/laporan">
            <ChartNoAxesCombined size={19} />
            Laporan Stok
          </Link>
        </nav>
        <div className="sidebar-note">
          <Database size={18} />
          <strong>Pencatatan terpusat</strong>
          <p>Kelola pergerakan barang dengan data yang terhubung.</p>
        </div>
        <div className="sidebar-footer">
          PT Indospring Tbk.<span>Asesmen IT Software · 2026</span>
        </div>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <span>
            <PanelLeft size={17} /> Sistem Pencatatan Barang
          </span>
          <span className="assessment">
            IT SOFTWARE <span className="avatar">IS</span>
          </span>
        </header>
        <main>{children}</main>
        <footer>
          PT Indospring Tbk. <span>Sistem Transaksi Barang · v1.0</span>
        </footer>
      </div>
    </div>
  );
}
