"use client";
import { LOCALIZATION } from "@/data";

import { UI } from "@/data";

import { TableProperties } from "lucide-react";
import { formatTanggal } from "@/lib/client";
import { REPORT_TABS, REPORT_COLUMNS, REPORT_LABELS } from "@/data";
import type { ReportsController } from "@/hooks/use-reports";
export function ReportTable({
  tab,
  period,
  data,
  loading,
  error,
}: Pick<ReportsController, "tab" | "period" | "data" | "loading" | "error">) {
  return (
    <section className="card" role="tabpanel">
      <div className="card-heading">
        <div>
          <h2>{REPORT_TABS.find((t) => t.key === tab)?.label}</h2>
          <p>
            {formatTanggal(period.awal)} {UI.emptyValue}{" "}
            {formatTanggal(period.akhir)}
          </p>
        </div>
        <span className="category">
          {data?.[tab].length ?? 0}{" "}
          {tab === "kelompok" ? UI.kelompok : UI.barang}
        </span>
      </div>
      {tab === "tertinggi" && (
        <p className="report-explanation">
          {UI.barangDenganTotalPengeluaranTertinggiPadaSetiap}
        </p>
      )}
      <div className="table-wrap">
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
                      ? BigInt(r[c]).toLocaleString(LOCALIZATION.locale)
                      : r[c]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <div className="empty">{UI.menghitungLaporan}</div>
        ) : !data?.[tab].length ? (
          <div className="empty">
            <TableProperties size={30} />
            <h3>
              {error ? UI.laporanBelumTersedia : UI.tidakAdaDataUntukPeriodeIni}
            </h3>
            <p>
              {error
                ? UI.periksaKoneksiDatabaseDanCobaTampilkanKembali
                : UI.pilihPeriodeLainAtauTambahkanTransaksiBarang}
            </p>
          </div>
        ) : null}
      </div>
      <div className="table-footer">
        {tab === "barang"
          ? UI.termasukBarangTanpaTransaksi
          : tab === "kelompok"
            ? UI.dikelompokkanBerdasarkanKategoriDanSatuan
            : UI.peringkatBerdasarkanTotalQtyKeluar}
        <span>{UI.periodeInklusif}</span>
      </div>
    </section>
  );
}
