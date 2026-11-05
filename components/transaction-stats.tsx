"use client";
import { TRANSACTION_KIND } from "@/data";

import { UI } from "@/data";

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
          <p>{UI.totalTransaksi}</p>
          <strong>{loading ? UI.emptyValue : data.length}</strong>
          <small>{UI.seluruhTransaksiTercatat}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon green">
          <ArrowDownLeft />
        </span>
        <div>
          <p>{UI.transaksiMasuk}</p>
          <strong>
            {loading
              ? UI.emptyValue
              : data.filter((t) => t.jenis === TRANSACTION_KIND.masuk).length}
          </strong>
          <small>{UI.penerimaanBarang}</small>
        </div>
      </div>
      <div className="stat">
        <span className="stat-icon orange">
          <ArrowUpRight />
        </span>
        <div>
          <p>{UI.transaksiKeluar}</p>
          <strong>
            {loading
              ? UI.emptyValue
              : data.filter((t) => t.jenis === TRANSACTION_KIND.keluar).length}
          </strong>
          <small>{UI.pengeluaranBarang}</small>
        </div>
      </div>
    </div>
  );
}
