"use client";

import { Plus } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { TransactionList } from "@/components/transaction-list";
import { TransactionDialog } from "@/components/transaction-dialog";

export function TransactionWorkspace() {
  const controller = useTransactions();
  const { loading, error, success, load, open } = controller;

  return (
    <div className="space-y-5">
      {/* Page Header: Title ~24px with Primary Button at Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
            Transaksi Barang
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Pencatatan dan pengelolaan mutasi barang masuk dan keluar.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-[6px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 transition-colors self-start sm:self-auto cursor-pointer"
          onClick={() => open("tambah")}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Consistent Feedback / Alerts */}
      {error && (
        <div
          role="alert"
          className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-sm text-rose-800 flex items-center justify-between gap-3"
        >
          <span>{error}</span>
          <button
            onClick={load}
            className="text-xs font-semibold text-rose-700 hover:underline shrink-0"
          >
            Coba lagi
          </button>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-sm text-emerald-800"
        >
          {success}
        </div>
      )}

      {/* Focus of the page: Transaction Table */}
      <TransactionList {...controller} />

      {/* Transaction Modal Dialog */}
      <TransactionDialog {...controller} />
    </div>
  );
}
