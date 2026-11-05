"use client";

import { LIMITS } from "@/lib/validation";
import { Plus, Trash2, Package } from "lucide-react";
import type { TransactionsController } from "@/hooks/use-transactions";

export function TransactionItems({
  form,
  setForm,
  barang,
  readonly,
}: Pick<TransactionsController, "form" | "setForm" | "barang"> & {
  readonly: boolean;
}) {
  return (
    <div className="space-y-3 pt-2">
      {/* Detail Items Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
            <span>Rincian Barang</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-[4px] border border-slate-200 tabular-nums">
              {form.items.length} item
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Nama barang dan satuan terisi otomatis berdasarkan kode barang yang dipilih.
          </p>
        </div>

        {!readonly && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-[6px] hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors cursor-pointer"
            onClick={() =>
              setForm({
                ...form,
                items: [...form.items, { kode: "", qty: LIMITS.minQuantity }],
              })
            }
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Tambah Item</span>
          </button>
        )}
      </div>

      {/* Table Detail Items */}
      <div className="border border-slate-200 rounded-[6px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] text-slate-700 whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">
                  Kode Barang{" "}
                  <span className="text-[10px] text-blue-600 font-normal lowercase tracking-normal">
                    (input)
                  </span>
                </th>
                <th className="py-2.5 px-3">
                  Nama Barang{" "}
                  <span className="text-[10px] text-slate-400 font-normal lowercase tracking-normal">
                    (otomatis)
                  </span>
                </th>
                <th className="py-2.5 px-3">
                  Satuan{" "}
                  <span className="text-[10px] text-slate-400 font-normal lowercase tracking-normal">
                    (otomatis)
                  </span>
                </th>
                <th className="py-2.5 px-3 text-right">
                  QTY{" "}
                  <span className="text-[10px] text-blue-600 font-normal lowercase tracking-normal">
                    (input)
                  </span>
                </th>
                {!readonly && (
                  <th className="py-2.5 px-3 text-center w-24">
                    Hapus Baris
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {form.items.map((item, index) => {
                const b = barang.find((b) => b.kode === item.kode);
                return (
                  <tr key={index} className="hover:bg-slate-50/50">
                    {/* Kode Barang: User input via select */}
                    <td className="py-2.5 px-3">
                      <select
                        aria-label={`Barang ${index + 1}`}
                        required
                        value={item.kode}
                        disabled={readonly}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            items: form.items.map((v, i) =>
                              i === index ? { ...v, kode: e.target.value } : v,
                            ),
                          })
                        }
                        className="w-full min-w-[130px] px-2.5 py-1.5 text-sm bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                      >
                        <option value="">Pilih barang</option>
                        {barang
                          .filter((b) => b.kategori === form.kategori)
                          .sort((a, b) => a.kode.localeCompare(b.kode))
                          .map((b) => (
                            <option
                              key={b.kode}
                              value={b.kode}
                              disabled={form.items.some(
                                (v, i) => i !== index && v.kode === b.kode,
                              )}
                            >
                              {b.kode} — {b.nama}
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* Nama Barang: Otomatis */}
                    <td className="py-2.5 px-3">
                      <span className="text-sm text-slate-800 font-medium">
                        {b?.nama || (
                          <span className="text-slate-400 font-normal italic">
                            Otomatis terisi
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Satuan: Otomatis */}
                    <td className="py-2.5 px-3">
                      {b?.satuan ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-[4px] border border-slate-200">
                          {b.satuan}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">—</span>
                      )}
                    </td>

                    {/* QTY: User input number */}
                    <td className="py-2.5 px-3 text-right">
                      <input
                        aria-label={`QTY ${index + 1}`}
                        type="number"
                        required
                        min={LIMITS.minQuantity}
                        max={LIMITS.maxQuantity}
                        step={1}
                        disabled={readonly}
                        value={Number.isNaN(item.qty) ? "" : item.qty}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            items: form.items.map((v, i) =>
                              i === index
                                ? { ...v, qty: e.target.valueAsNumber }
                                : v,
                            ),
                          })
                        }
                        className="w-24 px-2.5 py-1.5 text-sm text-right tabular-nums bg-white border border-slate-200 rounded-[6px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                      />
                    </td>

                    {/* Aksi Baris: Hapus baris barang */}
                    {!readonly && (
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 cursor-pointer"
                          aria-label={`Hapus item ${index + 1}`}
                          title="Hapus baris barang ini"
                          onClick={() =>
                            setForm({
                              ...form,
                              items: form.items.filter((_, i) => i !== index),
                            })
                          }
                        >
                          <Trash2 size={14} />
                          <span className="text-[11px]">Hapus baris</span>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty Items State */}
        {!form.items.length && (
          <div className="py-8 px-4 text-center bg-slate-50/50">
            <Package size={24} className="mx-auto text-slate-400 mb-1.5" />
            <p className="text-xs font-medium text-slate-700">
              Belum ada rincian barang
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik tombol &ldquo;Tambah Item&rdquo; di atas untuk memilih kode barang dan menentukan QTY.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
