"use client";
const DEFAULT_PERIOD = { awal: "2021-01-01", akhir: "2021-02-28" };
import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { periodeSchema } from "@/lib/validation";
import type { Reports } from "@/types/reports";
export function useReports() {
  const [awal, setAwal] = useState(DEFAULT_PERIOD.awal),
    [akhir, setAkhir] = useState(DEFAULT_PERIOD.akhir),
    [period, setPeriod] = useState({
      awal: DEFAULT_PERIOD.awal,
      akhir: DEFAULT_PERIOD.akhir,
    });
  const [data, setData] = useState<Reports | null>(null),
    [tab, setTab] = useState<keyof Reports>("barang"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  async function load(a: string, b: string) {
    setError("");
    const p = periodeSchema.safeParse({ awal: a, akhir: b });
    if (!p.success) {
      setError(p.error.issues.map((i) => i.message).join(" "));
      return;
    }
    setLoading(true);
    setData(null);
    try {
      setData(
        await api<Reports>(
          `/api/laporan?${new URLSearchParams({ awal: a, akhir: b })}`,
        ),
      );
      setPeriod({ awal: a, akhir: b });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load(DEFAULT_PERIOD.awal, DEFAULT_PERIOD.akhir);
  }, []);
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
