"use client";
import { LIMITS, TRANSACTION_OPTIONS, CATEGORIES } from "@/data";

import { UI } from "@/data";

import type { TransactionsController } from "@/hooks/use-transactions";
import type { InputTransaksi } from "@/lib/validation";
export function TransactionFields({
  form,
  setForm,
  mode,
}: Pick<TransactionsController, "form" | "setForm" | "mode">) {
  return (
    <div className="form-grid">
      <label>
        {UI.noTransaksi}
        <span>{UI.requiredMark}</span>
        <input
          required
          maxLength={LIMITS.codeLength}
          placeholder={UI.contohT001}
          value={form.nomor}
          disabled={mode === "koreksi"}
          onChange={(e) => setForm({ ...form, nomor: e.target.value })}
        />
      </label>
      <label>
        {UI.tanggal}
        <span>{UI.requiredMark}</span>
        <input
          type="date"
          required
          value={form.tanggal}
          onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
        />
      </label>
      <label>
        {UI.jenisTransaksi}
        <span>{UI.requiredMark}</span>
        <select
          value={form.jenis}
          onChange={(e) =>
            setForm({
              ...form,
              jenis: e.target.value as InputTransaksi["jenis"],
            })
          }
        >
          {TRANSACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {UI.kategori}
        <span>{UI.requiredMark}</span>
        <select
          value={form.kategori}
          onChange={(e) => {
            if (
              !form.items.length ||
              confirm(UI.mengubahKategoriAkanMengosongkanSeluruhItemLanjutkan)
            )
              setForm({
                ...form,
                kategori: e.target.value as InputTransaksi["kategori"],
                items: [],
              });
          }}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
