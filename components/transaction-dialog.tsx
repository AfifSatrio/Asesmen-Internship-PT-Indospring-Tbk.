"use client";

import { useEffect, useRef } from "react";
import { X, Save } from "lucide-react";
import { TransactionFields } from "@/components/transaction-fields";
import { TransactionItems } from "@/components/transaction-items";
import type { TransactionsController } from "@/hooks/use-transactions";

export function TransactionDialog({
  mode,
  setMode,
  form,
  setForm,
  busy,
  formError,
  save,
  barang,
}: Pick<
  TransactionsController,
  | "mode"
  | "setMode"
  | "form"
  | "setForm"
  | "busy"
  | "formError"
  | "save"
  | "barang"
>) {
  const dialog = useRef<HTMLDialogElement>(null);
  const readonly = mode === "detail";

  useEffect(() => {
    if (mode) dialog.current?.showModal();
    else dialog.current?.close();
  }, [mode]);

  return (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) setMode(null);
      }}
      className="fixed inset-0 m-auto p-0 border border-slate-200 rounded-[8px] bg-white text-slate-900 max-w-2xl w-[calc(100%-2rem)] max-h-[90vh] overflow-hidden shadow-md"
    >
      <form onSubmit={save} className="flex flex-col max-h-[90vh]">
        {/* Dialog Header */}
        <div className="py-3.5 px-5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {mode === "tambah"
                ? "Tambah Transaksi Baru"
                : mode === "koreksi"
                  ? "Koreksi Transaksi"
                  : "Detail Transaksi"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {readonly
                ? "Informasi header dan rincian transaksi barang."
                : "Lengkapi informasi umum dan daftar barang transaksi di bawah ini."}
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Tutup"
            disabled={busy}
            onClick={() => setMode(null)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {formError && (
            <div
              role="alert"
              className="p-3 bg-rose-50 border border-rose-200 rounded-[6px] text-xs text-rose-800"
            >
              {formError}
            </div>
          )}

          <fieldset disabled={busy || readonly} className="border-0 p-0 m-0 space-y-4">
            <TransactionFields form={form} setForm={setForm} mode={mode} />
            <TransactionItems
              form={form}
              setForm={setForm}
              barang={barang}
              readonly={readonly}
            />
          </fieldset>

          <p className="text-[11px] text-slate-500 pt-1">
            * QTY menggunakan satuan masing-masing barang. Satu kode barang hanya dapat dipilih sekali per transaksi.
          </p>
        </div>

        {/* Dialog Footer */}
        <div className="py-3 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            {form.items.length} item terdaftar
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-[6px] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
              disabled={busy}
              onClick={() => setMode(null)}
            >
              {readonly ? "Tutup" : "Batal"}
            </button>
            {!readonly && (
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-[6px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save size={15} />
                <span>{busy ? "Menyimpan…" : "Simpan Transaksi"}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </dialog>
  );
}
