"use client";

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
    <section className="bg-white border border-slate-200 rounded-[8px] overflow-hidden">
      {/* Top Section: Header & Filters */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <span>Daftar Transaksi</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-[4px] border border-slate-200 tabular-nums">
              {data.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Riwayat pencatatan barang masuk dan keluar.
          </p>
        </div>
        <button
          className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-[6px] hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Muat ulang"
          title="Muat ulang data transaksi"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin text-blue-600" : ""}
          />
        </button>
      </div>

      <TransactionFilters
        search={search}
        setSearch={setSearch}
        jenis={jenis}
        setJenis={setJenis}
      />

      {/* Horizontal scroll wrapper for responsive table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[14px] text-slate-700 whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">No. Transaksi</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Jenis Transaksi</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-right">Jumlah Item</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {visible.map((t) => (
              <tr key={t.nomor} className="hover:bg-slate-50/75 transition-colors">
                <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-[14px]">
                  {t.nomor}
                </td>
                <td className="py-3 px-4 text-slate-700 text-[14px]">
                  {formatTanggal(t.tanggal)}
                </td>
                <td className="py-3 px-4 text-[14px]">
                  {t.jenis === "MASUK" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ArrowDownLeft
                        size={13}
                        strokeWidth={2.5}
                        className="text-emerald-600"
                      />
                      <span>Masuk</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      <ArrowUpRight
                        size={13}
                        strokeWidth={2.5}
                        className="text-amber-600"
                      />
                      <span>Keluar</span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-[14px]">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-[4px] border border-slate-200">
                    {t.kategori}
                  </span>
                </td>
                <td className="py-3 px-4 text-right tabular-nums text-slate-700 text-[14px]">
                  {t.items.length} barang
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      title="Lihat detail"
                      aria-label={`Detail ${t.nomor}`}
                      onClick={() => open("detail", t)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[6px] hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">Detail</span>
                    </button>
                    <button
                      title="Koreksi transaksi"
                      aria-label={`Koreksi ${t.nomor}`}
                      onClick={() => open("koreksi", t)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[6px] hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Pencil size={13} />
                      <span className="hidden sm:inline">Koreksi</span>
                    </button>
                    <button
                      title="Hapus transaksi"
                      aria-label={`Hapus ${t.nomor}`}
                      onClick={() => remove(t)}
                      disabled={busy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50/60 border border-rose-200 rounded-[6px] hover:bg-rose-100 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Memuat transaksi…
          </div>
        )}

        {/* Empty State */}
        {!loading && visible.length === 0 && (
          <div className="py-12 px-4 text-center">
            <Package size={28} className="mx-auto text-slate-400 mb-2" />
            <h3 className="text-sm font-semibold text-slate-900">
              {search || jenis
                ? "Transaksi tidak ditemukan"
                : "Belum ada transaksi"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || jenis
                ? "Coba ubah pencarian atau filter."
                : "Mulai dengan menambahkan transaksi barang pertama."}
            </p>
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="py-2.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>
          Menampilkan {visible.length} dari {data.length} transaksi
        </span>
        <span className="hidden sm:inline">Data tersimpan di database</span>
      </div>
    </section>
  );
}
