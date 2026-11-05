import test from "node:test";
import assert from "node:assert/strict";
import {
  transaksiSchema,
  periodeSchema,
  tanggalSchema,
} from "../lib/validation";
const valid = {
  nomor: "T001",
  tanggal: "2021-01-01",
  jenis: "MASUK",
  kategori: "SUBMAT",
  items: [{ kode: "S001", qty: 10 }],
};
test("menerima transaksi valid dan batas integer", () => {
  assert.ok(transaksiSchema.safeParse(valid).success);
  assert.ok(
    transaksiSchema.safeParse({
      ...valid,
      items: [{ kode: "S001", qty: 2147483647 }],
    }).success,
  );
});
test("menolak QTY nol, negatif, pecahan, overflow, string, dan NaN", () => {
  for (const qty of [0, -1, 1.5, 2147483648, "10", NaN])
    assert.equal(
      transaksiSchema.safeParse({ ...valid, items: [{ kode: "S001", qty }] })
        .success,
      false,
    );
});
test("menolak kosong dan duplikasi item", () => {
  for (const items of [
    [],
    [{ kode: "", qty: 1 }],
    [
      { kode: "S001", qty: 1 },
      { kode: "S001", qty: 2 },
    ],
  ])
    assert.equal(transaksiSchema.safeParse({ ...valid, items }).success, false);
});
test("menolak nomor panjang, kosong, jenis dan kategori tidak valid", () => {
  for (const patch of [
    { nomor: "" },
    { nomor: "      " },
    { nomor: "T00001" },
    { jenis: "LAIN" },
    { kategori: "X" },
  ])
    assert.equal(
      transaksiSchema.safeParse({ ...valid, ...patch }).success,
      false,
    );
});
test("validasi kalender dan periode inklusif", () => {
  assert.ok(tanggalSchema.safeParse("2024-02-29").success);
  for (const d of [
    "2021-02-29",
    "2021-02-30",
    "2021-13-01",
    "0000-01-01",
    "2021-1-1",
  ])
    assert.equal(tanggalSchema.safeParse(d).success, false);
  assert.ok(
    periodeSchema.safeParse({ awal: "2021-01-01", akhir: "2021-01-01" })
      .success,
  );
  assert.equal(
    periodeSchema.safeParse({ awal: "2021-02-01", akhir: "2021-01-01" })
      .success,
    false,
  );
});
