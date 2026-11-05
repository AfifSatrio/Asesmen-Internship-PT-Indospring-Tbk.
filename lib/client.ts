export type Barang = {
  kode: string;
  nama: string;
  satuan: string;
  kategori: string;
};
export type Transaksi = {
  nomor: string;
  tanggal: string;
  jenis: "MASUK" | "KELUAR";
  kategori: "SUBMAT" | "RAWMAT";
  items: { kode: string; qty: number; barang: Barang }[];
};
export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Permintaan gagal.");
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
