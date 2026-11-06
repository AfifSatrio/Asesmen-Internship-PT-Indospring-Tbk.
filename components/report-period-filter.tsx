"use client";
import { CalendarDays, ArrowRight, Search } from "lucide-react";
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
    <section className="card period-card">
      <div className="period-title">
        <CalendarDays size={20} />
        <div>
          <h2>{"Periode laporan"}</h2>
          <p>{"Tanggal awal dan akhir termasuk dalam perhitungan."}</p>
        </div>
      </div>
      <form
        className="period-form"
        onSubmit={(e) => {
          e.preventDefault();
          void load(awal, akhir);
        }}
      >
        <label>
          {"Tanggal awal"}
          <input
            type="date"
            required
            value={awal}
            onChange={(e) => setAwal(e.target.value)}
          />
        </label>
        <ArrowRight size={17} />
        <label>
          {"Tanggal akhir"}
          <input
            type="date"
            required
            value={akhir}
            onChange={(e) => setAkhir(e.target.value)}
          />
        </label>
        <button className="primary" disabled={loading}>
          <Search size={17} />
          {loading ? "Memuat…" : "Tampilkan Laporan"}
        </button>
      </form>
    </section>
  );
}
