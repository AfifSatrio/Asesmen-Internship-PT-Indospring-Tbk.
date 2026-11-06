"use client";

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
    <section
      className="card"
      aria-label="Daftar transaksi"
      aria-busy={loading || busy}
    >
      <div className="card-heading">
        <div>
          <h2>
            {"Daftar transaksi"}
            <span className="count">{data.length}</span>
          </h2>
        </div>
        <button
          className="secondary small"
          aria-label={"Muat ulang"}
          onClick={load}
          disabled={loading}
        >
          Muat ulang
        </button>
      </div>
      <TransactionFilters
        search={search}
        setSearch={setSearch}
        jenis={jenis}
        setJenis={setJenis}
      />{" "}
      <div
        className="table-wrap"
        role="region"
        aria-label="Tabel transaksi"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th>{"No. transaksi"}</th>
              <th>{"Tanggal"}</th>
              <th>{"Jenis transaksi"}</th>
              <th>{"Kategori"}</th>
              <th className="right">Jumlah item</th>
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
                    {t.jenis === "MASUK" ? "Masuk" : "Keluar"}
                  </span>
                </td>
                <td>
                  <span className="category">{t.kategori}</span>
                </td>
                <td className="right">{t.items.length}</td>
                <td>
                  <div className="actions">
                    <button
                      title={"Lihat detail"}
                      aria-label={`Detail ${t.nomor}`}
                      onClick={() => open("detail", t)}
                    >
                      Detail
                    </button>
                    <button
                      title={"Koreksi"}
                      aria-label={`Koreksi ${t.nomor}`}
                      onClick={() => open("koreksi", t)}
                      disabled={busy}
                    >
                      Koreksi
                    </button>
                    <button
                      title="Hapus seluruh transaksi"
                      className="danger-text"
                      aria-label={`Hapus transaksi ${t.nomor}`}
                      onClick={() => remove(t)}
                      disabled={busy}
                    >
                      Hapus transaksi
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
        ) : visible.length === 0 ? (
          <div className="empty">
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
        {`Menampilkan ${visible.length} dari ${data.length} transaksi`}
        <span>{"Data tersimpan di database"}</span>
      </div>
    </section>
  );
}
