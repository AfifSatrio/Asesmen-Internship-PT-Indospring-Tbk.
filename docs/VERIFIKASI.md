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

## Optimasi pagination dan request

- TypeScript dan production build: lulus.
- Unit test: 6 lulus, termasuk validasi pagination dan periode.
- Empat skenario browser/API lulus: CRUD + laporan contoh; pagination/urutan/detail sesuai kebutuhan; debounce/respons terlambat; serta retry daftar/detail/master/laporan, input tetap ada saat simpan gagal, tombol simpan nonaktif, dan pembaruan laporan setelah tambah/koreksi/hapus.
- Pengujian browser dijalankan pada database PostgreSQL terpisah. T001–T005 dimasukkan melalui form; 25 fixture tambahan menguji halaman berukuran 20 dan tanggal yang sama. Tampilan mobile 390px tidak menyebabkan overflow halaman; pagination tetap dapat dipakai.
- SQL mandiri 3.1–3.3 diuji ulang dan tetap sesuai contoh. Query laporan menyaring header periode sebelum agregasi detail. Indeks tanggal/nomor menggantikan indeks tanggal tunggal; daftar indeks berisi tiga primary key dan satu indeks gabungan, tanpa duplikasi primary key.
- EXPLAIN pada dataset contoh yang kecil memilih sequential scan untuk header, dan menggunakan primary key detail untuk join. Tidak dipaksakan penggunaan indeks atau diklaim hasil benchmark beban besar.
- Tidak ada script/konfigurasi lint pada proyek, sehingga lint tidak dijalankan. Tidak ditambahkan library performa atau lint.

## Pembaruan screenshot UI

Pada 6 November 2026, enam screenshot di `docs/screenshots/` diperbarui dari build produksi lokal menggunakan Chrome headless: daftar transaksi, form tambah, tiga tab laporan, dan tampilan mobile. Build produksi beserta pemeriksaan TypeScript lulus.

Pengambilan gambar memverifikasi tidak ada topbar, posisi Administrator di bawah panel Pencatatan terpusat pada desktop, serta tidak ada overflow halaman pada lebar mobile 390px. Desktop memakai viewport 1440 × 1000 dan mobile 390 × 844, dengan screenshot seluruh halaman. Browser tidak melaporkan error JavaScript. Form T006 diisi untuk dokumentasi lalu dibatalkan; data transaksi tidak diubah. Ini merupakan pemeriksaan tampilan, bukan pengulangan seluruh suite CRUD/API.
