"use client";
import { Plus } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionStats } from "@/components/transaction-stats";
import { TransactionList } from "@/components/transaction-list";
import { TransactionDialog } from "@/components/transaction-dialog";
export function TransactionWorkspace() {
  const controller = useTransactions();
  const { data, loading, error, success, load, open } = controller;
  return (
    <>
      {" "}
      <div className="breadcrumb">
        {"Ruang kerja"}
        <span>{"/"}</span>
        {"Transaksi barang"}
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{"PERGERAKAN BARANG"}</div>
          <h1>{"Transaksi Barang"}</h1>
          <p>{"Catat dan kelola setiap barang masuk dan keluar."}</p>
        </div>
        <button className="primary" onClick={() => open("tambah")}>
          <Plus size={18} />
          {"Tambah Transaksi"}
        </button>
      </div>
      <TransactionStats data={data} loading={loading} />{" "}
      {error && (
        <div role="alert" className="alert error">
          {error} <button onClick={load}>{"Coba lagi"}</button>
        </div>
      )}
      {success && (
        <div role="status" className="alert success">
          {success}
        </div>
      )}
      <TransactionList {...controller} />{" "}
      <div className="page-note">
        <span className="note-dot" />
        {"Master barang tersedia dalam kategori SUBMAT dan RAWMAT."}
      </div>
      <TransactionDialog {...controller} />
    </>
  );
}
