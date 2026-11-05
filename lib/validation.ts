import { LIMITS, TRANSACTION_TYPES, CATEGORIES } from "@/data";

import { UI } from "@/data";
import { z } from "zod";
export const tanggalSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, UI.tanggalHarusYyyyMmDd)
  .refine((v) => {
    const d = new Date(v + "T00:00:00.000Z");
    return (
      v >= "0001-01-01" &&
      !Number.isNaN(d.getTime()) &&
      d.toISOString().slice(0, 10) === v
    );
  }, UI.tanggalTidakValid);
export const transaksiSchema = z
  .object({
    nomor: z
      .string()
      .trim()
      .min(1, UI.nomorTransaksiWajibDiisi)
      .max(LIMITS.codeLength, UI.nomorTransaksiMaksimal5Karakter)
      .regex(/^[A-Za-z0-9_-]+$/, UI.nomorHanyaBolehHurufAngkaAtau),
    tanggal: tanggalSchema,
    jenis: z.enum(TRANSACTION_TYPES, {
      error: UI.jenisTransaksiHarusMasukAtauKeluar,
    }),
    kategori: z.enum(CATEGORIES, { error: UI.kategoriTidakValid }),
    items: z
      .array(
        z.object({
          kode: z
            .string()
            .min(1, UI.pilihBarangValidation)
            .max(LIMITS.codeLength),
          qty: z
            .number()
            .int(UI.qtyHarusBilanganBulat)
            .min(LIMITS.minQuantity, UI.qtyMinimal1)
            .max(LIMITS.maxQuantity, UI.qtyMelebihiBatasInteger),
        }),
      )
      .min(1, UI.tambahkanMinimalSatuItem),
  })
  .refine((v) => new Set(v.items.map((i) => i.kode)).size === v.items.length, {
    message: UI.barangTidakBolehBerulangDalamSatuTransaksi,
    path: ["items"],
  });
export type InputTransaksi = z.infer<typeof transaksiSchema>;
export const periodeSchema = z
  .object({ awal: tanggalSchema, akhir: tanggalSchema })
  .refine((v) => v.awal <= v.akhir, {
    message: UI.tanggalAwalTidakBolehMelewatiTanggalAkhir,
  });
