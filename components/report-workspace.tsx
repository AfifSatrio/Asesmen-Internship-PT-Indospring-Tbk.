"use client";
import { UI } from "@/data";

import { TableProperties, Info } from "lucide-react";
import { useReports } from "@/hooks/use-reports";
import { ReportPeriodFilter } from "@/components/report-period-filter";
import { ReportTabs } from "@/components/report-tabs";
import { ReportTable } from "@/components/report-table";
export function ReportWorkspace() {
  const controller = useReports();
  const { tab, setTab, error } = controller;
  return (
    <>
      {" "}
      <div className="breadcrumb">
        {UI.ruangKerja}
        <span>{UI.breadcrumbSeparator}</span>
        {UI.laporanStok}
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{UI.ringkasanPersediaan}</div>
          <h1>{UI.laporanStokTitle}</h1>
          <p>{UI.pantauMutasiDanSaldoBarangDalamPeriode}</p>
        </div>
        <span className="heading-icon">
          <TableProperties size={25} />
        </span>
      </div>
      <ReportPeriodFilter {...controller} />{" "}
      {error && (
        <div role="alert" className="alert error">
          {error}
        </div>
      )}
      <div className="info-note">
        <Info size={19} />
        <p>
          <strong>{UI.perhitunganDalamPeriode}</strong>
          {UI.stokAkhirTransaksiMasukTransaksiKeluarSaldo}
        </p>
      </div>
      <ReportTabs tab={tab} setTab={setTab} />
      <ReportTable {...controller} />
    </>
  );
}
