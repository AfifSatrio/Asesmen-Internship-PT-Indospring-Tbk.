-- Untuk database yang sudah di-setup; tidak mengubah data transaksi.
-- Indeks gabungan menggantikan indeks tanggal tunggal, bukan menduplikasinya.
BEGIN;
CREATE INDEX IF NOT EXISTS "TRMUTASIHD_TANGGAL_NO_TRANSAKSI_idx"
 ON "TRMUTASIHD" ("TANGGAL" DESC, "NO_TRANSAKSI" ASC);
DROP INDEX IF EXISTS "TRMUTASIHD_TANGGAL_idx";
COMMIT;
