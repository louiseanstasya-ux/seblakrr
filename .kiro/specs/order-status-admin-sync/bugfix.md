# Bugfix Requirements Document

## Introduction

Terdapat dua kelompok bug yang saling terkait pada aplikasi QR Menu Seblak RR:

1. **Halaman Status Pesanan Pelanggan tidak tersinkron dengan Admin** — Setelah pelanggan melakukan checkout, modal "Status Pesanan - Pantau pesanan Anda secara real-time" di `MenuMarketplace.tsx` melakukan polling ke `/api/seblak/orders?id=` dan menerima status dari MongoDB (`MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`), namun `trackingState` yang mengontrol tampilan progress steps hanya berubah jika status cocok dengan mapping lama (`MASUK: 0`, `DITERIMA: 0`, `DIMASAK: 1`, `SIAP: 2`, `SELESAI: 3`). Sebagian mapping sudah benar, tetapi status `MASUK` dan `DITERIMA` keduanya di-map ke index `0`, sehingga ketika admin memperbarui pesanan ke `DITERIMA`, tampilan pelanggan tidak bergerak maju. Selain itu, poin loyalty baru ditambahkan jika status `SELESAI`, namun kondisi pengecekan menggunakan `trackingState === 3` yang tidak pernah tercapai karena state tidak pernah maju dengan benar.

2. **Dashboard Admin membaca dari `localStorage` bukan dari MongoDB** — Halaman dashboard admin (`src/app/admin/page.tsx`) mengambil data pesanan dan menu dari `localStorage` (`seblakrr_orders`, `seblakrr_menu`), bukan dari API MongoDB. Karena pesanan pelanggan disimpan ke MongoDB via `/api/seblak/orders` (POST), dashboard tidak pernah menampilkan pesanan nyata. Statistik (pesanan hari ini, pendapatan, pesanan selesai) selalu nol. `statusLabel` dashboard juga menggunakan enum lama (`RECEIVED`, `COOKING`, `READY`, `COMPLETED`) yang tidak cocok dengan enum MongoDB (`MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`), sehingga badge status selalu kosong/fallback.

---

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN pelanggan melakukan checkout dan pesanan berhasil disimpan ke MongoDB, THEN halaman status pesanan (modal tracking) menampilkan progress step yang tidak bergerak maju meskipun admin sudah mengubah status pesanan ke `DITERIMA`

1.2 WHEN admin mengubah status pesanan dari `MASUK` ke `DITERIMA` di halaman `/admin/orders`, THEN tampilan tracking pelanggan tetap menampilkan step pertama (index 0) karena `statusMap` memetakan keduanya ke nilai `0`

1.3 WHEN pelanggan berada di halaman status pesanan dan pesanan admin sudah berstatus `SELESAI`, THEN poin loyalty tidak pernah diberikan kepada pelanggan karena kondisi `trackingState === 3` tidak pernah tercapai akibat mapping status yang salah

1.4 WHEN admin membuka halaman dashboard (`/admin`), THEN semua statistik (pesanan hari ini, pendapatan, menu aktif, pesanan selesai) menampilkan nilai nol atau kosong karena data dibaca dari `localStorage` yang tidak pernah diisi oleh alur pemesanan pelanggan

1.5 WHEN admin membuka halaman dashboard dan ada pesanan di MongoDB, THEN daftar "Pesanan Terbaru" selalu kosong karena `loadData()` membaca dari `localStorage` bukan dari API `/api/seblak/orders`

1.6 WHEN halaman dashboard admin menampilkan badge status pesanan pada daftar "Pesanan Terbaru", THEN semua badge tampil dengan style fallback (tanpa warna dan label yang benar) karena `statusLabel` menggunakan key `RECEIVED`, `COOKING`, `READY`, `COMPLETED` sementara data MongoDB menggunakan `MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`

1.7 WHEN admin membuka halaman dashboard dan menekan tombol "Refresh", THEN data tidak diperbarui dari server karena `loadData()` hanya membaca `localStorage`

### Expected Behavior (Correct)

2.1 WHEN pelanggan berada di modal tracking dan admin mengubah status pesanan ke `DITERIMA`, THEN tampilan progress step pelanggan SHALL bergerak maju ke step kedua (index 1) secara real-time

2.2 WHEN `statusMap` di `MenuMarketplace.tsx` digunakan untuk memetakan status MongoDB ke `trackingState`, THEN setiap status unik (`MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`) SHALL dipetakan ke index yang berbeda dan berurutan (0, 1, 2, 3, 4 atau minimal memastikan DITERIMA > MASUK)

2.3 WHEN status pesanan berhasil mencapai `SELESAI` dan dipantau oleh polling di `MenuMarketplace.tsx`, THEN sistem SHALL memberikan poin loyalty kepada pelanggan sesuai dengan nilai `poinDari` yang sudah dihitung

2.4 WHEN admin membuka halaman dashboard, THEN data pesanan SHALL diambil dari API `/api/seblak/orders` (MongoDB) bukan dari `localStorage`

2.5 WHEN halaman dashboard admin berhasil mengambil data dari API, THEN statistik pesanan hari ini, pendapatan, pesanan selesai, dan menu aktif SHALL menampilkan nilai yang akurat dan real-time

2.6 WHEN halaman dashboard admin menampilkan badge status pada daftar "Pesanan Terbaru", THEN `statusLabel` SHALL menggunakan key yang sesuai dengan enum MongoDB yaitu `MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`, `DITOLAK`

2.7 WHEN admin menekan tombol "Refresh" di dashboard, THEN sistem SHALL melakukan fetch ulang dari API `/api/seblak/orders` dan memperbarui semua statistik serta daftar pesanan

2.8 WHEN halaman dashboard admin dimuat, THEN jumlah menu aktif SHALL diambil dari API `/api/seblak/menu` bukan dari `localStorage`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN pelanggan menambahkan item ke keranjang dan melakukan checkout, THEN sistem SHALL CONTINUE TO menyimpan pesanan baru ke MongoDB via POST `/api/seblak/orders` tanpa perubahan

3.2 WHEN admin membuka halaman `/admin/orders`, THEN sistem SHALL CONTINUE TO menampilkan semua pesanan dari MongoDB dan memungkinkan update status via PUT `/api/seblak/orders`

3.3 WHEN admin mengubah status pesanan di halaman `/admin/orders`, THEN sistem SHALL CONTINUE TO menyimpan perubahan status ke MongoDB dan merender ulang daftar pesanan

3.4 WHEN pelanggan berada di modal tracking dengan pesanan yang berhasil dibuat, THEN sistem SHALL CONTINUE TO melakukan polling setiap 5 detik ke API untuk mengambil status terbaru

3.5 WHEN modal checkout ditampilkan, THEN sistem SHALL CONTINUE TO menampilkan ringkasan item, kalkulasi subtotal, pajak, diskon, dan grand total dengan benar

3.6 WHEN pelanggan menggunakan fitur tukar poin (100 poin = Rp 10.000), THEN sistem SHALL CONTINUE TO mengurangi poin di Redux state dan menerapkan diskon pada grand total

3.7 WHEN admin membuka halaman menu (`/admin/menu`), THEN fungsionalitas manajemen menu SHALL CONTINUE TO bekerja sesuai implementasinya saat ini

3.8 WHEN aplikasi tidak dapat terhubung ke MongoDB (koneksi gagal), THEN halaman pelanggan SHALL CONTINUE TO menggunakan fallback ke `MOCK_MENU` untuk daftar menu

---

## Bug Condition Pseudocode

### Bug Condition 1 — Tracking State Tidak Maju (Customer Side)

```pascal
FUNCTION isBugCondition_TrackingMapping(order)
  INPUT: order of type SeblakOrder (fetched from MongoDB)
  OUTPUT: boolean
  
  // Bug terjadi ketika status 'DITERIMA' dipetakan ke nilai yang sama dengan 'MASUK'
  RETURN statusMap[order.status] IS NOT UNIQUE
         OR statusMap["DITERIMA"] = statusMap["MASUK"]
END FUNCTION

// Property: Fix Checking — Setiap status harus punya trackingState unik dan berurutan
FOR ALL order WHERE isBugCondition_TrackingMapping(order) DO
  result ← resolveTrackingState'(order.status)
  ASSERT result["MASUK"]    = 0
  AND    result["DITERIMA"] = 1
  AND    result["DIMASAK"]  = 2
  AND    result["SIAP"]     = 3
  AND    result["SELESAI"]  = 4
END FOR

// Property: Preservation Checking
FOR ALL order WHERE NOT isBugCondition_TrackingMapping(order) DO
  ASSERT F(order) = F'(order)  // Polling dan UI lain tidak berubah
END FOR
```

### Bug Condition 2 — Dashboard Membaca dari localStorage

```pascal
FUNCTION isBugCondition_DashboardDataSource()
  INPUT: (none — kondisi statis pada kode)
  OUTPUT: boolean
  
  // Bug terjadi ketika loadData() memanggil localStorage bukan fetch API
  RETURN loadData.implementation USES localStorage
         AND NOT loadData.implementation USES fetch("/api/seblak/orders")
END FUNCTION

// Property: Fix Checking — Dashboard harus membaca dari MongoDB API
FOR ALL dashboard loads WHERE isBugCondition_DashboardDataSource() DO
  result ← loadData'()
  ASSERT result.source = "API /api/seblak/orders"
  AND    result.orders  = MongoDB.SeblakOrder.find()
END FOR

// Property: Preservation Checking
FOR ALL non-buggy dashboard interactions DO
  // UI layout, navigasi, tombol refresh tetap bekerja
  ASSERT F(interaction) = F'(interaction)
END FOR
```
