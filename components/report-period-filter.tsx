"use client";

import { Calendar, Search } from "lucide-react";
import type { ReportsController } from "@/hooks/use-reports";

export function ReportPeriodFilter({
  awal,
  setAwal,
  akhir,
  setAkhir,
  loading,
  load,
}: Pick<
  ReportsController,
  "awal" | "setAwal" | "akhir" | "setAkhir" | "loading" | "load"
>) {
  return (
    <section className="bg-white border border-slate-200 rounded-[8px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">
          Filter Periode Laporan
        </h2>
        <span className="text-xs text-slate-500 hidden sm:inline">
          (Tanggal awal dan akhir diikutsertakan secara inklusif)
        </span>
      </div>

      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void load(awal, akhir);
        }}
      >
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tanggal awal
          </label>
          <input
            type="date"
            required
            aria-label="Tanggal awal"
            value={awal}
            onChange={(e) => setAwal(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tanggal akhir
          </label>
          <input
            type="date"
            required
            aria-label="Tanggal akhir"
            value={akhir}
            onChange={(e) => setAkhir(e.target.value)}
            className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-[6px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Search size={15} />
          <span>{loading ? "Memuat…" : "Tampilkan Laporan"}</span>
        </button>
      </form>
    </section>
  );
}
