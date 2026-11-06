"use client";
import { PanelLeft } from "lucide-react";
export function Topbar() {
  return (
    <header className="topbar">
      <span>
        <PanelLeft size={17} />
        {"Sistem Pencatatan Barang"}
      </span>
      <span className="assessment">
        {"IT SOFTWARE"}
        <span className="avatar">{"IS"}</span>
      </span>
    </header>
  );
}
