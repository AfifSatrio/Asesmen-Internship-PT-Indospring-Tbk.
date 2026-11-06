"use client";
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
    <form
      className="period-form"
      aria-label="Periode laporan"
      onSubmit={(e) => {
        e.preventDefault();
        void load(awal, akhir);
      }}
    >
      <label>
        Tanggal awal
        <input
          type="date"
          required
          value={awal}
          onChange={(e) => setAwal(e.target.value)}
        />
      </label>
      <label>
        Tanggal akhir
        <input
          type="date"
          required
          value={akhir}
          onChange={(e) => setAkhir(e.target.value)}
        />
      </label>
      <button className="primary" disabled={loading}>
        {loading ? "Memuat laporan…" : "Tampilkan Laporan"}
      </button>
      <p>Kedua tanggal termasuk dalam perhitungan.</p>
    </form>
  );
}
