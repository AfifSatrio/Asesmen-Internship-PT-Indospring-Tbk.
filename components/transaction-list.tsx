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
  total,
  page,
  totalPages,
  setPage,
  error,
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
  | "total"
  | "page"
  | "totalPages"
  | "setPage"
  | "error"
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
            {"Daftar transaksi"}
            <span className="count">{total}</span>
          </h2>
          <p>{"Riwayat pencatatan barang dalam satu tempat."}</p>
        </div>
        <button
          className="icon-button"
          aria-label={"Muat ulang"}
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
              <th>{"No. transaksi"}</th>
              <th>{"Tanggal"}</th>
              <th>{"Jenis transaksi"}</th>
              <th>{"Kategori"}</th>
              <th>{"Jumlah item"}</th>
              <th className="right">{"Tindakan"}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => (
              <tr key={t.nomor}>
                <td className="code">{t.nomor}</td>
                <td>{formatTanggal(t.tanggal)}</td>
                <td>
                  <span
                    className={`badge ${t.jenis === "MASUK" ? "in" : "out"}`}
                  >
                    {t.jenis === "MASUK" ? (
                      <ArrowDownLeft size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}{" "}
                    {t.jenis === "MASUK" ? "Masuk" : "Keluar"}
                  </span>
                </td>
                <td>
                  <span className="category">{t.kategori}</span>
                </td>
                <td>{`${t.itemCount} barang`}</td>
                <td>
                  <div className="actions">
                    <button
                      title={"Lihat detail"}
                      aria-label={`Detail ${t.nomor}`}
                      onClick={() => open("detail", t)}
                    >
                      <Eye size={17} />
                    </button>
                    <button
                      title={"Koreksi"}
                      aria-label={`Koreksi ${t.nomor}`}
                      onClick={() => open("koreksi", t)}
                      disabled={busy}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title={"Hapus"}
                      className="danger-text"
                      aria-label={`Hapus ${t.nomor}`}
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
          <div className="empty" role="status">
            Memuat transaksi…
          </div>
        ) : error ? (
          <div className="empty">
            Daftar belum dapat ditampilkan. Klik Coba lagi untuk memuat ulang.
          </div>
        ) : visible.length === 0 ? (
          <div className="empty">
            <Package size={32} />
            <h3>
              {search || jenis
                ? "Transaksi tidak ditemukan"
                : "Belum ada transaksi"}
            </h3>
            <p>
              {search || jenis
                ? "Coba ubah pencarian atau filter."
                : "Mulai dengan menambahkan transaksi barang pertama."}
            </p>
          </div>
        ) : null}
      </div>
      <div className="table-footer">
        {`Menampilkan ${visible.length} dari ${total} transaksi`}
        <div className="pagination" aria-label="Halaman transaksi">
          <button
            className="secondary small"
            disabled={loading || busy || page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Sebelumnya
          </button>
          <span aria-live="polite">
            Halaman {page} dari {totalPages}
          </span>
          <button
            className="secondary small"
            disabled={loading || busy || page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </section>
  );
}
