"use client";

import { REPORT_TABS } from "@/data";
import { ReportIcon } from "@/components/report-icon";
import type { ReportsController } from "@/hooks/use-reports";

export function ReportTabs({
  tab,
  setTab,
}: Pick<ReportsController, "tab" | "setTab">) {
  return (
    <div
      className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto"
      role="tablist"
      aria-label="Jenis laporan"
    >
      {REPORT_TABS.map((t) => {
        const isSelected = tab === t.key;
        return (
          <button
            key={t.key}
            role="tab"
            aria-selected={isSelected}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isSelected
                ? "text-blue-600 border-blue-600 font-semibold"
                : "text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300 font-medium"
            }`}
          >
            <ReportIcon name={t.icon} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
