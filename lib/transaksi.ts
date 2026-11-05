import { UI } from "@/data";
import { Prisma } from "@prisma/client";
import { db } from "./db";
import { HttpError } from "./http";
import { transaksiSchema } from "./validation";
export async function simpan(body: unknown, nomorLama?: string) {
  const input = transaksiSchema.parse(body);
  if (nomorLama !== undefined && nomorLama !== input.nomor)
    throw new HttpError(UI.nomorTransaksiTidakDapatDiubah);
  return db.$transaction(
    async (tx) => {
      const barang = await tx.barang.findMany({
        where: { kode: { in: input.items.map((i) => i.kode) } },
      });
      if (
        barang.length !== input.items.length ||
        barang.some((b) => b.kategori !== input.kategori)
      )
        throw new HttpError(UI.barangTidakTerdaftarAtauTidakSesuaiKategori);
      const data = {
        tanggal: new Date(input.tanggal + "T00:00:00Z"),
        jenis: input.jenis,
        kategori: input.kategori,
      };
      if (nomorLama !== undefined) {
        // Header lock obtained before replacing detail; serializable guards concurrent corrections.
        await tx.transaksi.update({ where: { nomor: nomorLama }, data });
        await tx.detail.deleteMany({ where: { nomor: nomorLama } });
        await tx.detail.createMany({
          data: input.items.map((i) => ({ ...i, nomor: nomorLama })),
        });
      } else {
        await tx.transaksi.create({
          data: { nomor: input.nomor, ...data, items: { create: input.items } },
        });
      }
      return tx.transaksi.findUniqueOrThrow({
        where: { nomor: input.nomor },
        include: {
          items: { include: { barang: true }, orderBy: { kode: "asc" } },
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
