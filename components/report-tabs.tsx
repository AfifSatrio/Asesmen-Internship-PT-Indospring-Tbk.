"use client";
import { REPORT_TABS } from "@/data";
import type { ReportsController } from "@/hooks/use-reports";
export function ReportTabs({
  tab,
  setTab,
}: Pick<ReportsController, "tab" | "setTab">) {
  return (
    <div className="report-tabs" role="tablist" aria-label="Jenis laporan">
      {REPORT_TABS.map((t, index) => (
        <button
          key={t.key}
          id={`tab-${t.key}`}
          role="tab"
          aria-controls="report-panel"
          aria-selected={tab === t.key}
          tabIndex={tab === t.key ? 0 : -1}
          onClick={() => setTab(t.key)}
          onKeyDown={(e) => {
            let next = index;
            if (e.key === "ArrowRight") next = (index + 1) % REPORT_TABS.length;
            else if (e.key === "ArrowLeft")
              next = (index + REPORT_TABS.length - 1) % REPORT_TABS.length;
            else if (e.key === "Home") next = 0;
            else if (e.key === "End") next = REPORT_TABS.length - 1;
            else return;
            e.preventDefault();
            setTab(REPORT_TABS[next].key);
            document.getElementById(`tab-${REPORT_TABS[next].key}`)?.focus();
          }}
          className={tab === t.key ? "selected" : ""}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
