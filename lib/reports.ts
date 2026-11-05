import { Prisma } from "@prisma/client";
import { db } from "./db";
export async function reports(awal: string, akhir: string) {
  const cte = Prisma.sql`WITH stok AS (
 SELECT b."KODE_BARANG", b."NAMA_BARANG", b."SATUAN", b."KATEGORI",
 COALESCE(SUM(d."QTY") FILTER (WHERE h."JENIS_TRANSAKSI" = 'MASUK'), 0)::bigint AS "TRANS_MASUK",
 COALESCE(SUM(d."QTY") FILTER (WHERE h."JENIS_TRANSAKSI" = 'KELUAR'), 0)::bigint AS "TRANS_KELUAR"
 FROM "MSBARANG" b
 LEFT JOIN "TRMUTASIDT" d ON d."KODE_BARANG" = b."KODE_BARANG"
 LEFT JOIN "TRMUTASIHD" h ON h."NO_TRANSAKSI" = d."NO_TRANSAKSI" AND h."TANGGAL" BETWEEN ${awal}::date AND ${akhir}::date
 GROUP BY b."KODE_BARANG", b."NAMA_BARANG", b."SATUAN", b."KATEGORI"
 )`;
  const [barang, kelompok, tertinggi] = await db.$transaction(
    [
      db.$queryRaw(
        Prisma.sql`${cte} SELECT *, "TRANS_MASUK" - "TRANS_KELUAR" AS "STOK_AKHIR" FROM stok ORDER BY "KATEGORI" DESC,"KODE_BARANG"`,
      ),
      db.$queryRaw(
        Prisma.sql`${cte} SELECT "KATEGORI", "SATUAN", SUM("TRANS_MASUK")::bigint AS "TRANS_MASUK", SUM("TRANS_KELUAR")::bigint AS "TRANS_KELUAR", SUM("TRANS_MASUK"-"TRANS_KELUAR")::bigint AS "STOK_AKHIR" FROM stok GROUP BY "KATEGORI","SATUAN" ORDER BY "KATEGORI" DESC,"SATUAN"`,
      ),
      db.$queryRaw(
        Prisma.sql`${cte}, peringkat AS (SELECT *, DENSE_RANK() OVER (PARTITION BY "KATEGORI","SATUAN" ORDER BY "TRANS_KELUAR" DESC) AS r FROM stok WHERE "TRANS_KELUAR" > 0) SELECT "KATEGORI","SATUAN","KODE_BARANG","NAMA_BARANG","TRANS_KELUAR" FROM peringkat WHERE r = 1 ORDER BY "KATEGORI" DESC,"SATUAN","KODE_BARANG"`,
      ),
    ],
    { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
  );
  return { barang, kelompok, tertinggi };
}
