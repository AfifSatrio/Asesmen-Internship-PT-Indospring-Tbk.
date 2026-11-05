export const REPORT_TABS = [
  { key: "barang", label: "Stok per barang", icon: "table" },
  { key: "kelompok", label: "Stok per kelompok", icon: "layers" },
  { key: "tertinggi", label: "Pengeluaran tertinggi", icon: "trophy" },
] as const;
export const REPORT_LABELS: Record<string, string> = {
  KODE_BARANG: "Kode barang",
  NAMA_BARANG: "Nama barang",
  SATUAN: "Satuan",
  KATEGORI: "Kategori",
  TRANS_MASUK: "Trans. masuk",
  TRANS_KELUAR: "Trans. keluar",
  STOK_AKHIR: "Stok akhir",
};
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

export const DEFAULT_PERIOD = { awal: "2021-01-01", akhir: "2021-02-28" };
export const TRANSACTION_TYPES = ["MASUK", "KELUAR"] as const;
export const CATEGORIES = ["SUBMAT", "RAWMAT"] as const;
export const LIMITS = {
  codeLength: 5,
  minQuantity: 1,
  maxQuantity: 2147483647,
} as const;

// Shared Indonesian interface and validation copy. Keep this module free of React/server imports.
export const UI = {
  breadcrumbSeparator: "/",
  requiredMark: "*",
  ptIndospringTbk: "PT Indospring Tbk.",
  sistemTransaksiBarangV10: "Sistem Transaksi Barang · v1.0",
  periodeLaporan: "Periode laporan",
  tanggalAwalDanAkhirTermasukDalamPerhitungan:
    "Tanggal awal dan akhir termasuk dalam perhitungan.",
  tanggalAwal: "Tanggal awal",
  tanggalAkhir: "Tanggal akhir",
  memuat: "Memuat…",
  tampilkanLaporan: "Tampilkan Laporan",
  emptyValue: "—",
  kelompok: "kelompok",
  barang: "barang",
  barangDenganTotalPengeluaranTertinggiPadaSetiap:
    "Barang dengan total pengeluaran tertinggi pada setiap kategori dan satuan. Seluruh nilai seri ditampilkan; kelompok tanpa pengeluaran dikecualikan.",
  menghitungLaporan: "Menghitung laporan…",
  laporanBelumTersedia: "Laporan belum tersedia",
  tidakAdaDataUntukPeriodeIni: "Tidak ada data untuk periode ini",
  periksaKoneksiDatabaseDanCobaTampilkanKembali:
    "Periksa koneksi database dan coba tampilkan kembali.",
  pilihPeriodeLainAtauTambahkanTransaksiBarang:
    "Pilih periode lain atau tambahkan transaksi barang.",
  termasukBarangTanpaTransaksi: "Termasuk barang tanpa transaksi",
  dikelompokkanBerdasarkanKategoriDanSatuan:
    "Dikelompokkan berdasarkan kategori dan satuan",
  peringkatBerdasarkanTotalQtyKeluar: "Peringkat berdasarkan total QTY keluar",
  periodeInklusif: "Periode inklusif",
  jenisLaporan: "Jenis laporan",
  ruangKerja: "Ruang kerja",
  laporanStok: "Laporan stok",
  ringkasanPersediaan: "RINGKASAN PERSEDIAAN",
  laporanStokTitle: "Laporan Stok",
  pantauMutasiDanSaldoBarangDalamPeriode:
    "Pantau mutasi dan saldo barang dalam periode pilihan.",
  perhitunganDalamPeriode: "Perhitungan dalam periode",
  stokAkhirTransaksiMasukTransaksiKeluarSaldo:
    "Stok akhir = transaksi masuk − transaksi keluar. Saldo sebelum periode tidak disertakan.",
  indospring: "INDOSPRING",
  inventoryManagement: "INVENTORY MANAGEMENT",
  ruangKerjaEyebrow: "RUANG KERJA",
  transaksiBarang: "Transaksi Barang",
  pencatatanTerpusat: "Pencatatan terpusat",
  kelolaPergerakanBarangDenganDataYangTerhubung:
    "Kelola pergerakan barang dengan data yang terhubung.",
  asesmenItSoftware2026: "Asesmen IT Software · 2026",
  sistemPencatatanBarang: "Sistem Pencatatan Barang",
  itSoftware: "IT SOFTWARE",
  is: "IS",
  transaksiBarangEyebrow: "TRANSAKSI BARANG",
  tambahTransaksi: "Tambah transaksi",
  koreksiTransaksi: "Koreksi transaksi",
  detailTransaksi: "Detail transaksi",
  informasiHeaderDanRincianBarang: "Informasi header dan rincian barang.",
  lengkapiInformasiDanRincianBarangDiBawah:
    "Lengkapi informasi dan rincian barang di bawah ini.",
  tutup: "Tutup",
  qtyMenggunakanSatuanMasingMasingBarangSatu:
    "QTY menggunakan satuan masing-masing barang. Satu barang hanya dapat dipilih sekali.",
  itemBarang: "item barang",
  batal: "Batal",
  menyimpan: "Menyimpan…",
  simpanTransaksi: "Simpan Transaksi",
  noTransaksi: "No. transaksi",
  contohT001: "Contoh: T001",
  tanggal: "Tanggal",
  jenisTransaksi: "Jenis transaksi",
  masukBarangMasuk: "MASUK — Barang masuk",
  keluarBarangKeluar: "KELUAR — Barang keluar",
  kategori: "Kategori",
  mengubahKategoriAkanMengosongkanSeluruhItemLanjutkan:
    "Mengubah kategori akan mengosongkan seluruh item. Lanjutkan?",
  submat: "SUBMAT",
  rawmat: "RAWMAT",
  cariTransaksi: "Cari transaksi",
  cariNomorTransaksiAtauKategori: "Cari nomor transaksi atau kategori…",
  filterJenisTransaksi: "Filter jenis transaksi",
  semuaJenisTransaksi: "Semua jenis transaksi",
  masuk: "MASUK",
  keluar: "KELUAR",
  rincianBarang: "Rincian barang",
  tambahItem: "Tambah Item",
  kodeBarang: "Kode barang",
  namaBarang: "Nama barang",
  satuan: "Satuan",
  qty: "QTY",
  pilihBarang: "Pilih barang",
  belumAdaItemKlikTambahItemUntuk:
    "Belum ada item. Klik Tambah Item untuk memilih barang.",
  daftarTransaksi: "Daftar transaksi",
  riwayatPencatatanBarangDalamSatuTempat:
    "Riwayat pencatatan barang dalam satu tempat.",
  muatUlang: "Muat ulang",
  jumlahItem: "Jumlah item",
  tindakan: "Tindakan",
  masukLabel: "Masuk",
  keluarLabel: "Keluar",
  lihatDetail: "Lihat detail",
  koreksi: "Koreksi",
  hapus: "Hapus",
  memuatTransaksi: "Memuat transaksi…",
  transaksiTidakDitemukan: "Transaksi tidak ditemukan",
  belumAdaTransaksi: "Belum ada transaksi",
  cobaUbahPencarianAtauFilter: "Coba ubah pencarian atau filter.",
  mulaiDenganMenambahkanTransaksiBarangPertama:
    "Mulai dengan menambahkan transaksi barang pertama.",
  menampilkan: "Menampilkan",
  dari: "dari",
  transaksi: "transaksi",
  dataTersimpanDiDatabase: "Data tersimpan di database",
  totalTransaksi: "Total transaksi",
  seluruhTransaksiTercatat: "Seluruh transaksi tercatat",
  transaksiMasuk: "Transaksi masuk",
  penerimaanBarang: "Penerimaan barang",
  transaksiKeluar: "Transaksi keluar",
  pengeluaranBarang: "Pengeluaran barang",
  transaksiBarangBreadcrumb: "Transaksi barang",
  pergerakanBarang: "PERGERAKAN BARANG",
  catatDanKelolaSetiapBarangMasukDan:
    "Catat dan kelola setiap barang masuk dan keluar.",
  tambahTransaksiButton: "Tambah Transaksi",
  cobaLagi: "Coba lagi",
  masterBarangTersediaDalamKategoriSubmatDan:
    "Master barang tersedia dalam kategori SUBMAT dan RAWMAT.",
  barangHarusSesuaiKategoriTransaksi: "Barang harus sesuai kategori transaksi.",
  permintaanGagal: "Permintaan gagal.",
  formatJsonTidakValid: "Format JSON tidak valid.",
  nomorTransaksiSudahDigunakan: "Nomor transaksi sudah digunakan.",
  transaksiTidakDitemukanAtauSudahDihapus:
    "Transaksi tidak ditemukan atau sudah dihapus.",
  dataSedangDiubahPenggunaLainMuatUlang:
    "Data sedang diubah pengguna lain. Muat ulang dan coba lagi.",
  gagalMengaksesDatabasePeriksaKoneksiDanSetup:
    "Gagal mengakses database. Periksa koneksi dan setup database.",
  nomorTransaksiTidakDapatDiubah: "Nomor transaksi tidak dapat diubah.",
  barangTidakTerdaftarAtauTidakSesuaiKategori:
    "Barang tidak terdaftar atau tidak sesuai kategori transaksi.",
  tanggalHarusYyyyMmDd: "Tanggal harus YYYY-MM-DD.",
  tanggalTidakValid: "Tanggal tidak valid.",
  nomorTransaksiWajibDiisi: "Nomor transaksi wajib diisi.",
  nomorTransaksiMaksimal5Karakter: "Nomor transaksi maksimal 5 karakter.",
  nomorHanyaBolehHurufAngkaAtau: "Nomor hanya boleh huruf, angka, _ atau -.",
  jenisTransaksiHarusMasukAtauKeluar:
    "Jenis transaksi harus MASUK atau KELUAR.",
  kategoriTidakValid: "Kategori tidak valid.",
  pilihBarangValidation: "Pilih barang.",
  qtyHarusBilanganBulat: "QTY harus bilangan bulat.",
  qtyMinimal1: "QTY minimal 1.",
  qtyMelebihiBatasInteger: "QTY melebihi batas integer.",
  tambahkanMinimalSatuItem: "Tambahkan minimal satu item.",
  barangTidakBolehBerulangDalamSatuTransaksi:
    "Barang tidak boleh berulang dalam satu transaksi.",
  tanggalAwalTidakBolehMelewatiTanggalAkhir:
    "Tanggal awal tidak boleh melewati tanggal akhir.",
  transaksiTidakDitemukanError: "Transaksi tidak ditemukan.",
  transaksiDanSeluruhItemBerhasilDihapus:
    "Transaksi dan seluruh item berhasil dihapus.",
} as const;

export const APP_METADATA = {
  title: "Transaksi Barang | Indospring",
  description:
    "Pencatatan transaksi barang masuk, keluar, dan laporan stok PT Indospring Tbk.",
};
export const LOCALIZATION = {
  language: "id",
  locale: "id-ID",
  dateInputLocale: "en-CA",
  timeZone: "Asia/Jakarta",
  displayTimeZone: "UTC",
} as const;
export const TRANSACTION_KIND = {
  masuk: TRANSACTION_TYPES[0],
  keluar: TRANSACTION_TYPES[1],
} as const;
export const DEFAULT_TRANSACTION = {
  jenis: TRANSACTION_TYPES[0],
  kategori: CATEGORIES[0],
};
export const TRANSACTION_OPTIONS = [
  { value: TRANSACTION_KIND.masuk, label: UI.masukBarangMasuk },
  { value: TRANSACTION_KIND.keluar, label: UI.keluarBarangKeluar },
] as const;
export const NAVIGATION = [
  { href: "/", label: UI.transaksiBarang, icon: "transactions" },
  { href: "/laporan", label: UI.laporanStokTitle, icon: "reports" },
] as const;
export const API_ROUTES = {
  barang: "/api/barang",
  transaksi: "/api/transaksi",
  transaksiDetail: (nomor: string) =>
    `/api/transaksi/${encodeURIComponent(nomor)}`,
  laporan: (awal: string, akhir: string) =>
    `/api/laporan?${new URLSearchParams({ awal, akhir })}`,
};
export const MESSAGES = {
  saved: (nomor: string, correction: boolean) =>
    `Transaksi ${nomor} berhasil ${correction ? "dikoreksi" : "ditambahkan"}.`,
  deleted: (nomor: string) => `Transaksi ${nomor} berhasil dihapus.`,
  confirmDelete: (nomor: string) =>
    `Hapus transaksi ${nomor} beserta seluruh item? Tindakan ini tidak dapat dibatalkan.`,
  detailLabel: (nomor: string) => `Detail ${nomor}`,
  editLabel: (nomor: string) => `Koreksi ${nomor}`,
  deleteLabel: (nomor: string) => `Hapus ${nomor}`,
  itemLabel: (index: number) => `Barang ${index}`,
  quantityLabel: (index: number) => `QTY ${index}`,
  deleteItemLabel: (index: number) => `Hapus item ${index}`,
  transactionCount: (shown: number, total: number) =>
    `Menampilkan ${shown} dari ${total} transaksi`,
  itemCount: (count: number) => `${count} barang`,
};
