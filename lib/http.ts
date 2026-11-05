import { UI } from "@/data";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
export class HttpError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function json(value: unknown, status = 200) {
  return new Response(
    JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    },
  );
}
export function failure(e: unknown) {
  if (e instanceof ZodError)
    return json({ error: e.issues.map((i) => i.message).join(" ") }, 400);
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  if (e instanceof SyntaxError)
    return json({ error: UI.formatJsonTidakValid }, 400);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002")
      return json({ error: UI.nomorTransaksiSudahDigunakan }, 409);
    if (e.code === "P2025")
      return json({ error: UI.transaksiTidakDitemukanAtauSudahDihapus }, 404);
    if (e.code === "P2034")
      return json(
        {
          error: UI.dataSedangDiubahPenggunaLainMuatUlang,
        },
        409,
      );
  }
  console.error(e);
  return json({ error: UI.gagalMengaksesDatabasePeriksaKoneksiDanSetup }, 500);
}
