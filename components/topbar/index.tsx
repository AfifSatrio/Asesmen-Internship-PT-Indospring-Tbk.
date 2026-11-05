"use client";
import { UI } from "@/data";

import { PanelLeft } from "lucide-react";
export function Topbar() {
  return (
    <header className="topbar">
      <span>
        <PanelLeft size={17} />
        {UI.sistemPencatatanBarang}
      </span>
      <span className="assessment">
        {UI.itSoftware}
        <span className="avatar">{UI.is}</span>
      </span>
    </header>
  );
}
