"use client";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionList } from "@/components/transaction-list";
import { TransactionDialog } from "@/components/transaction-dialog";
export function TransactionWorkspace() {
  const controller = useTransactions();
  const { error, success, load, open, busy, loading } = controller;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Transaksi Barang</h1>
          <p>Catat penerimaan dan pengeluaran barang.</p>
        </div>
        <button
          className="primary"
          disabled={busy || loading}
          onClick={() => open("tambah")}
        >
          Tambah Transaksi
        </button>
      </div>
      {error && (
        <div role="alert" className="alert error">
          {error}
          <button disabled={loading} onClick={load}>
            Coba lagi
          </button>
        </div>
      )}
      {success && (
        <div role="status" className="alert success">
          {success}
        </div>
      )}
      <TransactionList {...controller} />
      <TransactionDialog {...controller} />
    </>
  );
}
