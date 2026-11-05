"use client";
import { TableProperties, Layers, Trophy } from "lucide-react";
export function ReportIcon({ name }: { name: "table" | "layers" | "trophy" }) {
  return name === "table" ? (
    <TableProperties size={17} />
  ) : name === "layers" ? (
    <Layers size={17} />
  ) : (
    <Trophy size={17} />
  );
}
