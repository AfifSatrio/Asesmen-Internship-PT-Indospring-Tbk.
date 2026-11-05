# Hasil verifikasi

Diuji pada 6 November 2026, menggunakan PostgreSQL 18.6 lokal, Node.js 26, Next.js 16.4.5, Prisma 6.19, dan Google Chrome headless melalui Playwright.

| Pemeriksaan | Hasil |
| --- | --- |
| Build produksi Next.js (Webpack) | Lulus |
| TypeScript `tsc --noEmit` | Lulus |
| Unit test validasi (5 pengujian) | Lulus |
| End-to-end browser dan API | Lulus |
| T001–T005 dimasukkan melalui form | Lulus |
| Tambah, detail, koreksi QTY, hapus dengan konfirmasi | Lulus |
| Nomor tetap ketika koreksi dan nomor ganda ditolak | Lulus |
| Barang salah kategori/tidak terdaftar, duplikat, detail kosong | Ditolak |
| QTY nol, negatif, pecahan, overflow; tanggal tidak valid | Ditolak |
| Koreksi invalid tidak mengubah detail sebelumnya | Lulus |
| Periode kosong menampilkan lima barang dengan nol | Lulus |
| Batas tanggal inklusif dan periode terbalik ditolak | Lulus |
| Nilai tertinggi seri menampilkan seluruh pemenang | Lulus |
| Tampilan mobile 390px tanpa overflow halaman | Lulus |
| SQL mandiri 3.1–3.3 dijalankan di PostgreSQL | Sesuai contoh |

Hasil stok per barang: S001=6, S002=9, S003=6, R001=5, R002=5.

Hasil kelompok: SUBMAT/BOX=6, SUBMAT/PCS=15, RAWMAT/KG=10.

Pengeluaran tertinggi: S001=4, S003=2, R001=5.

Screenshot berada di `docs/screenshots/`. Pengujian memakai database sementara terpisah; file database dan kredensial tidak disertakan repository. Belum dilakukan uji beban atau uji multi-pengguna skala besar. Tidak ada deployment.
