import { TRANSACTION_TYPES } from "@/lib/validation";
import { CATEGORIES } from "@/lib/validation";
export type Barang = {
  kode: string;
  nama: string;
  satuan: string;
  kategori: string;
};
export type Transaksi = {
  nomor: string;
  tanggal: string;
  jenis: (typeof TRANSACTION_TYPES)[number];
  kategori: (typeof CATEGORIES)[number];
  items: {
    kode: string;
    qty: number;
    barang: Barang;
  }[];
};
export type TransactionSummary = {
  total: number;
  masuk: number;
  keluar: number;
};
export type TransactionRow = Omit<Transaksi, "items"> & { itemCount: number };
export type TransactionPage = {
  items: TransactionRow[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  summary: TransactionSummary;
};
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(data?.error || "Permintaan gagal. Silakan coba lagi.");
  if (data === null)
    throw new Error("Respons server tidak valid. Silakan coba lagi.");
  return data;
}
export function formatTanggal(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
