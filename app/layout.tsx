import { APP_METADATA, LOCALIZATION } from "@/data";
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
    <html lang={LOCALIZATION.language}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
