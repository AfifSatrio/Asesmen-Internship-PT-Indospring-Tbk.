"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/client";
import { periodeSchema } from "@/lib/validation";
import type { Reports } from "@/types/reports";
const DEFAULT_PERIOD = { awal: "2021-01-01", akhir: "2021-02-28" };
export function useReports() {
  const [awal, setAwal] = useState(DEFAULT_PERIOD.awal),
    [akhir, setAkhir] = useState(DEFAULT_PERIOD.akhir),
    [period, setPeriod] = useState(DEFAULT_PERIOD);
  const [data, setData] = useState<Reports | null>(null),
    [tab, setTab] = useState<keyof Reports>("barang"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const sequence = useRef(0),
    abort = useRef<AbortController | null>(null),
    applied = useRef(DEFAULT_PERIOD);
  const load = useCallback(async (a: string, b: string) => {
    const id = ++sequence.current;
    abort.current?.abort();
    setError("");
    const parsed = periodeSchema.safeParse({ awal: a, akhir: b });
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(" "));
      setData(null);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    abort.current = controller;
    setLoading(true);
    setData(null);
    try {
      const value = await api<Reports>(
        `/api/laporan?${new URLSearchParams({ awal: a, akhir: b })}`,
        { signal: controller.signal },
      );
      if (id === sequence.current) {
        setData(value);
        setPeriod({ awal: a, akhir: b });
        applied.current = { awal: a, akhir: b };
      }
    } catch (e) {
      if (id === sequence.current && !controller.signal.aborted)
        setError(e instanceof Error ? e.message : "Gagal memuat laporan.");
    } finally {
      if (id === sequence.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load(DEFAULT_PERIOD.awal, DEFAULT_PERIOD.akhir);
    const refresh = () =>
      void load(applied.current.awal, applied.current.akhir);
    window.addEventListener("inventory:changed", refresh);
    const restored = (e: PageTransitionEvent) => {
      if (e.persisted) refresh();
    };
    window.addEventListener("pageshow", restored);
    return () => {
      sequence.current++;
      abort.current?.abort();
      window.removeEventListener("inventory:changed", refresh);
      window.removeEventListener("pageshow", restored);
    };
  }, [load]);
  return {
    awal,
    setAwal,
    akhir,
    setAkhir,
    period,
    data,
    tab,
    setTab,
    loading,
    error,
    load,
  };
}
export type ReportsController = ReturnType<typeof useReports>;
