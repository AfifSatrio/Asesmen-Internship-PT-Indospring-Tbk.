import { test, expect } from "@playwright/test";

test.beforeEach(() => {
  test.skip(
    process.env.E2E_ALLOW_WRITE !== "1",
    "Gunakan database pengujian terpisah dengan E2E_ALLOW_WRITE=1.",
  );
});

test("pagination 20, urutan stabil, query invalid, dan detail sesuai kebutuhan", async ({
  page,
  request,
}) => {
  const ids = Array.from(
    { length: 25 },
    (_, i) => `P${String(i + 1).padStart(3, "0")}`,
  );
  for (const nomor of ids)
    expect(
      (
        await request.post("/api/transaksi", {
          data: {
            nomor,
            tanggal: "2026-01-01",
            jenis: "MASUK",
            kategori: "SUBMAT",
            items: [{ kode: "S001", qty: 1 }],
          },
        })
      ).status(),
    ).toBe(201);
  try {
    const first = await (await request.get("/api/transaksi?q=P")).json();
    const second = await (
      await request.get("/api/transaksi?q=P&page=2")
    ).json();
    expect(first.items).toHaveLength(20);
    expect(second.items).toHaveLength(5);
    expect([...first.items, ...second.items].map((i) => i.nomor)).toEqual(ids);
    expect(first.items[0].items).toBeUndefined();
    expect(first.items[0].itemCount).toBe(1);
    expect(first.summary.total).toBeGreaterThanOrEqual(25);
    expect(
      (await (await request.get("/api/transaksi?q=P&page=999")).json()).page,
    ).toBe(2);
    for (const q of [
      "page=0",
      "page=-1",
      "page=1.2",
      "page=abc",
      "page=1000001",
      "pageSize=100",
      "jenis=SALAH",
      "page=1&page=2",
      "q=" + "x".repeat(51),
    ])
      expect((await request.get("/api/transaksi?" + q)).status()).toBe(400);
    for (const q of [
      "awal=2021-02-30&akhir=2021-03-01",
      "awal=2021-03-01&akhir=2021-01-01",
      "awal=2021-01-01",
    ])
      expect((await request.get("/api/laporan?" + q)).status()).toBe(400);
    let masters = 0,
      details = 0;
    page.on("request", (r) => {
      const path = new URL(r.url()).pathname;
      if (path === "/api/barang") masters++;
      if (/^\/api\/transaksi\//.test(path)) details++;
    });
    await page.goto("/");
    await expect(
      page.getByRole("cell", { name: "P001", exact: true }),
    ).toBeVisible();
    expect(masters).toBe(0);
    expect(details).toBe(0);
    await page.getByRole("button", { name: "Berikutnya", exact: true }).click();
    await expect(
      page.getByRole("cell", { name: "P021", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Detail P021", exact: true })
      .click();
    await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("1");
    expect(details).toBe(1);
    expect(masters).toBe(0);
    await page
      .getByRole("button", { name: "Tutup", exact: true })
      .last()
      .click();
    await page
      .getByRole("button", { name: "Koreksi P021", exact: true })
      .click();
    await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("1");
    expect(masters).toBe(1);
    await page.getByRole("button", { name: "Batal", exact: true }).click();
    await page
      .getByRole("button", { name: "Koreksi P022", exact: true })
      .click();
    await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("1");
    expect(masters).toBe(1);
    await page.getByRole("button", { name: "Batal", exact: true }).click();
    await page.getByRole("textbox", { name: "Cari transaksi" }).fill("P025");
    await expect(
      page.getByRole("cell", { name: "P025", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Halaman 1 dari 1", { exact: true }),
    ).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(
      page.getByRole("button", { name: "Berikutnya", exact: true }),
    ).toBeDisabled();
  } finally {
    for (const id of ids) await request.delete(`/api/transaksi/${id}`);
  }
});

test("debounce dan respons lama tidak menimpa hasil terbaru", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("cell", { name: "T001", exact: true }),
  ).toBeVisible();
  const queries: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.pathname === "/api/transaksi")
      queries.push(u.searchParams.get("q") ?? "");
  });
  const search = page.getByRole("textbox", { name: "Cari transaksi" });
  await search.fill("T");
  await search.fill("T0");
  await search.fill("T003");
  await expect(
    page.getByRole("cell", { name: "T003", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".table-footer")).toContainText(
    "Menampilkan 1 dari 1 transaksi",
  );
  expect(queries).toEqual(["T003"]);
  let release: () => void = () => {};
  let seen: () => void = () => {};
  const oldStarted = new Promise<void>((r) => (seen = r)),
    gate = new Promise<void>((r) => (release = r));
  await page.route("**/api/transaksi?*", async (route) => {
    const u = new URL(route.request().url());
    if (u.searchParams.get("q") === "T001") {
      const response = await route.fetch();
      seen();
      await gate;
      await route.fulfill({ response }).catch(() => {});
    } else await route.continue();
  });
  await search.fill("T001");
  await oldStarted;
  await search.fill("T002");
  await expect(
    page.getByRole("cell", { name: "T002", exact: true }),
  ).toBeVisible();
  release();
  await page.waitForTimeout(400); // Allow the deliberately late response to arrive.
  await expect(
    page.getByRole("cell", { name: "T002", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "T001", exact: true }),
  ).toHaveCount(0);
});

test("API gagal: retry daftar/detail/master/laporan, input tersimpan, refresh setelah mutasi", async ({
  page,
  request,
}) => {
  await page.route("**/api/transaksi?*", (r) =>
    r.fulfill({ status: 503, json: { error: "Daftar sementara gagal." } }),
  );
  await page.goto("/");
  await expect(page.locator('.alert[role="alert"]')).toContainText(
    "Daftar sementara gagal.",
  );
  await page.unroute("**/api/transaksi?*");
  await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "T001", exact: true }),
  ).toBeVisible();
  await page.route("**/api/transaksi/T001", (r) =>
    r.fulfill({ status: 503, json: { error: "Detail sementara gagal." } }),
  );
  await page.getByRole("button", { name: "Koreksi T001", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Detail sementara gagal.",
  );
  await expect(
    page.getByRole("button", { name: "Simpan Transaksi", exact: true }),
  ).toBeDisabled();
  await page.unroute("**/api/transaksi/T001");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Coba lagi", exact: true })
    .click();
  await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("10");
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  // New page clears the session-local master cache; test retry without replacing input.
  await page.reload();
  await expect(
    page.getByRole("cell", { name: "T001", exact: true }),
  ).toBeVisible();
  await page.route("**/api/barang", (r) =>
    r.fulfill({ status: 503, json: { error: "Master sementara gagal." } }),
  );
  await page
    .getByRole("button", { name: "Tambah Transaksi", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Master sementara gagal.",
  );
  await page.unroute("**/api/barang");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Coba lagi", exact: true })
    .click();
  await page.getByLabel("No. transaksi").fill("Q001");
  await page.getByLabel("Tanggal", { exact: false }).fill("2021-01-01");
  await page.getByRole("button", { name: "Tambah Item", exact: true }).click();
  await page.getByLabel("Barang 1", { exact: true }).selectOption("S001");
  await page.getByLabel("QTY 1", { exact: true }).fill("7");
  let release: () => void = () => {},
    seen: () => void = () => {};
  const gate = new Promise<void>((r) => (release = r)),
    started = new Promise<void>((r) => (seen = r));
  await page.route("**/api/transaksi", async (r) => {
    if (r.request().method() === "POST") {
      seen();
      await gate;
      await r.fulfill({
        status: 503,
        json: { error: "Simpan sementara gagal." },
      });
    } else await r.continue();
  });
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await started;
  await expect(
    page.getByRole("button", { name: "Menyimpan…", exact: true }),
  ).toBeDisabled();
  release();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Simpan sementara gagal.",
  );
  await expect(page.getByLabel("No. transaksi")).toHaveValue("Q001");
  await expect(page.getByLabel("QTY 1", { exact: true })).toHaveValue("7");
  await page.unroute("**/api/transaksi");
  await page
    .getByRole("button", { name: "Simpan Transaksi", exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Q001", exact: true }),
  ).toBeVisible();
  try {
    await page.route("**/api/laporan?*", (r) =>
      r.fulfill({ status: 503, json: { error: "Laporan sementara gagal." } }),
    );
    await page.getByRole("link", { name: "Laporan Stok", exact: true }).click();
    await expect(page.locator('.alert[role="alert"]')).toContainText(
      "Laporan sementara gagal.",
    );
    await page.unroute("**/api/laporan?*");
    await page.getByRole("button", { name: "Coba lagi", exact: true }).click();
    await expect(
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: "S001", exact: true }) })
        .getByRole("cell", { name: "13", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Transaksi Barang", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Koreksi Q001", exact: true })
      .click();
    await page.getByLabel("QTY 1", { exact: true }).fill("8");
    await page
      .getByRole("button", { name: "Simpan Transaksi", exact: true })
      .click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.getByRole("link", { name: "Laporan Stok", exact: true }).click();
    await expect(
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: "S001", exact: true }) })
        .getByRole("cell", { name: "14", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Transaksi Barang", exact: true })
      .click();
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Hapus Q001", exact: true }).click();
    await expect(
      page.getByRole("cell", { name: "Q001", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "Laporan Stok", exact: true }).click();
    await expect(
      page
        .getByRole("row")
        .filter({ has: page.getByRole("cell", { name: "S001", exact: true }) })
        .getByRole("cell", { name: "6", exact: true }),
    ).toBeVisible();
  } finally {
    await request.delete("/api/transaksi/Q001");
  }
});
