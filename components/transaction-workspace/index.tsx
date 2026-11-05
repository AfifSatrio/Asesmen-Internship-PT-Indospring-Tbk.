"use client";
import { UI } from "@/data";

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
        {UI.ruangKerja}
        <span>{UI.breadcrumbSeparator}</span>
        {UI.transaksiBarangBreadcrumb}
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{UI.pergerakanBarang}</div>
          <h1>{UI.transaksiBarang}</h1>
          <p>{UI.catatDanKelolaSetiapBarangMasukDan}</p>
        </div>
        <button className="primary" onClick={() => open("tambah")}>
          <Plus size={18} />
          {UI.tambahTransaksiButton}
        </button>
      </div>
      <TransactionStats data={data} loading={loading} />{" "}
      {error && (
        <div role="alert" className="alert error">
          {error} <button onClick={load}>{UI.cobaLagi}</button>
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
        {UI.masterBarangTersediaDalamKategoriSubmatDan}
      </div>
      <TransactionDialog {...controller} />
    </>
  );
}
