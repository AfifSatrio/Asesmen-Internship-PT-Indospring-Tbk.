"use client";

import { Info } from "lucide-react";
import { useReports } from "@/hooks/use-reports";
import { ReportPeriodFilter } from "@/components/report-period-filter";
import { ReportTabs } from "@/components/report-tabs";
import { ReportTable } from "@/components/report-table";

export function ReportWorkspace() {
  const controller = useReports();
  const { tab, setTab, error } = controller;

  return (
    <div className="space-y-5">
      {/* Page Header: Title ~24px */}
      <div>
        <h1 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
          Laporan Stok
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Rekapitulasi mutasi dan saldo persediaan barang berdasarkan periode pilihan.
        </p>
      </div>

      {/* Period Filter Card */}
      <ReportPeriodFilter {...controller} />

      {/* Feedback / Error */}
      {error && (
        <div
          role="alert"
          className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-sm text-rose-800"
        >
          {error}
        </div>
      )}

      {/* Operational Note */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px] flex items-start gap-2.5 text-xs text-slate-600">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900 block">
            Ketentuan perhitungan periode:
          </span>
          <span>
            Stok akhir = transaksi masuk − transaksi keluar. Saldo sebelum periode tidak disertakan.
          </span>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="space-y-3">
        <ReportTabs tab={tab} setTab={setTab} />
        <ReportTable {...controller} />
      </div>
    </div>
  );
}
