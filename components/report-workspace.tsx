"use client";
import { useReports } from "@/hooks/use-reports";
import { ReportPeriodFilter } from "@/components/report-period-filter";
import { ReportTabs } from "@/components/report-tabs";
import { ReportTable } from "@/components/report-table";
export function ReportWorkspace() {
  const controller = useReports();
  const { tab, setTab, error, loading, load, awal, akhir } = controller;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Laporan Stok</h1>
          <p>Mutasi dan saldo barang berdasarkan periode transaksi.</p>
        </div>
      </div>
      <ReportPeriodFilter {...controller} />
      {error && (
        <div role="alert" className="alert error">
          {error}
          <button disabled={loading} onClick={() => load(awal, akhir)}>
            Coba lagi
          </button>
        </div>
      )}
      <p className="info-note">
        Stok akhir = barang masuk − barang keluar dalam periode. Saldo sebelum
        periode tidak disertakan.
      </p>
      <ReportTabs tab={tab} setTab={setTab} />
      <ReportTable {...controller} />
    </>
  );
}
