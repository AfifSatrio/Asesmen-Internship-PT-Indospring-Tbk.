import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { json, failure, HttpError } from "@/lib/http";
import { simpan } from "@/lib/transaksi";
import { PAGE_SIZE, paginationSchema } from "@/lib/validation";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    if (new Set(params.keys()).size !== [...params.keys()].length)
      throw new HttpError("Parameter tidak boleh berulang.");
    const {
      page: requestedPage,
      q,
      jenis,
    } = paginationSchema.parse(Object.fromEntries(params));
    const where: Prisma.TransaksiWhereInput = {
      ...(jenis ? { jenis } : {}),
      ...(q
        ? {
            OR: [
              { nomor: { contains: q, mode: "insensitive" } },
              { kategori: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const result = await db.$transaction(
      async (tx) => {
        const total = await tx.transaksi.count({ where });
        const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const page = Math.min(requestedPage, totalPages);
        const items = await tx.transaksi.findMany({
          where,
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          orderBy: [{ tanggal: "desc" }, { nomor: "asc" }],
          select: {
            nomor: true,
            tanggal: true,
            jenis: true,
            kategori: true,
            _count: { select: { items: true } },
          },
        });
        // Summary is an aggregate of all headers, never an unbounded list of rows.
        const groups = await tx.transaksi.groupBy({
          by: ["jenis"],
          _count: { _all: true },
        });
        const masuk = groups.find((g) => g.jenis === "MASUK")?._count._all ?? 0;
        const keluar =
          groups.find((g) => g.jenis === "KELUAR")?._count._all ?? 0;
        return {
          items: items.map(({ _count, ...item }) => ({
            ...item,
            itemCount: _count.items,
          })),
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages,
          summary: { total: masuk + keluar, masuk, keluar },
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    return json(result);
  } catch (e) {
    return failure(e);
  }
}
export async function POST(req: Request) {
  try {
    return json(await simpan(await req.json()), 201);
  } catch (e) {
    return failure(e);
  }
}
