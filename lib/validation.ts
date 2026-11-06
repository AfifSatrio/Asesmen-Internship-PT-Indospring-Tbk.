export const LIMITS = {
  codeLength: 5,
  minQuantity: 1,
  maxQuantity: 2147483647,
} as const;
export const TRANSACTION_TYPES = ["MASUK", "KELUAR"] as const;
export const CATEGORIES = ["SUBMAT", "RAWMAT"] as const;
import { z } from "zod";
export const tanggalSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus YYYY-MM-DD.")
  .refine((v) => {
    const d = new Date(v + "T00:00:00.000Z");
    return (
      v >= "0001-01-01" &&
      !Number.isNaN(d.getTime()) &&
      d.toISOString().slice(0, 10) === v
    );
  }, "Tanggal tidak valid.");
export const transaksiSchema = z
  .object({
    nomor: z
      .string()
      .trim()
      .min(1, "Nomor transaksi wajib diisi.")
      .max(LIMITS.codeLength, "Nomor transaksi maksimal 5 karakter.")
      .regex(/^[A-Za-z0-9_-]+$/, "Nomor hanya boleh huruf, angka, _ atau -."),
    tanggal: tanggalSchema,
    jenis: z.enum(TRANSACTION_TYPES, {
      error: "Jenis transaksi harus MASUK atau KELUAR.",
    }),
    kategori: z.enum(CATEGORIES, { error: "Kategori tidak valid." }),
    items: z
      .array(
        z.object({
          kode: z.string().min(1, "Pilih barang.").max(LIMITS.codeLength),
          qty: z
            .number()
            .int("QTY harus bilangan bulat.")
            .min(LIMITS.minQuantity, "QTY minimal 1.")
            .max(LIMITS.maxQuantity, "QTY melebihi batas integer."),
        }),
      )
      .min(1, "Tambahkan minimal satu item."),
  })
  .refine((v) => new Set(v.items.map((i) => i.kode)).size === v.items.length, {
    message: "Barang tidak boleh berulang dalam satu transaksi.",
    path: ["items"],
  });
export type InputTransaksi = z.infer<typeof transaksiSchema>;
export const periodeSchema = z
  .object({ awal: tanggalSchema, akhir: tanggalSchema })
  .refine((v) => v.awal <= v.akhir, {
    message: "Tanggal awal tidak boleh melewati tanggal akhir.",
  });

export const PAGE_SIZE = 20;
export const paginationSchema = z
  .object({
    page: z
      .string()
      .regex(/^[1-9]\d*$/, "Halaman harus bilangan bulat positif.")
      .transform(Number)
      .refine(
        (v) => Number.isSafeInteger(v) && v <= 1000000,
        "Nomor halaman terlalu besar.",
      )
      .default(1),
    pageSize: z.literal("20", { error: "Ukuran halaman harus 20." }).optional(),
    q: z.string().trim().max(50, "Pencarian maksimal 50 karakter.").default(""),
    jenis: z
      .enum(["", ...TRANSACTION_TYPES], {
        error: "Filter jenis transaksi tidak valid.",
      })
      .default(""),
  })
  .strict();
