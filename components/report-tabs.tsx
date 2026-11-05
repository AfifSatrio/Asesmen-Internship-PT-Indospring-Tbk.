"use client";
import { REPORT_TABS } from "@/data";
import { ReportIcon } from "@/components/report-icon";
import type { ReportsController } from "@/hooks/use-reports";
export function ReportTabs({
  tab,
  setTab,
}: Pick<ReportsController, "tab" | "setTab">) {
  return (
    <div className="report-tabs" role="tablist" aria-label={"Jenis laporan"}>
      {REPORT_TABS.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={tab === t.key}
          onClick={() => setTab(t.key)}
          className={tab === t.key ? "selected" : ""}
        >
          <ReportIcon name={t.icon} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
