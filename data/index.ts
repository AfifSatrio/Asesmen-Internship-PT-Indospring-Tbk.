// Konfigurasi statis komponen UI. Tidak berisi komponen React atau state.

export const NAVIGATION = [
  { href: "/", label: "Transaksi Barang", icon: "transactions" },
  { href: "/laporan", label: "Laporan Stok", icon: "reports" },
] as const;

export const TRANSACTION_OPTIONS = [
  { value: "MASUK", label: "MASUK — Barang masuk" },
  { value: "KELUAR", label: "KELUAR — Barang keluar" },
] as const;

export const REPORT_TABS = [
  { key: "barang", label: "Stok per barang", icon: "table" },
  { key: "kelompok", label: "Stok per kelompok", icon: "layers" },
  { key: "tertinggi", label: "Pengeluaran tertinggi", icon: "trophy" },
] as const;

export const REPORT_COLUMNS = {
  barang: [
    "KODE_BARANG",
    "NAMA_BARANG",
    "SATUAN",
    "KATEGORI",
    "TRANS_MASUK",
    "TRANS_KELUAR",
    "STOK_AKHIR",
  ],
  kelompok: ["KATEGORI", "SATUAN", "TRANS_MASUK", "TRANS_KELUAR", "STOK_AKHIR"],
  tertinggi: [
    "KATEGORI",
    "SATUAN",
    "KODE_BARANG",
    "NAMA_BARANG",
    "TRANS_KELUAR",
  ],
};

export const REPORT_LABELS: Record<string, string> = {
  KODE_BARANG: "Kode barang",
  NAMA_BARANG: "Nama barang",
  SATUAN: "Satuan",
  KATEGORI: "Kategori",
  TRANS_MASUK: "Trans. masuk",
  TRANS_KELUAR: "Trans. keluar",
  STOK_AKHIR: "Stok akhir",
};
