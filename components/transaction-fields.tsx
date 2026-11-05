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
    <div className="form-grid">
      <label>
        {"No. transaksi"}
        <span>{"*"}</span>
        <input
          required
          maxLength={LIMITS.codeLength}
          placeholder={"Contoh: T001"}
          value={form.nomor}
          disabled={mode === "koreksi"}
          onChange={(e) => setForm({ ...form, nomor: e.target.value })}
        />
      </label>
      <label>
        {"Tanggal"}
        <span>{"*"}</span>
        <input
          type="date"
          required
          value={form.tanggal}
          onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
        />
      </label>
      <label>
        {"Jenis transaksi"}
        <span>{"*"}</span>
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
        {"Kategori"}
        <span>{"*"}</span>
        <select
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
