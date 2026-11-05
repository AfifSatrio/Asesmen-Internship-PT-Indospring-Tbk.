"use client";
import {
  DEFAULT_TRANSACTION,
  LOCALIZATION,
  API_ROUTES,
  MESSAGES,
} from "@/data";

import { UI } from "@/data";

import { useEffect, useRef, useState } from "react";
import { api, type Barang, type Transaksi } from "@/lib/client";
import { type InputTransaksi, transaksiSchema } from "@/lib/validation";
const kosong = (): InputTransaksi => ({
  nomor: "",
  tanggal: new Date().toLocaleDateString(LOCALIZATION.dateInputLocale, {
    timeZone: LOCALIZATION.timeZone,
  }),
  jenis: DEFAULT_TRANSACTION.jenis,
  kategori: DEFAULT_TRANSACTION.kategori,
  items: [],
});
export function useTransactions() {
  const [data, setData] = useState<Transaksi[]>([]),
    [barang, setBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const [search, setSearch] = useState(""),
    [jenis, setJenis] = useState("");
  const [mode, setMode] = useState<"tambah" | "koreksi" | "detail" | null>(
      null,
    ),
    [form, setForm] = useState<InputTransaksi>(kosong);
  const [busy, setBusy] = useState(false),
    [formError, setFormError] = useState("");
  const saving = useRef(false);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [a, b] = await Promise.all([
        api<Transaksi[]>(API_ROUTES.transaksi),
        api<Barang[]>(API_ROUTES.barang),
      ]);
      setData(a);
      setBarang(b);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  function open(m: typeof mode, t?: Transaksi) {
    setForm(
      t
        ? {
            nomor: t.nomor,
            tanggal: t.tanggal.slice(0, 10),
            jenis: t.jenis,
            kategori: t.kategori,
            items: t.items.map(({ kode, qty }) => ({ kode, qty })),
          }
        : kosong(),
    );
    setFormError("");
    setMode(m);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving.current) return;
    setFormError("");
    const parsed = transaksiSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues.map((i) => i.message).join(" "));
      return;
    }
    if (
      form.items.some(
        (i) =>
          !barang.some(
            (b) => b.kode === i.kode && b.kategori === form.kategori,
          ),
      )
    ) {
      setFormError(UI.barangHarusSesuaiKategoriTransaksi);
      return;
    }
    saving.current = true;
    setBusy(true);
    try {
      await api(
        mode === "koreksi"
          ? API_ROUTES.transaksiDetail(form.nomor)
          : API_ROUTES.transaksi,
        {
          method: mode === "koreksi" ? "PUT" : "POST",
          body: JSON.stringify(parsed.data),
        },
      );
      setSuccess(MESSAGES.saved(form.nomor, mode === "koreksi"));
      setMode(null);
      await load();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  async function remove(t: Transaksi) {
    if (saving.current || !confirm(MESSAGES.confirmDelete(t.nomor))) return;
    saving.current = true;
    setBusy(true);
    setSuccess("");
    try {
      await api(API_ROUTES.transaksiDetail(t.nomor), {
        method: "DELETE",
      });
      setSuccess(MESSAGES.deleted(t.nomor));
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  const visible = data.filter(
    (t) =>
      (!jenis || t.jenis === jenis) &&
      `${t.nomor} ${t.kategori}`.toLowerCase().includes(search.toLowerCase()),
  );
  return {
    data,
    barang,
    loading,
    error,
    success,
    search,
    setSearch,
    jenis,
    setJenis,
    mode,
    setMode,
    form,
    setForm,
    busy,
    formError,
    load,
    open,
    save,
    remove,
    visible,
  };
}
export type TransactionsController = ReturnType<typeof useTransactions>;
