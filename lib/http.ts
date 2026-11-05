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
    return json({ error: "Format JSON tidak valid." }, 400);
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002")
      return json({ error: "Nomor transaksi sudah digunakan." }, 409);
    if (e.code === "P2025")
      return json(
        { error: "Transaksi tidak ditemukan atau sudah dihapus." },
        404,
      );
    if (e.code === "P2034")
      return json(
        {
          error: "Data sedang diubah pengguna lain. Muat ulang dan coba lagi.",
        },
        409,
      );
  }
  console.error(e);
  return json(
    { error: "Gagal mengakses database. Periksa koneksi dan setup database." },
    500,
  );
}
