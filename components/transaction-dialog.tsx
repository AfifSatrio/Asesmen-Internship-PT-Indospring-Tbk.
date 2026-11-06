"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
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
      className="transaction-dialog"
      aria-labelledby="transaction-dialog-title"
      aria-describedby="transaction-dialog-description"
    >
      <form onSubmit={save} aria-busy={busy}>
        <div className="dialog-heading">
          <div>
            <h2 id="transaction-dialog-title">
              {mode === "tambah"
                ? "Tambah transaksi"
                : mode === "koreksi"
                  ? "Koreksi transaksi"
                  : "Detail transaksi"}
            </h2>
            <p id="transaction-dialog-description">
              {readonly
                ? "Informasi header dan rincian barang."
                : "Isi header transaksi, lalu tambahkan barang. Semua kolom bertanda * wajib diisi."}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={"Tutup"}
            disabled={busy}
            onClick={() => setMode(null)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="dialog-body">
          {formError && (
            <div className="alert error" role="alert">
              {formError}
            </div>
          )}
          <fieldset disabled={busy || readonly}>
            <TransactionFields form={form} setForm={setForm} mode={mode} />
            <TransactionItems
              form={form}
              setForm={setForm}
              barang={barang}
              readonly={readonly}
            />{" "}
          </fieldset>
          <p className="helper">
            {
              "QTY menggunakan satuan masing-masing barang. Satu barang hanya dapat dipilih sekali."
            }
          </p>
        </div>
        <div className="dialog-footer">
          <span>
            {form.items.length} {"item barang"}
          </span>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() => setMode(null)}
          >
            {readonly ? "Tutup" : "Batal"}
          </button>
          {!readonly && (
            <button className="primary" type="submit" disabled={busy}>
              {busy ? "Menyimpan…" : "Simpan Transaksi"}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
