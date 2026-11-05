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
      .max(5, "Nomor transaksi maksimal 5 karakter.")
      .regex(/^[A-Za-z0-9_-]+$/, "Nomor hanya boleh huruf, angka, _ atau -."),
    tanggal: tanggalSchema,
    jenis: z.enum(["MASUK", "KELUAR"], {
      error: "Jenis transaksi harus MASUK atau KELUAR.",
    }),
    kategori: z.enum(["SUBMAT", "RAWMAT"], { error: "Kategori tidak valid." }),
    items: z
      .array(
        z.object({
          kode: z.string().min(1, "Pilih barang.").max(5),
          qty: z
            .number()
            .int("QTY harus bilangan bulat.")
            .min(1, "QTY minimal 1.")
            .max(2147483647, "QTY melebihi batas integer."),
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
