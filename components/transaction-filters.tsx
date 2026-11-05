"use client";

import { TRANSACTION_TYPES } from "@/lib/validation";
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
    <div className="p-3 sm:p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-sm">
        <label htmlFor="search-transaksi" className="sr-only">
          Cari transaksi
        </label>
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          id="search-transaksi"
          aria-label="Cari transaksi"
          placeholder="Cari nomor transaksi atau kategori…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Filter by Jenis Transaksi */}
      <div className="flex items-center gap-2">
        <select
          aria-label="Filter jenis transaksi"
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          className="py-1.5 px-3 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Semua jenis transaksi</option>
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
