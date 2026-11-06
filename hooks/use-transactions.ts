"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  type Barang,
  type Transaksi,
  type TransactionRow,
  type TransactionPage,
} from "@/lib/client";
import { type InputTransaksi, transaksiSchema } from "@/lib/validation";
const kosong = (): InputTransaksi => ({
  nomor: "",
  tanggal: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }),
  jenis: "MASUK",
  kategori: "SUBMAT",
  items: [],
});
type Mode = "tambah" | "koreksi" | "detail" | null;
export function useTransactions() {
  const [result, setResult] = useState<TransactionPage | null>(null);
  const [query, setQuery] = useState({ page: 1, q: "", jenis: "" });
  const [search, setSearchValue] = useState("");
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  const [mode, setModeValue] = useState<Mode>(null),
    [form, setForm] = useState<InputTransaksi>(kosong);
  const [barang, setBarang] = useState<Barang[]>([]),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false),
    [detailError, setDetailError] = useState("");
  const saving = useRef(false),
    listSequence = useRef(0),
    detailSequence = useRef(0);
  const listAbort = useRef<AbortController | null>(null),
    detailAbort = useRef<AbortController | null>(null);
  const master = useRef<Barang[] | null>(null),
    masterRequest = useRef<Promise<Barang[]> | null>(null);
  const selected = useRef<{
    mode: Exclude<Mode, null>;
    row?: TransactionRow;
  } | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const invalidateList = useCallback(() => {
    listSequence.current++;
    listAbort.current?.abort();
    setLoading(true);
    setError("");
  }, []);
  const load = useCallback(() => {
    invalidateList();
    setRevision((v) => v + 1);
  }, [invalidateList]);
  function setSearch(value: string) {
    setSearchValue(value);
    invalidateList();
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setQuery((q) => ({ ...q, q: value.trim(), page: 1 }));
      debounce.current = null;
    }, 300);
  }
  function setJenis(value: string) {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = null;
    invalidateList();
    setQuery({ page: 1, q: search.trim(), jenis: value });
  }
  function setPage(page: number) {
    invalidateList();
    setQuery((q) => ({ ...q, page }));
  }
  useEffect(() => {
    const id = ++listSequence.current,
      controller = new AbortController();
    listAbort.current = controller;
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      page: String(query.page),
      q: query.q,
      jenis: query.jenis,
    });
    void api<TransactionPage>(`/api/transaksi?${params}`, {
      signal: controller.signal,
    })
      .then((value) => {
        if (id === listSequence.current) setResult(value);
      })
      .catch((e) => {
        if (id === listSequence.current && !controller.signal.aborted) {
          setResult(null);
          setError(e instanceof Error ? e.message : "Gagal memuat transaksi.");
        }
      })
      .finally(() => {
        if (id === listSequence.current) setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [query, revision]);
  useEffect(
    () => () => {
      listSequence.current++;
      detailSequence.current++;
      listAbort.current?.abort();
      detailAbort.current?.abort();
      if (debounce.current) clearTimeout(debounce.current);
    },
    [],
  );
  function getMaster() {
    if (master.current) return Promise.resolve(master.current);
    if (!masterRequest.current)
      masterRequest.current = api<Barang[]>("/api/barang")
        .then((value) => {
          master.current = value;
          return value;
        })
        .finally(() => {
          masterRequest.current = null;
        });
    return masterRequest.current;
  }
  function setMode(value: Mode) {
    if (value === null) {
      detailSequence.current++;
      detailAbort.current?.abort();
      selected.current = null;
    }
    setModeValue(value);
  }
  async function open(next: Exclude<Mode, null>, row?: TransactionRow) {
    if (saving.current) return;
    selected.current = { mode: next, row };
    const id = ++detailSequence.current;
    detailAbort.current?.abort();
    const controller = new AbortController();
    detailAbort.current = controller;
    setModeValue(next);
    setFormError("");
    setDetailError("");
    setDetailLoading(true);
    setForm(
      row
        ? {
            nomor: row.nomor,
            tanggal: row.tanggal.slice(0, 10),
            jenis: row.jenis,
            kategori: row.kategori,
            items: [],
          }
        : kosong(),
    );
    try {
      if (next === "tambah") {
        const goods = await getMaster();
        if (id === detailSequence.current) setBarang(goods);
      } else if (row) {
        const [detail, goods] = await Promise.all([
          api<Transaksi>(`/api/transaksi/${encodeURIComponent(row.nomor)}`, {
            signal: controller.signal,
          }),
          next === "koreksi" ? getMaster() : Promise.resolve(null),
        ]);
        if (id === detailSequence.current) {
          setForm({
            ...detail,
            tanggal: detail.tanggal.slice(0, 10),
            items: detail.items.map(({ kode, qty }) => ({ kode, qty })),
          });
          setBarang(goods ?? detail.items.map((i) => i.barang));
        }
      }
    } catch (e) {
      if (id === detailSequence.current && !controller.signal.aborted)
        setDetailError(
          e instanceof Error ? e.message : "Gagal memuat detail transaksi.",
        );
    } finally {
      if (id === detailSequence.current) setDetailLoading(false);
    }
  }
  function retryDetail() {
    if (selected.current)
      void open(selected.current.mode, selected.current.row);
  }
  function changed() {
    load();
    window.dispatchEvent(new Event("inventory:changed"));
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving.current || detailLoading || detailError) return;
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
      setFormError("Barang harus sesuai kategori transaksi.");
      return;
    }
    saving.current = true;
    setBusy(true);
    try {
      await api(
        mode === "koreksi"
          ? `/api/transaksi/${encodeURIComponent(form.nomor)}`
          : "/api/transaksi",
        {
          method: mode === "koreksi" ? "PUT" : "POST",
          body: JSON.stringify(parsed.data),
        },
      );
      setSuccess(
        `Transaksi ${form.nomor} berhasil ${mode === "koreksi" ? "dikoreksi" : "ditambahkan"}.`,
      );
      setMode(null);
      changed();
    } catch (e) {
      setFormError(
        e instanceof Error
          ? e.message
          : "Gagal menyimpan transaksi. Silakan coba lagi.",
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  async function remove(row: TransactionRow) {
    if (
      saving.current ||
      !confirm(
        `Hapus transaksi ${row.nomor} beserta seluruh item? Tindakan ini tidak dapat dibatalkan.`,
      )
    )
      return;
    saving.current = true;
    setBusy(true);
    setSuccess("");
    try {
      await api(`/api/transaksi/${encodeURIComponent(row.nomor)}`, {
        method: "DELETE",
      });
      setSuccess(`Transaksi ${row.nomor} berhasil dihapus.`);
      changed();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal menghapus transaksi. Silakan coba lagi.",
      );
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  return {
    visible: loading ? [] : (result?.items ?? []),
    summary: result?.summary ?? null,
    total: result?.total ?? 0,
    page: result?.page ?? query.page,
    totalPages: result?.totalPages ?? 1,
    setPage,
    barang,
    loading,
    error,
    success,
    search,
    setSearch,
    jenis: query.jenis,
    setJenis,
    mode,
    setMode,
    form,
    setForm,
    busy,
    formError,
    detailLoading,
    detailError,
    retryDetail,
    load,
    open,
    save,
    remove,
  };
}
export type TransactionsController = ReturnType<typeof useTransactions>;
