import { db } from "@/lib/db";
import { json, failure } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return json(await db.barang.findMany({ orderBy: { kode: "desc" } }));
  } catch (e) {
    return failure(e);
  }
}
