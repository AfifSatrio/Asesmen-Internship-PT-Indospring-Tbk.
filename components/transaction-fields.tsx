"use client";

import { TRANSACTION_OPTIONS } from "@/data";
import { LIMITS } from "@/lib/validation";
import { CATEGORIES } from "@/lib/validation";
import type { TransactionsController } from "@/hooks/use-transactions";
import type { InputTransaksi } from "@/lib/validation";

export function TransactionFields({
  form,
  setForm,
  mode,
}: Pick<TransactionsController, "form" | "setForm" | "mode">) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {/* Nomor Transaksi */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          No. transaksi <span className="text-rose-500">*</span>
        </label>
        <input
          required
          maxLength={LIMITS.codeLength}
          placeholder="Contoh: T001"
          aria-label="No. transaksi"
          value={form.nomor}
          disabled={mode === "koreksi"}
          onChange={(e) => setForm({ ...form, nomor: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Tanggal */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Tanggal <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          required
          aria-label="Tanggal"
          value={form.tanggal}
          onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Jenis Transaksi */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Jenis transaksi <span className="text-rose-500">*</span>
        </label>
        <select
          aria-label="Jenis transaksi"
          value={form.jenis}
          onChange={(e) =>
            setForm({
              ...form,
              jenis: e.target.value as InputTransaksi["jenis"],
            })
          }
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          {TRANSACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Kategori <span className="text-rose-500">*</span>
        </label>
        <select
          aria-label="Kategori"
          value={form.kategori}
          onChange={(e) => {
            if (
              !form.items.length ||
              confirm(
                "Mengubah kategori akan mengosongkan seluruh item. Lanjutkan?",
              )
            )
              setForm({
                ...form,
                kategori: e.target.value as InputTransaksi["kategori"],
                items: [],
              });
          }}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
