"use client";
import { REPORT_TABS, REPORT_COLUMNS, REPORT_LABELS } from "@/data";

import { formatTanggal } from "@/lib/client";
import type { ReportsController } from "@/hooks/use-reports";
export function ReportTable({
  tab,
  period,
  data,
  loading,
  error,
}: Pick<ReportsController, "tab" | "period" | "data" | "loading" | "error">) {
  return (
    <section
      className="card"
      role="tabpanel"
      id="report-panel"
      aria-labelledby={`tab-${tab}`}
      aria-busy={loading}
    >
      <div className="card-heading">
        <div>
          <h2>{REPORT_TABS.find((t) => t.key === tab)?.label}</h2>
          <p>
            {formatTanggal(period.awal)} {"—"} {formatTanggal(period.akhir)}
          </p>
        </div>
        <span className="category">
          {data?.[tab].length ?? 0} {tab === "kelompok" ? "kelompok" : "barang"}
        </span>
      </div>
      {tab === "tertinggi" && (
        <p className="report-explanation">
          {
            "Barang dengan total pengeluaran tertinggi pada setiap kategori dan satuan. Seluruh nilai seri ditampilkan; kelompok tanpa pengeluaran dikecualikan."
          }
        </p>
      )}
      <div
        className="table-wrap"
        role="region"
        aria-label="Tabel laporan stok"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              {REPORT_COLUMNS[tab].map((c) => (
                <th
                  key={c}
                  className={
                    c.startsWith("TRANS_") || c === "STOK_AKHIR" ? "right" : ""
                  }
                >
                  {REPORT_LABELS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.[tab].map((r, i) => (
              <tr key={i}>
                {REPORT_COLUMNS[tab].map((c) => (
                  <td
                    key={c}
                    className={
                      c === "STOK_AKHIR"
                        ? "right stock"
                        : c.startsWith("TRANS_")
                          ? "right"
                          : c === "KODE_BARANG"
                            ? "code"
                            : ""
                    }
                  >
                    {c.startsWith("TRANS_") || c === "STOK_AKHIR"
                      ? BigInt(r[c]).toLocaleString("id-ID")
                      : r[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <div className="empty" role="status">
            Memuat laporan…
          </div>
        ) : !data?.[tab].length ? (
          <div className="empty">
            <h3>
              {error
                ? "Laporan belum tersedia"
                : "Tidak ada data untuk periode ini"}
            </h3>
            <p>
              {error
                ? "Periksa koneksi database dan coba tampilkan kembali."
                : "Pilih periode lain atau tambahkan transaksi barang."}
            </p>
          </div>
        ) : null}
      </div>
      <div className="table-footer">
        {tab === "barang"
          ? "Termasuk barang tanpa transaksi"
          : tab === "kelompok"
            ? "Dikelompokkan berdasarkan kategori dan satuan"
            : "Peringkat berdasarkan total QTY keluar"}
        <span>{"Periode inklusif"}</span>
      </div>
    </section>
  );
}
