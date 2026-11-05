import { periodeSchema } from "@/lib/validation";
import { reports } from "@/lib/reports";
import { json, failure } from "@/lib/http";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const q = new URL(req.url).searchParams;
    const { awal, akhir } = periodeSchema.parse({
      awal: q.get("awal"),
      akhir: q.get("akhir"),
    });
    return json(await reports(awal, akhir));
  } catch (e) {
    return failure(e);
  }
}
