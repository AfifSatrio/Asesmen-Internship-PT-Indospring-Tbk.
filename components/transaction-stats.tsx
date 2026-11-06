"use client";
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { TransactionSummary } from "@/lib/client";
export function TransactionStats({
  summary,
  loading,
}: {
  summary: TransactionSummary | null;
  loading: boolean;
}) {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-icon blue">
          <ArrowLeftRight />
        </span>
        <div>
          <p>{"Total transaksi"}</p>
          <strong>{loading || !summary ? "—" : summary.total}</strong>
          <small>{"Seluruh transaksi tercatat"}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon green">
          <ArrowDownLeft />
        </span>
        <div>
          <p>{"Transaksi masuk"}</p>
          <strong>{loading || !summary ? "—" : summary.masuk}</strong>
          <small>{"Penerimaan barang"}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon orange">
          <ArrowUpRight />
        </span>
        <div>
          <p>{"Transaksi keluar"}</p>
          <strong>{loading || !summary ? "—" : summary.keluar}</strong>
          <small>{"Pengeluaran barang"}</small>
        </div>
      </div>
    </div>
  );
}
