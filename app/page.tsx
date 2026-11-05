"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Search,
  Package,
  X,
  Trash2,
  Save,
  Pencil,
  Eye,
  ArrowLeftRight,
  RefreshCw,
} from "lucide-react";
import { api, Barang, Transaksi, formatTanggal } from "@/lib/client";
import { InputTransaksi, transaksiSchema } from "@/lib/validation";
const kosong = (): InputTransaksi => ({
  nomor: "",
  tanggal: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }),
  jenis: "MASUK",
  kategori: "SUBMAT",
  items: [],
});
export default function Page() {
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
  const dialog = useRef<HTMLDialogElement>(null);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [a, b] = await Promise.all([
        api<Transaksi[]>("/api/transaksi"),
        api<Barang[]>("/api/barang"),
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
  useEffect(() => {
    if (mode) dialog.current?.showModal();
    else dialog.current?.close();
  }, [mode]);
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
      await load();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }
  async function remove(t: Transaksi) {
    if (
      saving.current ||
      !confirm(
        `Hapus transaksi ${t.nomor} beserta seluruh item? Tindakan ini tidak dapat dibatalkan.`,
      )
    )
      return;
    saving.current = true;
    setBusy(true);
    setSuccess("");
    try {
      await api(`/api/transaksi/${encodeURIComponent(t.nomor)}`, {
        method: "DELETE",
      });
      setSuccess(`Transaksi ${t.nomor} berhasil dihapus.`);
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
  const readonly = mode === "detail";
  return (
    <>
      <div className="breadcrumb">
        Ruang kerja <span>/</span> Transaksi barang
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PERGERAKAN BARANG</div>
          <h1>Transaksi Barang</h1>
          <p>Catat dan kelola setiap barang masuk dan keluar.</p>
        </div>
        <button className="primary" onClick={() => open("tambah")}>
          <Plus size={18} />
          Tambah Transaksi
        </button>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="stat-icon blue">
            <ArrowLeftRight />
          </span>
          <div>
            <p>Total transaksi</p>
            <strong>{loading ? "—" : data.length}</strong>
            <small>Seluruh transaksi tercatat</small>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon green">
            <ArrowDownLeft />
          </span>
          <div>
            <p>Transaksi masuk</p>
            <strong>
              {loading ? "—" : data.filter((t) => t.jenis === "MASUK").length}
            </strong>
            <small>Penerimaan barang</small>
          </div>
        </div>
        <div className="stat">
          <span className="stat-icon orange">
            <ArrowUpRight />
          </span>
          <div>
            <p>Transaksi keluar</p>
            <strong>
              {loading ? "—" : data.filter((t) => t.jenis === "KELUAR").length}
            </strong>
            <small>Pengeluaran barang</small>
          </div>
        </div>
      </div>
      {error && (
        <div role="alert" className="alert error">
          {error} <button onClick={load}>Coba lagi</button>
        </div>
      )}
      {success && (
        <div role="status" className="alert success">
          {success}
        </div>
      )}
      <section className="card">
        <div className="card-heading">
          <div>
            <h2>
              Daftar transaksi <span className="count">{data.length}</span>
            </h2>
            <p>Riwayat pencatatan barang dalam satu tempat.</p>
          </div>
          <button
            className="icon-button"
            aria-label="Muat ulang"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={17} />
          </button>
        </div>
        <div className="toolbar">
          <label className="search">
            <Search size={18} />
            <input
              aria-label="Cari transaksi"
              placeholder="Cari nomor transaksi atau kategori…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <select
            aria-label="Filter jenis transaksi"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
          >
            <option value="">Semua jenis transaksi</option>
            <option>MASUK</option>
            <option>KELUAR</option>
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>No. transaksi</th>
                <th>Tanggal</th>
                <th>Jenis transaksi</th>
                <th>Kategori</th>
                <th>Jumlah item</th>
                <th className="right">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((t) => (
                <tr key={t.nomor}>
                  <td className="code">{t.nomor}</td>
                  <td>{formatTanggal(t.tanggal)}</td>
                  <td>
                    <span
                      className={`badge ${t.jenis === "MASUK" ? "in" : "out"}`}
                    >
                      {t.jenis === "MASUK" ? (
                        <ArrowDownLeft size={14} />
                      ) : (
                        <ArrowUpRight size={14} />
                      )}{" "}
                      {t.jenis === "MASUK" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td>
                    <span className="category">{t.kategori}</span>
                  </td>
                  <td>{t.items.length} barang</td>
                  <td>
                    <div className="actions">
                      <button
                        title="Lihat detail"
                        aria-label={`Detail ${t.nomor}`}
                        onClick={() => open("detail", t)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Koreksi"
                        aria-label={`Koreksi ${t.nomor}`}
                        onClick={() => open("koreksi", t)}
                        disabled={busy}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Hapus"
                        className="danger-text"
                        aria-label={`Hapus ${t.nomor}`}
                        onClick={() => remove(t)}
                        disabled={busy}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading ? (
            <div className="empty">Memuat transaksi…</div>
          ) : visible.length === 0 ? (
            <div className="empty">
              <Package size={32} />
              <h3>
                {search || jenis
                  ? "Transaksi tidak ditemukan"
                  : "Belum ada transaksi"}
              </h3>
              <p>
                {search || jenis
                  ? "Coba ubah pencarian atau filter."
                  : "Mulai dengan menambahkan transaksi barang pertama."}
              </p>
            </div>
          ) : null}
        </div>
        <div className="table-footer">
          Menampilkan {visible.length} dari {data.length} transaksi
          <span>Data tersimpan di database</span>
        </div>
      </section>
      <div className="page-note">
        <span className="note-dot" />
        Master barang tersedia dalam kategori SUBMAT dan RAWMAT.
      </div>
      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          if (!busy) setMode(null);
        }}
        className="transaction-dialog"
      >
        <form onSubmit={save}>
          <div className="dialog-heading">
            <div>
              <div className="eyebrow">TRANSAKSI BARANG</div>
              <h2>
                {mode === "tambah"
                  ? "Tambah transaksi"
                  : mode === "koreksi"
                    ? "Koreksi transaksi"
                    : "Detail transaksi"}
              </h2>
              <p>
                {readonly
                  ? "Informasi header dan rincian barang."
                  : "Lengkapi informasi dan rincian barang di bawah ini."}
              </p>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Tutup"
              disabled={busy}
              onClick={() => setMode(null)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="dialog-body">
            {formError && (
              <div className="alert error" role="alert">
                {formError}
              </div>
            )}
            <fieldset disabled={busy || readonly}>
              <div className="form-grid">
                <label>
                  No. transaksi <span>*</span>
                  <input
                    required
                    maxLength={5}
                    placeholder="Contoh: T001"
                    value={form.nomor}
                    disabled={mode === "koreksi"}
                    onChange={(e) =>
                      setForm({ ...form, nomor: e.target.value })
                    }
                  />
                </label>
                <label>
                  Tanggal <span>*</span>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={(e) =>
                      setForm({ ...form, tanggal: e.target.value })
                    }
                  />
                </label>
                <label>
                  Jenis transaksi <span>*</span>
                  <select
                    value={form.jenis}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jenis: e.target.value as InputTransaksi["jenis"],
                      })
                    }
                  >
                    <option value="MASUK">MASUK — Barang masuk</option>
                    <option value="KELUAR">KELUAR — Barang keluar</option>
                  </select>
                </label>
                <label>
                  Kategori <span>*</span>
                  <select
                    value={form.kategori}
                    onChange={(e) => {
                      if (
                        !form.items.length ||
                        confirm(
                          "Mengubah kategori akan mengosongkan seluruh item. Lanjutkan?",
                        )
                      )
                        setForm({
                          ...form,
                          kategori: e.target
                            .value as InputTransaksi["kategori"],
                          items: [],
                        });
                    }}
                  >
                    <option>SUBMAT</option>
                    <option>RAWMAT</option>
                  </select>
                </label>
              </div>
              <div className="items-heading">
                <h3>
                  Rincian barang{" "}
                  <span className="count">{form.items.length}</span>
                </h3>
                {!readonly && (
                  <button
                    type="button"
                    className="secondary small"
                    onClick={() =>
                      setForm({
                        ...form,
                        items: [...form.items, { kode: "", qty: 1 }],
                      })
                    }
                  >
                    <Plus size={15} />
                    Tambah Item
                  </button>
                )}
              </div>
              <div className="table-wrap item-table">
                <table>
                  <thead>
                    <tr>
                      <th>Kode barang</th>
                      <th>Nama barang</th>
                      <th>Satuan</th>
                      <th>QTY</th>
                      {!readonly && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, index) => {
                      const b = barang.find((b) => b.kode === item.kode);
                      return (
                        <tr key={index}>
                          <td>
                            <select
                              aria-label={`Barang ${index + 1}`}
                              required
                              value={item.kode}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  items: form.items.map((v, i) =>
                                    i === index
                                      ? { ...v, kode: e.target.value }
                                      : v,
                                  ),
                                })
                              }
                            >
                              <option value="">Pilih barang</option>
                              {barang
                                .filter((b) => b.kategori === form.kategori)
                                .sort((a, b) => a.kode.localeCompare(b.kode))
                                .map((b) => (
                                  <option
                                    key={b.kode}
                                    value={b.kode}
                                    disabled={form.items.some(
                                      (v, i) =>
                                        i !== index && v.kode === b.kode,
                                    )}
                                  >
                                    {b.kode}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td>{b?.nama || "—"}</td>
                          <td>{b?.satuan || "—"}</td>
                          <td>
                            <input
                              aria-label={`QTY ${index + 1}`}
                              type="number"
                              required
                              min={1}
                              max={2147483647}
                              step={1}
                              value={Number.isNaN(item.qty) ? "" : item.qty}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  items: form.items.map((v, i) =>
                                    i === index
                                      ? { ...v, qty: e.target.valueAsNumber }
                                      : v,
                                  ),
                                })
                              }
                            />
                          </td>
                          {!readonly && (
                            <td>
                              <button
                                type="button"
                                className="icon-button danger-text"
                                aria-label={`Hapus item ${index + 1}`}
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    items: form.items.filter(
                                      (_, i) => i !== index,
                                    ),
                                  })
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!form.items.length && (
                  <div className="empty">
                    <Package size={28} />
                    <p>
                      Belum ada item. Klik Tambah Item untuk memilih barang.
                    </p>
                  </div>
                )}
              </div>
            </fieldset>
            <p className="helper">
              QTY menggunakan satuan masing-masing barang. Satu barang hanya
              dapat dipilih sekali.
            </p>
          </div>
          <div className="dialog-footer">
            <span>{form.items.length} item barang</span>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => setMode(null)}
            >
              {readonly ? "Tutup" : "Batal"}
            </button>
            {!readonly && (
              <button className="primary" type="submit" disabled={busy}>
                <Save size={17} />
                {busy ? "Menyimpan…" : "Simpan Transaksi"}
              </button>
            )}
          </div>
        </form>
      </dialog>
    </>
  );
}
