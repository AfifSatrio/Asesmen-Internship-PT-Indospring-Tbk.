"use client";
import { UI } from "@/data";

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
      className="transaction-dialog"
    >
      <form onSubmit={save}>
        <div className="dialog-heading">
          <div>
            <div className="eyebrow">{UI.transaksiBarangEyebrow}</div>
            <h2>
              {mode === "tambah"
                ? UI.tambahTransaksi
                : mode === "koreksi"
                  ? UI.koreksiTransaksi
                  : UI.detailTransaksi}
            </h2>
            <p>
              {readonly
                ? UI.informasiHeaderDanRincianBarang
                : UI.lengkapiInformasiDanRincianBarangDiBawah}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={UI.tutup}
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
            {UI.qtyMenggunakanSatuanMasingMasingBarangSatu}
          </p>
        </div>
        <div className="dialog-footer">
          <span>
            {form.items.length} {UI.itemBarang}
          </span>
          <button
            type="button"
            className="secondary"
            disabled={busy}
            onClick={() => setMode(null)}
          >
            {readonly ? UI.tutup : UI.batal}
          </button>
          {!readonly && (
            <button className="primary" type="submit" disabled={busy}>
              <Save size={17} />
              {busy ? UI.menyimpan : UI.simpanTransaksi}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}
