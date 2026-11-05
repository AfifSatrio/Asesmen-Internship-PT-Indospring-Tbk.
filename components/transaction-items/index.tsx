"use client";
import { LIMITS, MESSAGES } from "@/data";

import { UI } from "@/data";

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
    <>
      {" "}
      <div className="items-heading">
        <h3>
          {UI.rincianBarang} <span className="count">{form.items.length}</span>
        </h3>
        {!readonly && (
          <button
            type="button"
            className="secondary small"
            onClick={() =>
              setForm({
                ...form,
                items: [...form.items, { kode: "", qty: LIMITS.minQuantity }],
              })
            }
          >
            <Plus size={15} />
            {UI.tambahItem}
          </button>
        )}
      </div>
      <div className="table-wrap item-table">
        <table>
          <thead>
            <tr>
              <th>{UI.kodeBarang}</th>
              <th>{UI.namaBarang}</th>
              <th>{UI.satuan}</th>
              <th>{UI.qty}</th>
              {!readonly && <th />}
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, index) => {
              const b = barang.find((b) => b.kode === item.kode);
              return (
                <tr key={index}>
                  <td>
                    <select
                      aria-label={MESSAGES.itemLabel(index + 1)}
                      required
                      value={item.kode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          items: form.items.map((v, i) =>
                            i === index ? { ...v, kode: e.target.value } : v,
                          ),
                        })
                      }
                    >
                      <option value="">{UI.pilihBarang}</option>
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
                            {b.kode}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>{b?.nama || UI.emptyValue}</td>
                  <td>{b?.satuan || UI.emptyValue}</td>
                  <td>
                    <input
                      aria-label={MESSAGES.quantityLabel(index + 1)}
                      type="number"
                      required
                      min={LIMITS.minQuantity}
                      max={LIMITS.maxQuantity}
                      step={1}
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
                    />
                  </td>
                  {!readonly && (
                    <td>
                      <button
                        type="button"
                        className="icon-button danger-text"
                        aria-label={MESSAGES.deleteItemLabel(index + 1)}
                        onClick={() =>
                          setForm({
                            ...form,
                            items: form.items.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!form.items.length && (
          <div className="empty">
            <Package size={28} />
            <p>{UI.belumAdaItemKlikTambahItemUntuk}</p>
          </div>
        )}
      </div>
    </>
  );
}
