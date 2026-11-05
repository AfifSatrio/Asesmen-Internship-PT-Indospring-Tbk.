"use client";
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { Transaksi } from "@/lib/client";
export function TransactionStats({
  data,
  loading,
}: {
  data: Transaksi[];
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
          <strong>{loading ? "—" : data.length}</strong>
          <small>{"Seluruh transaksi tercatat"}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon green">
          <ArrowDownLeft />
        </span>
        <div>
          <p>{"Transaksi masuk"}</p>
          <strong>
            {loading ? "—" : data.filter((t) => t.jenis === "MASUK").length}
          </strong>
          <small>{"Penerimaan barang"}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon orange">
          <ArrowUpRight />
        </span>
        <div>
          <p>{"Transaksi keluar"}</p>
          <strong>
            {loading ? "—" : data.filter((t) => t.jenis === "KELUAR").length}
          </strong>
          <small>{"Pengeluaran barang"}</small>
        </div>
      </div>
    </div>
  );
}
