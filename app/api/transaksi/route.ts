import { db } from "@/lib/db";
import { json, failure } from "@/lib/http";
import { simpan } from "@/lib/transaksi";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return json(
      await db.transaksi.findMany({
        orderBy: [{ tanggal: "desc" }, { nomor: "asc" }],
        include: {
          items: { include: { barang: true }, orderBy: { kode: "asc" } },
        },
      }),
    );
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
