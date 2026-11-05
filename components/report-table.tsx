"use client";

import { REPORT_TABS, REPORT_COLUMNS, REPORT_LABELS } from "@/data";
import { TableProperties } from "lucide-react";
import { formatTanggal } from "@/lib/client";
import type { ReportsController } from "@/hooks/use-reports";

export function ReportTable({
  tab,
  period,
  data,
  loading,
  error,
}: Pick<ReportsController, "tab" | "period" | "data" | "loading" | "error">) {
  const currentTabLabel = REPORT_TABS.find((t) => t.key === tab)?.label;
  const itemsCount = data?.[tab].length ?? 0;

  return (
    <section
      className="bg-white border border-slate-200 rounded-[8px] overflow-hidden"
      role="tabpanel"
    >
      {/* Table Header Info */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <span>{currentTabLabel}</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-[4px] border border-slate-200 tabular-nums">
              {itemsCount} {tab === "kelompok" ? "kelompok" : "barang"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Periode: {formatTanggal(period.awal)} — {formatTanggal(period.akhir)}
          </p>
        </div>
      </div>

      {tab === "tertinggi" && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-600">
          Barang dengan total pengeluaran tertinggi pada setiap kategori dan satuan. Seluruh nilai seri ditampilkan; kelompok tanpa pengeluaran dikecualikan.
        </div>
      )}

      {/* Horizontal Scroll Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-slate-700 whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              {REPORT_COLUMNS[tab].map((c) => (
                <th
                  key={c}
                  className={`py-3 px-4 ${
                    c.startsWith("TRANS_") || c === "STOK_AKHIR"
                      ? "text-right"
                      : ""
                  }`}
                >
                  {REPORT_LABELS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data?.[tab].map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/75 transition-colors">
                {REPORT_COLUMNS[tab].map((c) => {
                  const isNumber = c.startsWith("TRANS_") || c === "STOK_AKHIR";
                  const isStockEnd = c === "STOK_AKHIR";
                  const isCode = c === "KODE_BARANG";

                  return (
                    <td
                      key={c}
                      className={`py-3 px-4 text-[14px] ${
                        isNumber ? "text-right tabular-nums" : ""
                      } ${
                        isStockEnd
                          ? "font-semibold text-slate-900 bg-slate-50/50"
                          : isCode
                            ? "font-mono font-semibold text-slate-900"
                            : "text-slate-700"
                      }`}
                    >
                      {isNumber
                        ? BigInt(r[c]).toLocaleString("id-ID")
                        : r[c]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Menghitung laporan…
          </div>
        )}

        {/* Empty State */}
        {!loading && !itemsCount && (
          <div className="py-12 px-4 text-center">
            <TableProperties
              size={28}
              className="mx-auto text-slate-400 mb-2"
            />
            <h3 className="text-sm font-semibold text-slate-900">
              {error
                ? "Laporan belum tersedia"
                : "Tidak ada data untuk periode ini"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {error
                ? "Periksa koneksi database dan coba tampilkan kembali."
                : "Pilih periode lain atau tambahkan transaksi barang."}
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          {tab === "barang"
            ? "Termasuk master barang tanpa transaksi"
            : tab === "kelompok"
              ? "Dikelompokkan berdasarkan kategori dan satuan"
              : "Peringkat berdasarkan total QTY keluar"}
        </span>
        <span className="hidden sm:inline">Periode inklusif</span>
      </div>
    </section>
  );
}
