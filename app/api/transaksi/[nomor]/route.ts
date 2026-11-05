
import {UI} from "@/data";
import { db } from "@/lib/db";
import { json, failure, HttpError } from "@/lib/http";
import { simpan } from "@/lib/transaksi";
type Context = { params: Promise<{ nomor: string }> };
export async function GET(_: Request, ctx: Context) {
  try {
    const { nomor } = await ctx.params;
    const data = await db.transaksi.findUnique({
      where: { nomor },
      include: {
        items: { include: { barang: true }, orderBy: { kode: "asc" } },
      },
    });
    if (!data) throw new HttpError(UI.transaksiTidakDitemukanError, 404);
    return json(data);
  } catch (e) {
    return failure(e);
  }
}
export async function PUT(req: Request, ctx: Context) {
  try {
    return json(await simpan(await req.json(), (await ctx.params).nomor));
  } catch (e) {
    return failure(e);
  }
}
export async function DELETE(_: Request, ctx: Context) {
  try {
    const { nomor } = await ctx.params;
    await db.$transaction(async (tx) => {
      await tx.transaksi.delete({ where: { nomor } });
    });
    return json({ message: UI.transaksiDanSeluruhItemBerhasilDihapus });
  } catch (e) {
    return failure(e);
  }
}
