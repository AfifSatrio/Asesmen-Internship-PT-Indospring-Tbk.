"use client";
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
        {"Ruang kerja"}
        <span>{"/"}</span>
        {"Laporan stok"}
      </div>
      <div className="page-heading">
        <div>
          <div className="eyebrow">{"RINGKASAN PERSEDIAAN"}</div>
          <h1>{"Laporan Stok"}</h1>
          <p>{"Pantau mutasi dan saldo barang dalam periode pilihan."}</p>
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
          <strong>{"Perhitungan dalam periode"}</strong>
          {
            "Stok akhir = transaksi masuk − transaksi keluar. Saldo sebelum periode tidak disertakan."
          }
        </p>
      </div>
      <ReportTabs tab={tab} setTab={setTab} />
      <ReportTable {...controller} />
    </>
  );
}
