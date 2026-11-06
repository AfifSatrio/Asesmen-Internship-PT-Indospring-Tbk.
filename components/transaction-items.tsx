"use client";
import { LIMITS } from "@/lib/validation";

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
          {"Rincian barang"} <span className="count">{form.items.length}</span>
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
            {"Tambah Item"}
          </button>
        )}
      </div>
      <p className="helper item-hint">
        Pilih kode barang dan isi QTY. Nama barang serta satuan terisi otomatis.
      </p>
      <div
        className="table-wrap item-table"
        role="region"
        aria-label="Rincian barang"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th>Kode barang *</th>
              <th>
                Nama barang <span className="auto-label">Otomatis</span>
              </th>
              <th>
                Satuan <span className="auto-label">Otomatis</span>
              </th>
              <th className="right">QTY *</th>
              {!readonly && <th className="right">Baris</th>}
            </tr>
          </thead>
          <tbody>
            {form.items.map((item, index) => {
              const b = barang.find((b) => b.kode === item.kode);
              return (
                <tr key={index}>
                  <td>
                    <select
                      aria-label={`Barang ${index + 1}`}
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
                      <option value="">{"Pilih barang"}</option>
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
                  <td className="automatic-value">{b?.nama || "—"}</td>
                  <td className="automatic-value">{b?.satuan || "—"}</td>
                  <td className="right">
                    <input
                      aria-label={`QTY ${index + 1}`}
                      className="quantity-input"
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
                    <td className="right">
                      <button
                        type="button"
                        className="row-remove"
                        aria-label={`Hapus baris barang ${index + 1}`}
                        onClick={() =>
                          setForm({
                            ...form,
                            items: form.items.filter((_, i) => i !== index),
                          })
                        }
                      >
                        Hapus baris
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
            <p>{"Belum ada item. Klik Tambah Item untuk memilih barang."}</p>
          </div>
        )}
      </div>
    </>
  );
}
