const APP_METADATA = {
  title: "Transaksi Barang | Indospring",
  description:
    "Pencatatan transaksi barang masuk, keluar, dan laporan stok PT Indospring Tbk.",
};
import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = APP_METADATA;
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"id"}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
