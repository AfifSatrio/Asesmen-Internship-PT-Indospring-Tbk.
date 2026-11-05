"use client";
import { TRANSACTION_KIND, MESSAGES } from "@/data";

import { UI } from "@/data";

import {
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";
import { formatTanggal } from "@/lib/client";
import { TransactionFilters } from "@/components/transaction-filters";
import type { TransactionsController } from "@/hooks/use-transactions";
export function TransactionList({
  data,
  loading,
  load,
  search,
  setSearch,
  jenis,
  setJenis,
  visible,
  open,
  busy,
  remove,
}: Pick<
  TransactionsController,
  | "data"
  | "loading"
  | "load"
  | "search"
  | "setSearch"
  | "jenis"
  | "setJenis"
  | "visible"
  | "open"
  | "busy"
  | "remove"
>) {
  return (
    <section className="card">
      <div className="card-heading">
        <div>
          <h2>
            {UI.daftarTransaksi}
            <span className="count">{data.length}</span>
          </h2>
          <p>{UI.riwayatPencatatanBarangDalamSatuTempat}</p>
        </div>
        <button
          className="icon-button"
          aria-label={UI.muatUlang}
          onClick={load}
          disabled={loading}
        >
          <RefreshCw size={17} />
        </button>
      </div>
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        jenis={jenis}
        setJenis={setJenis}
      />{" "}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{UI.noTransaksi}</th>
              <th>{UI.tanggal}</th>
              <th>{UI.jenisTransaksi}</th>
              <th>{UI.kategori}</th>
              <th>{UI.jumlahItem}</th>
              <th className="right">{UI.tindakan}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.nomor}>
                <td className="code">{t.nomor}</td>
                <td>{formatTanggal(t.tanggal)}</td>
                <td>
                  <span
                    className={`badge ${t.jenis === TRANSACTION_KIND.masuk ? "in" : "out"}`}
                  >
                    {t.jenis === TRANSACTION_KIND.masuk ? (
                      <ArrowDownLeft size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}{" "}
                    {t.jenis === TRANSACTION_KIND.masuk
                      ? UI.masukLabel
                      : UI.keluarLabel}
                  </span>
                </td>
                <td>
                  <span className="category">{t.kategori}</span>
                </td>
                <td>{MESSAGES.itemCount(t.items.length)}</td>
                <td>
                  <div className="actions">
                    <button
                      title={UI.lihatDetail}
                      aria-label={MESSAGES.detailLabel(t.nomor)}
                      onClick={() => open("detail", t)}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      title={UI.koreksi}
                      aria-label={MESSAGES.editLabel(t.nomor)}
                      onClick={() => open("koreksi", t)}
                      disabled={busy}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title={UI.hapus}
                      className="danger-text"
                      aria-label={MESSAGES.deleteLabel(t.nomor)}
                      onClick={() => remove(t)}
                      disabled={busy}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <div className="empty">{UI.memuatTransaksi}</div>
        ) : visible.length === 0 ? (
          <div className="empty">
            <Package size={32} />
            <h3>
              {search || jenis
                ? UI.transaksiTidakDitemukan
                : UI.belumAdaTransaksi}
            </h3>
            <p>
              {search || jenis
                ? UI.cobaUbahPencarianAtauFilter
                : UI.mulaiDenganMenambahkanTransaksiBarangPertama}
            </p>
          </div>
        ) : null}
      </div>
      <div className="table-footer">
        {MESSAGES.transactionCount(visible.length, data.length)}
        <span>{UI.dataTersimpanDiDatabase}</span>
      </div>
    </section>
  );
}
