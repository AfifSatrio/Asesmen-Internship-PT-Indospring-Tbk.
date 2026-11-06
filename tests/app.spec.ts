import { test, expect, Page } from "@playwright/test";
import fs from "node:fs";
const samples = [
  {
    nomor: "T001",
    tanggal: "2021-01-01",
    jenis: "MASUK",
    kategori: "SUBMAT",
    items: [
      ["S001", 10],
      ["S002", 4],
      ["S003", 6],
    ],
  },
  {
    nomor: "T002",
    tanggal: "2021-01-05",
    jenis: "KELUAR",
    kategori: "SUBMAT",
    items: [
      ["S001", 4],
      ["S002", 1],
      ["S003", 2],
    ],
  },
  {
    nomor: "T003",
    tanggal: "2021-02-10",
    jenis: "MASUK",
    kategori: "SUBMAT",
    items: [
      ["S002", 6],
      ["S003", 2],
    ],
  },
  {
    nomor: "T004",
    tanggal: "2021-01-10",
    jenis: "MASUK",
    kategori: "RAWMAT",
    items: [
      ["R001", 10],
      ["R002", 5],
    ],
  },
  {
    nomor: "T005",
    tanggal: "2021-01-25",
    jenis: "KELUAR",
    kategori: "RAWMAT",
    items: [["R001", 5]],
  },
];
async function fill(page: Page, t: (typeof samples)[number]) {
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .click();
  await page.getByLabel("No. transaksi").fill(t.nomor);
  await page.getByLabel("Tanggal", { exact: false }).fill(t.tanggal);
  await page
    .getByLabel("Jenis transaksi", { exact: false })
    .last()
    .selectOption(t.jenis);
  await page
    .getByLabel("Kategori", { exact: false })
    .last()
    .selectOption(t.kategori);
  for (let i = 0; i < t.items.length; i++) {
    await page
      .getByRole("button", { name: "Tambah Item", exact: true })
      .click();
    await page
      .getByLabel(`Barang ${i + 1}`, { exact: true })
      .selectOption(String(t.items[i][0]));
    await page
      .getByLabel(`QTY ${i + 1}`, { exact: true })
      .fill(String(t.items[i][1]));
  }
}
test("form CRUD, validasi API, laporan contoh, periode, seri, dan responsif", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  // Safety: use only an explicitly opted-in disposable database. Never erase existing records.
  test.skip(
    process.env.E2E_ALLOW_WRITE !== "1",
    "Set E2E_ALLOW_WRITE=1 only for a dedicated empty test database.",
  );
  const before = await request.get("/api/transaksi");
  expect(before.ok()).toBeTruthy();
  expect((await before.json()).items).toEqual([]);
  fs.mkdirSync("docs/screenshots", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByText("Belum ada transaksi", { exact: true }),
  ).toBeVisible();
  for (const t of samples) {
    await fill(page, t);
    if (t.nomor === "T001")
      await page.screenshot({
        path: "docs/screenshots/form-transaksi.png",
        fullPage: true,
      });
    await page
      .getByRole("button", { name: "Simpan Transaksi", exact: true })
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.getByText(t.nomor, { exact: true })).toBeVisible();
  }
  await page.screenshot({
    path: "docs/screenshots/daftar-transaksi.png",
    fullPage: true,
  });
  const valid = {
    nomor: "X001",
    tanggal: "2021-01-01",
    jenis: "MASUK",
    kategori: "SUBMAT",
    items: [{ kode: "S001", qty: 1 }],
  };
  for (const patch of [
    { items: [] },
    { items: [{ kode: "S001", qty: 0 }] },
    { items: [{ kode: "S001", qty: -1 }] },
    { items: [{ kode: "S001", qty: 1.5 }] },
    { items: [{ kode: "S001", qty: 2147483648 }] },
    { items: [{ kode: "R001", qty: 1 }] },
    { items: [{ kode: "XXXXX", qty: 1 }] },
    {
      items: [
        { kode: "S001", qty: 1 },
        { kode: "S001", qty: 2 },
      ],
    },
    { tanggal: "2021-02-30" },
    { nomor: "TOOLONG" },
  ])
    expect(
      (
        await request.post("/api/transaksi", { data: { ...valid, ...patch } })
      ).status(),
    ).toBe(400);
  expect(
    (
      await request.post("/api/transaksi", {
        data: { ...valid, nomor: "T001" },
      })
    ).status(),
  ).toBe(409);
  expect(
    (
      await request.put("/api/transaksi/T001", {
        data: { ...valid, nomor: "OTHER" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.put("/api/transaksi/T001", {
        data: { ...valid, nomor: "T001", items: [{ kode: "R001", qty: 99 }] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (await (await request.get("/api/transaksi/T001")).json()).items,
  ).toHaveLength(3);
  const report = await (
    await request.get("/api/laporan?awal=2021-01-01&akhir=2021-02-28")
  ).json();
  expect(
    Object.fromEntries(
      report.barang.map((r: Record<string, string>) => [
        r.KODE_BARANG,
        r.STOK_AKHIR,
      ]),
    ),
  ).toEqual({ S001: "6", S002: "9", S003: "6", R001: "5", R002: "5" });
  expect(
    report.kelompok.map((r: Record<string, string>) => [
      r.KATEGORI,
      r.SATUAN,
      r.STOK_AKHIR,
    ]),
  ).toEqual([
    ["SUBMAT", "BOX", "6"],
    ["SUBMAT", "PCS", "15"],
    ["RAWMAT", "KG", "10"],
  ]);
  expect(
    report.tertinggi.map((r: Record<string, string>) => [
      r.KODE_BARANG,
      r.TRANS_KELUAR,
    ]),
  ).toEqual([
    ["S001", "4"],
    ["S003", "2"],
    ["R001", "5"],
  ]);
  const empty = await (
    await request.get("/api/laporan?awal=2020-01-01&akhir=2020-02-28")
  ).json();
  expect(empty.barang).toHaveLength(5);
  expect(
    empty.barang.every((r: Record<string, string>) => r.STOK_AKHIR === "0"),
  ).toBeTruthy();
  expect(empty.tertinggi).toEqual([]);
  const boundary = await (
    await request.get("/api/laporan?awal=2021-01-01&akhir=2021-01-01")
  ).json();
  expect(
    boundary.barang.find(
      (r: Record<string, string>) => r.KODE_BARANG === "S001",
    ).STOK_AKHIR,
  ).toBe("10");
  expect(
    (
      await request.get("/api/laporan?awal=2021-02-01&akhir=2021-01-01")
    ).status(),
  ).toBe(400);
  await page.getByRole("link", { name: "Laporan Stok", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "KLIP", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/laporan-barang.png",
    fullPage: true,
  });
  await page.getByRole("tab", { name: "Stok per kelompok" }).click();
  await expect(
    page.getByRole("cell", { name: "15", exact: true }).first(),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/laporan-kelompok.png",
    fullPage: true,
  });
  await page.getByRole("tab", { name: "Pengeluaran tertinggi" }).click();
  await expect(
    page.getByRole("cell", { name: "PALET", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/laporan-tertinggi.png",
    fullPage: true,
  });
  await page
    .getByRole("link", { name: "Transaksi Barang", exact: true })
    .click();
  await fill(page, {
    nomor: "X001",
    tanggal: "2021-02-28",
    jenis: "KELUAR",
    kategori: "SUBMAT",
    items: [["S002", 1]],
  });
  page.once("dialog", (d) => d.dismiss());
  await page
    .getByLabel("Kategori", { exact: false })
    .last()
    .selectOption("RAWMAT");
  await expect(page.getByLabel("Barang 1", { exact: true })).toHaveValue(
    "S002",
  );
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const tied = await (
    await request.get("/api/laporan?awal=2021-01-01&akhir=2021-02-28")
  ).json();
  expect(
    tied.tertinggi.filter((r: Record<string, string>) => r.SATUAN === "PCS"),
  ).toHaveLength(2);
  await page.getByRole("button", { name: "Koreksi X001", exact: true }).click();
  await expect(page.getByLabel("No. transaksi")).toBeDisabled();
  await page.getByLabel("QTY 1", { exact: true }).fill("3");
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(
    (await (await request.get("/api/transaksi/X001")).json()).items[0].qty,
  ).toBe(3);
  await page.getByRole("button", { name: "Detail X001", exact: true }).click();
  await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("3");
  await page.getByRole("button", { name: "Tutup", exact: true }).last().click();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Hapus X001", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "X001", exact: true }),
  ).not.toBeVisible();
  expect((await request.get("/api/transaksi/X001")).status()).toBe(404);
  expect((await request.delete("/api/transaksi/ZZZZZ")).status()).toBe(404);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "docs/screenshots/mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
});
