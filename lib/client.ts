import { TRANSACTION_TYPES, CATEGORIES, LOCALIZATION } from "@/data";

import { UI } from "@/data";
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
  items: { kode: string; qty: number; barang: Barang }[];
};
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || UI.permintaanGagal);
  return data;
}
export function formatTanggal(value: string) {
  return new Intl.DateTimeFormat(LOCALIZATION.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: LOCALIZATION.displayTimeZone,
  }).format(new Date(value));
}
