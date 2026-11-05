"use client";
import { TRANSACTION_TYPES } from "@/data";

import { UI } from "@/data";

import { Search } from "lucide-react";
import type { TransactionsController } from "@/hooks/use-transactions";
export function TransactionFilters({
  search,
  setSearch,
  jenis,
  setJenis,
}: Pick<
  TransactionsController,
  "search" | "setSearch" | "jenis" | "setJenis"
>) {
  return (
    <div className="toolbar">
      <label className="search">
        <Search size={18} />
        <input
          aria-label={UI.cariTransaksi}
          placeholder={UI.cariNomorTransaksiAtauKategori}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      <select
        aria-label={UI.filterJenisTransaksi}
        value={jenis}
        onChange={(e) => setJenis(e.target.value)}
      >
        <option value="">{UI.semuaJenisTransaksi}</option>
        {TRANSACTION_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}
