"use client";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ArrowRight,
  Info,
  TableProperties,
  Layers,
  Trophy,
  Search,
} from "lucide-react";
import { api, formatTanggal } from "@/lib/client";
import { periodeSchema } from "@/lib/validation";
type Row = Record<string, string>;
type Reports = { barang: Row[]; kelompok: Row[]; tertinggi: Row[] };
const tabs = [
  { key: "barang", label: "Stok per barang", icon: TableProperties },
  { key: "kelompok", label: "Stok per kelompok", icon: Layers },
  { key: "tertinggi", label: "Pengeluaran tertinggi", icon: Trophy },
] as const;
const labels: Record<string, string> = {
  KODE_BARANG: "Kode barang",
  NAMA_BARANG: "Nama barang",
  SATUAN: "Satuan",
  KATEGORI: "Kategori",
  TRANS_MASUK: "Trans. masuk",
  TRANS_KELUAR: "Trans. keluar",
  STOK_AKHIR: "Stok akhir",
};
const columns = {
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
export default function Laporan() {
  const [awal, setAwal] = useState("2021-01-01"),
    [akhir, setAkhir] = useState("2021-02-28"),
    [period, setPeriod] = useState({ awal: "2021-01-01", akhir: "2021-02-28" });
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
      setData(await api<Reports>(`/api/laporan?awal=${a}&akhir=${b}`));
      setPeriod({ awal: a, akhir: b });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load("2021-01-01", "2021-02-28");
  }, []);
  return (
    <>
      <div className="breadcrumb">
        Ruang kerja <span>/</span> Laporan stok
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">RINGKASAN PERSEDIAAN</div>
          <h1>Laporan Stok</h1>
          <p>Pantau mutasi dan saldo barang dalam periode pilihan.</p>
        </div>
        <span className="heading-icon">
          <TableProperties size={25} />
        </span>
      </div>
      <section className="card period-card">
        <div className="period-title">
          <CalendarDays size={20} />
          <div>
            <h2>Periode laporan</h2>
            <p>Tanggal awal dan akhir termasuk dalam perhitungan.</p>
          </div>
        </div>
        <form
          className="period-form"
          onSubmit={(e) => {
            e.preventDefault();
            void load(awal, akhir);
          }}
        >
          <label>
            Tanggal awal
            <input
              type="date"
              required
              value={awal}
              onChange={(e) => setAwal(e.target.value)}
            />
          </label>
          <ArrowRight size={17} />
          <label>
            Tanggal akhir
            <input
              type="date"
              required
              value={akhir}
              onChange={(e) => setAkhir(e.target.value)}
            />
          </label>
          <button className="primary" disabled={loading}>
            <Search size={17} />
            {loading ? "Memuat…" : "Tampilkan Laporan"}
          </button>
        </form>
      </section>
      {error && (
        <div role="alert" className="alert error">
          {error}
        </div>
      )}
      <div className="info-note">
        <Info size={19} />
        <p>
          <strong>Perhitungan dalam periode</strong>Stok akhir = transaksi masuk
          − transaksi keluar. Saldo sebelum periode tidak disertakan.
        </p>
      </div>
      <div className="report-tabs" role="tablist" aria-label="Jenis laporan">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={tab === t.key ? "selected" : ""}
          >
            <t.icon size={17} />
            {t.label}
          </button>
        ))}
      </div>
      <section className="card" role="tabpanel">
        <div className="card-heading">
          <div>
            <h2>{tabs.find((t) => t.key === tab)?.label}</h2>
            <p>
              {formatTanggal(period.awal)} — {formatTanggal(period.akhir)}
            </p>
          </div>
          <span className="category">
            {data?.[tab].length ?? 0}{" "}
            {tab === "kelompok" ? "kelompok" : "barang"}
          </span>
        </div>
        {tab === "tertinggi" && (
          <p className="report-explanation">
            Barang dengan total pengeluaran tertinggi pada setiap kategori dan
            satuan. Seluruh nilai seri ditampilkan; kelompok tanpa pengeluaran
            dikecualikan.
          </p>
        )}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns[tab].map((c) => (
                  <th
                    key={c}
                    className={
                      c.startsWith("TRANS_") || c === "STOK_AKHIR"
                        ? "right"
                        : ""
                    }
                  >
                    {labels[c]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.[tab].map((r, i) => (
                <tr key={i}>
                  {columns[tab].map((c) => (
                    <td
                      key={c}
                      className={
                        c === "STOK_AKHIR"
                          ? "right stock"
                          : c.startsWith("TRANS_")
                            ? "right"
                            : c === "KODE_BARANG"
                              ? "code"
                              : ""
                      }
                    >
                      {c.startsWith("TRANS_") || c === "STOK_AKHIR"
                        ? BigInt(r[c]).toLocaleString("id-ID")
                        : r[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="empty">Menghitung laporan…</div>
          ) : !data?.[tab].length ? (
            <div className="empty">
              <TableProperties size={30} />
              <h3>
                {error
                  ? "Laporan belum tersedia"
                  : "Tidak ada data untuk periode ini"}
              </h3>
              <p>
                {error
                  ? "Periksa koneksi database dan coba tampilkan kembali."
                  : "Pilih periode lain atau tambahkan transaksi barang."}
              </p>
            </div>
          ) : null}
        </div>
        <div className="table-footer">
          {tab === "barang"
            ? "Termasuk barang tanpa transaksi"
            : tab === "kelompok"
              ? "Dikelompokkan berdasarkan kategori dan satuan"
              : "Peringkat berdasarkan total QTY keluar"}
          <span>Periode inklusif</span>
        </div>
      </section>
    </>
  );
}
