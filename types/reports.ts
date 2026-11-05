export type ReportRow = Record<string, string>;
export type Reports = {
  barang: ReportRow[];
  kelompok: ReportRow[];
  tertinggi: ReportRow[];
};
export type ReportPeriod = { awal: string; akhir: string };
