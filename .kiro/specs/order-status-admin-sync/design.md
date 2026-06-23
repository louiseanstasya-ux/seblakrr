# Order Status Admin Sync Bugfix Design

## Overview

Dokumen ini mendefinisikan pendekatan perbaikan untuk dua kelompok bug yang saling terkait pada aplikasi QR Menu Seblak RR:

**Bug 1 — Tracking State Tidak Maju (Customer Side):**
Di `src/components/SeblakRR/MenuMarketplace.tsx`, objek `statusMap` memetakan status `MASUK` dan `DITERIMA` ke nilai yang sama (`0`), sehingga saat admin memperbarui status ke `DITERIMA`, `trackingState` tidak berubah dan progress steps pelanggan tidak bergerak maju. Sebagai dampak lanjutan, kondisi pemberian poin loyalty (`trackingState === 3`) tidak pernah tercapai karena indeks maksimal yang dapat dicapai dengan mapping lama adalah `3` untuk `SELESAI`, namun state aktual tidak pernah mencapai nilai tersebut melalui jalur yang benar.

**Bug 2 — Dashboard Admin Membaca dari localStorage:**
Di `src/app/admin/page.tsx`, fungsi `loadData()` membaca pesanan dari `localStorage` (`seblakrr_orders`) dan menu dari `localStorage` (`seblakrr_menu`), padahal seluruh alur pemesanan pelanggan menyimpan data ke MongoDB melalui `POST /api/seblak/orders`. Akibatnya semua statistik selalu nol dan daftar pesanan selalu kosong. `statusLabel` pada dashboard juga menggunakan enum lama (`RECEIVED`, `COOKING`, `READY`, `COMPLETED`) yang tidak cocok dengan enum MongoDB, menyebabkan semua badge status tampil dengan style fallback.

Strategi perbaikan: minimal dan targeted — hanya mengubah `statusMap` di `MenuMarketplace.tsx` dan memigrasikan `loadData()` di `admin/page.tsx` ke fetch API, tanpa mengubah struktur UI, alur checkout, atau endpoint API yang sudah ada.

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu bug — (C1) `statusMap["DITERIMA"] === statusMap["MASUK"]` di `MenuMarketplace.tsx`, atau (C2) `loadData()` membaca dari `localStorage` alih-alih `fetch("/api/seblak/orders")`
- **Property (P)**: Perilaku yang diharapkan setelah fix — (P1) setiap status MongoDB dipetakan ke `trackingState` unik dan berurutan; (P2) dashboard mengambil data real-time dari MongoDB API
- **Preservation**: Perilaku yang tidak boleh berubah akibat fix — alur checkout, polling, kalkulasi total, manajemen poin, halaman `/admin/orders`, dan semua endpoint API
- **statusMap**: Objek di `MenuMarketplace.tsx` yang memetakan status string MongoDB ke index integer `trackingState`
- **trackingState**: State integer (0–4) yang mengontrol tampilan progress steps pada modal tracking pelanggan
- **loadData()**: Fungsi di `admin/page.tsx` yang mengambil data pesanan dan menu untuk ditampilkan di dashboard
- **SeblakOrder**: Model Mongoose di `src/model/seblakOrder.ts` yang menyimpan pesanan Seblak RR ke MongoDB
- **statusLabel**: Objek di `admin/page.tsx` yang memetakan key status ke label, warna, dan ikon badge
- **`/api/seblak/orders`**: Endpoint Next.js yang menangani GET (ambil semua/by id), POST (buat pesanan), dan PUT (update status)
- **`/api/seblak/menu`**: Endpoint Next.js yang menangani GET (ambil daftar menu dari MongoDB)
- **poinDari**: Nilai poin yang akan diberikan ke pelanggan (`Math.floor(subtotal / 1000)`) saat pesanan `SELESAI`

## Bug Details

### Bug Condition 1 — Tracking State Tidak Maju

Bug muncul saat polling interval di `MenuMarketplace.tsx` menerima respons dari MongoDB dengan status `DITERIMA`. Fungsi `resolveTrackingState` (efektif, via `statusMap`) mengembalikan nilai `0` — sama persis dengan nilai untuk `MASUK` — sehingga `setTrackingState(newState)` tidak mengubah tampilan UI.

**Formal Specification:**
```
FUNCTION isBugCondition_TrackingMapping(statusMap)
  INPUT: statusMap of type Record<string, number>
  OUTPUT: boolean

  RETURN statusMap["DITERIMA"] = statusMap["MASUK"]
         OR statusMap["MASUK"]    IS NOT 0
         OR statusMap["DITERIMA"] IS NOT STRICTLY GREATER THAN statusMap["MASUK"]
         OR statusMap["DIMASAK"]  IS NOT STRICTLY GREATER THAN statusMap["DITERIMA"]
         OR statusMap["SIAP"]     IS NOT STRICTLY GREATER THAN statusMap["DIMASAK"]
         OR statusMap["SELESAI"]  IS NOT STRICTLY GREATER THAN statusMap["SIAP"]
END FUNCTION
```

**Kode bermasalah saat ini (MenuMarketplace.tsx, ~baris 114):**
```typescript
const statusMap: Record<string, number> = {
  MASUK: 0, DITERIMA: 0, DIMASAK: 1, SIAP: 2, SELESAI: 3, DITOLAK: 3
};
```

### Bug Condition 2 — Dashboard Membaca dari localStorage

Bug muncul saat komponen `AdminDashboard` di-mount. `loadData()` membaca `localStorage.getItem('seblakrr_orders')` yang selalu `null` karena alur pemesanan tidak pernah menulis ke key tersebut.

**Formal Specification:**
```
FUNCTION isBugCondition_DashboardDataSource(loadDataImpl)
  INPUT: loadDataImpl — implementasi fungsi loadData()
  OUTPUT: boolean

  RETURN loadDataImpl READS FROM localStorage("seblakrr_orders")
         AND NOT loadDataImpl CALLS fetch("/api/seblak/orders")
END FUNCTION
```

**Kode bermasalah saat ini (admin/page.tsx, ~baris 37–47):**
```typescript
const loadData = () => {
  const savedOrders = localStorage.getItem('seblakrr_orders');
  if (savedOrders) setOrders(JSON.parse(savedOrders));
  const savedMenu = localStorage.getItem('seblakrr_menu');
  if (savedMenu) setMenus(JSON.parse(savedMenu));
  else setMenus(Array(13).fill(null).map(...)); // hardcode 13 item
  setLastRefresh(new Date());
};
```

### Contoh Konkret

**Bug 1:**
- Admin mengubah status pesanan `#101` dari `MASUK` → `DITERIMA` di `/admin/orders`
- Polling pelanggan menerima `{ status: "DITERIMA" }` dari MongoDB
- `statusMap["DITERIMA"]` = `0` → `setTrackingState(0)` — tidak ada perubahan visual
- **Expected:** `trackingState` seharusnya menjadi `1` (step kedua maju)

- Pesanan `#102` selesai (`SELESAI`), polling menerima status tersebut
- `statusMap["SELESAI"]` = `3` → `setTrackingState(3)`, kondisi `trackingState === 3` terpenuhi
- Namun karena step `DITERIMA` dilewati (tidak pernah 1), layar pelanggan loncat dari 0 ke 3 tanpa melalui 1 dan 2
- Poin diberikan hanya jika `order.status === 'SELESAI'` (bukan berdasar `trackingState`), tapi kondisi ini sudah benar di kode saat ini — **klarifikasi**: poin sebenarnya diberikan via `if (order.status === 'SELESAI')`, bukan `trackingState === 3`. `trackingState === 3` hanya untuk banner UI. Namun dengan mapping baru (`SELESAI: 4`), banner juga harus diperbarui ke `trackingState === 4`.

**Bug 2:**
- Admin membuka `/admin` — `loadData()` dipanggil, `localStorage.getItem('seblakrr_orders')` = `null`
- `setOrders([])` — semua statistik dan daftar pesanan kosong meski ada 50 pesanan di MongoDB
- Badge status: `statusLabel["MASUK"]` = `undefined` → fallback ke `statusLabel['RECEIVED']` yang terdefinisi, tapi tidak sesuai warna dan label yang benar untuk MongoDB enum

## Expected Behavior

### Preservation Requirements

**Perilaku yang tidak boleh berubah:**
- Alur checkout pelanggan (POST `/api/seblak/orders`) harus tetap berfungsi tanpa perubahan
- Polling setiap 5 detik di `MenuMarketplace.tsx` harus tetap berjalan dan memanggil `GET /api/seblak/orders?id=`
- Halaman `/admin/orders` harus tetap dapat menampilkan dan mengubah status pesanan via MongoDB API
- Kalkulasi subtotal, pajak (11%), biaya layanan, diskon promo, dan diskon poin harus tetap benar
- Fitur penukaran poin (100 poin = Rp 10.000) harus tetap berfungsi
- Fallback ke `MOCK_MENU` jika koneksi MongoDB gagal harus tetap aktif
- Semua halaman admin lain (`/admin/menu`, `/admin/orders`) harus tidak terpengaruh

**Scope perbaikan:**
Hanya dua perubahan yang dilakukan:
1. Objek `statusMap` di `MenuMarketplace.tsx` (satu baris/blok kecil)
2. Fungsi `loadData()` dan `statusLabel` di `admin/page.tsx` (migrasi dari localStorage ke fetch API)

Semua interaksi yang tidak melibatkan `statusMap` atau `loadData()` harus menghasilkan output yang identik sebelum dan sesudah fix.

**Catatan:** Banner UI poin (`trackingState === 3`) di `MenuMarketplace.tsx` perlu diperbarui ke `trackingState === 4` seiring perubahan mapping `SELESAI` dari `3` ke `4`. Pemberian poin aktual (`if (order.status === 'SELESAI')`) sudah benar dan tidak perlu diubah.

## Hypothesized Root Cause

### Bug 1 — Tracking State Tidak Maju

1. **Copy-Paste Error pada statusMap**: Ketika status baru `DITERIMA` ditambahkan ke enum MongoDB, developer kemungkinan menyalin entry `MASUK: 0` dan lupa mengubah nilainya menjadi `1`. Ini adalah kesalahan off-by-one yang umum saat meng-extend enum secara incremental.
   - Bukti: Semua status lain (`DIMASAK: 1`, `SIAP: 2`, `SELESAI: 3`) sudah berurutan dengan benar
   - Hanya pasangan `MASUK: 0` dan `DITERIMA: 0` yang duplikat

2. **Penambahan Status Tanpa Update UI**: Status `DITERIMA` mungkin ditambahkan ke MongoDB enum (`admin/orders/page.tsx` sudah menggunakannya dengan benar dalam `STATUS_FLOW`) namun `statusMap` di `MenuMarketplace.tsx` tidak diperbarui secara bersamaan.

3. **Dampak Banner Poin**: Kondisi `trackingState === 3` untuk banner poin earned perlu diubah ke `trackingState === 4` karena mapping `SELESAI` bergeser dari `3` ke `4` setelah fix.

### Bug 2 — Dashboard Membaca dari localStorage

1. **Implementasi Awal Menggunakan Mock Data**: Dashboard kemungkinan diimplementasikan lebih awal saat MongoDB belum terhubung, menggunakan `localStorage` sebagai temporary data store. Setelah MongoDB dan endpoint `/api/seblak/orders` diimplementasikan untuk halaman `/admin/orders`, dashboard tidak dimigrasi ke source data yang sama.
   - Bukti: Halaman `/admin/orders` sudah menggunakan `fetch("/api/seblak/orders")` dengan benar
   - Hanya `admin/page.tsx` yang masih tertinggal menggunakan `localStorage`

2. **statusLabel Menggunakan Enum Lama**: `statusLabel` di dashboard menggunakan key `RECEIVED`, `COOKING`, `READY`, `COMPLETED` yang merupakan sisa dari enum versi pertama aplikasi sebelum diubah ke Bahasa Indonesia (`MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`). Halaman `/admin/orders` sudah menggunakan `STATUS_CONFIG` dengan enum baru yang benar.

3. **Hardcode Jumlah Menu**: Fallback `setMenus(Array(13).fill(null)...)` untuk jumlah menu adalah angka hardcode yang tidak mencerminkan data aktual MongoDB.

## Correctness Properties

Property 1: Bug Condition — Status Mapping Unik dan Berurutan

_For any_ string status MongoDB (`MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`) yang diproses oleh `statusMap` di `MenuMarketplace.tsx`, fungsi yang sudah diperbaiki SHALL memetakan setiap status ke integer yang unik dan strictly increasing, sehingga setiap transisi status admin menghasilkan perubahan `trackingState` yang dapat dideteksi oleh UI pelanggan. Secara konkret: `statusMap["MASUK"] = 0`, `statusMap["DITERIMA"] = 1`, `statusMap["DIMASAK"] = 2`, `statusMap["SIAP"] = 3`, `statusMap["SELESAI"] = 4`.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Bug Condition — Dashboard Membaca dari MongoDB API

_For any_ pemanggilan `loadData()` di `admin/page.tsx` setelah fix, fungsi yang sudah diperbaiki SHALL melakukan `fetch("/api/seblak/orders")` untuk mengambil data pesanan dan `fetch("/api/seblak/menu")` untuk mengambil data menu, menghasilkan state `orders` dan `menus` yang mencerminkan data aktual dari MongoDB, bukan dari `localStorage`.

**Validates: Requirements 2.4, 2.5, 2.6, 2.7, 2.8**

Property 3: Preservation — Perilaku Non-Buggy Tidak Berubah

_For any_ interaksi yang tidak melibatkan `statusMap` (misalnya klik mouse, navigasi, checkout) atau yang tidak melibatkan `loadData()` di dashboard (misalnya tombol navigasi ke halaman lain), fungsi yang sudah diperbaiki SHALL menghasilkan output yang identik dengan fungsi asli, memastikan tidak ada regresi pada alur checkout, polling, manajemen poin, dan halaman admin lainnya.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

## Fix Implementation

### Perubahan yang Diperlukan

Dengan asumsi analisis root cause di atas benar:

---

**File 1:** `src/components/SeblakRR/MenuMarketplace.tsx`

**Fungsi:** Polling `useEffect` (~baris 100–120) dan kondisi banner poin (~baris 350)

**Perubahan Spesifik:**

1. **Perbaiki `statusMap` — Mapping Unik dan Berurutan:**
   ```typescript
   // SEBELUM (buggy):
   const statusMap: Record<string, number> = {
     MASUK: 0, DITERIMA: 0, DIMASAK: 1, SIAP: 2, SELESAI: 3, DITOLAK: 3
   };

   // SESUDAH (fixed):
   const statusMap: Record<string, number> = {
     MASUK: 0, DITERIMA: 1, DIMASAK: 2, SIAP: 3, SELESAI: 4, DITOLAK: 4
   };
   ```

2. **Perbarui Kondisi Banner Poin Earned:**
   ```typescript
   // SEBELUM:
   {trackingState === 3 && (

   // SESUDAH:
   {trackingState === 4 && (
   ```
   Catatan: Pemberian poin aktual (`if (order.status === 'SELESAI')`) sudah benar dan tidak perlu diubah.

---

**File 2:** `src/app/admin/page.tsx`

**Fungsi:** `loadData()` (~baris 35–50), `statusLabel` (~baris 22–29), `useEffect` (~baris 52–56)

**Perubahan Spesifik:**

3. **Migrasi `loadData()` ke Async Fetch API:**
   ```typescript
   // SEBELUM (buggy):
   const loadData = () => {
     const savedOrders = localStorage.getItem('seblakrr_orders');
     if (savedOrders) setOrders(JSON.parse(savedOrders));
     const savedMenu = localStorage.getItem('seblakrr_menu');
     if (savedMenu) setMenus(JSON.parse(savedMenu));
     else setMenus(Array(13).fill(null).map((_, i) => ({ _id: String(i), ... })));
     setLastRefresh(new Date());
   };

   // SESUDAH (fixed):
   const loadData = async () => {
     try {
       const [ordersRes, menuRes] = await Promise.all([
         fetch("/api/seblak/orders"),
         fetch("/api/seblak/menu"),
       ]);
       const ordersData = await ordersRes.json();
       const menuData = await menuRes.json();
       if (ordersData.success) setOrders(ordersData.data);
       if (menuData.success) setMenus(menuData.data);
     } catch { /* ignore */ }
     setLastRefresh(new Date());
   };
   ```

4. **Perbarui `statusLabel` ke Enum MongoDB:**
   ```typescript
   // SEBELUM (buggy — menggunakan enum lama):
   const statusLabel = {
     RECEIVED: { label: 'Diterima', ... },
     COOKING:  { label: 'Dimasak', ... },
     READY:    { label: 'Siap Diambil', ... },
     COMPLETED:{ label: 'Selesai', ... },
   };

   // SESUDAH (fixed — menggunakan enum MongoDB):
   const statusLabel = {
     MASUK:    { label: 'Masuk',       color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',     icon: <Bell className="w-3 h-3" /> },
     DITERIMA: { label: 'Diterima',    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',     icon: <Clock className="w-3 h-3" /> },
     DIMASAK:  { label: 'Dimasak',     color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', icon: <ChefHat className="w-3 h-3" /> },
     SIAP:     { label: 'Siap Diambil',color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', icon: <ShoppingBag className="w-3 h-3" /> },
     SELESAI:  { label: 'Selesai',     color: 'text-green-400 bg-green-500/10 border-green-500/30',  icon: <CheckCircle className="w-3 h-3" /> },
     DITOLAK:  { label: 'Ditolak',     color: 'text-red-400 bg-red-500/10 border-red-500/30',        icon: <XCircle className="w-3 h-3" /> },
   };
   ```

5. **Perbarui `useEffect` untuk Mendukung Async `loadData()`:**
   ```typescript
   // SEBELUM:
   const interval = setInterval(loadData, 5000);

   // SESUDAH (tidak berubah secara struktur, tapi loadData sekarang async):
   useEffect(() => {
     setMounted(true);
     loadData();
     const interval = setInterval(loadData, 5000);
     return () => clearInterval(interval);
   }, []);
   ```

6. **Perbarui Filter Statistik untuk Menggunakan Enum Baru:**
   ```typescript
   // SEBELUM:
   const completedOrders = orders.filter(o => o.status === 'COMPLETED');

   // SESUDAH:
   const completedOrders = orders.filter(o => o.status === 'SELESAI');
   ```

7. **Tambahkan Import `Bell` dan `XCircle` yang Diperlukan:**
   ```typescript
   import { ShoppingBag, UtensilsCrossed, TrendingUp, Clock, CheckCircle,
            ChefHat, Star, ArrowRight, RefreshCw, Bell, XCircle } from "lucide-react";
   ```

## Testing Strategy

### Validation Approach

Strategi pengujian menggunakan pendekatan dua fase: pertama, tulis tes eksplorasi pada kode yang **belum diperbaiki** untuk mengkonfirmasi root cause dan mendapatkan counterexample nyata; kemudian setelah fix diterapkan, verifikasi fix checking (semua input buggy kini menghasilkan perilaku yang benar) dan preservation checking (semua input non-buggy menghasilkan output yang identik).

### Exploratory Bug Condition Checking

**Goal**: Mendapatkan counterexample yang membuktikan bug sebelum implementasi fix. Mengkonfirmasi atau menyanggah analisis root cause. Jika disanggah, perlu re-hipotesis.

**Test Plan**: Buat tes unit yang mensimulasikan pemanggilan `statusMap` dan `loadData()` pada kode yang belum diperbaiki, lalu asersi perilaku yang salah.

**Test Cases:**
1. **Duplicate Mapping Test** (akan gagal pada kode buggy):
   Buat snapshot `statusMap` dari kode asli, asersi bahwa `statusMap["DITERIMA"] !== statusMap["MASUK"]` — akan gagal karena keduanya = `0`

2. **Sequential Progress Test** (akan gagal pada kode buggy):
   Simulasikan urutan status `MASUK → DITERIMA → DIMASAK → SIAP → SELESAI`, verifikasi bahwa setiap transisi meningkatkan `trackingState` — akan gagal di transisi `MASUK → DITERIMA`

3. **Loyalty Points Trigger Test** (akan gagal pada kode buggy):
   Simulasikan polling dengan `order.status = "SELESAI"`, verifikasi `trackingState === 4` untuk banner poin — akan gagal karena mapping saat ini menghasilkan `trackingState === 3`

4. **Dashboard Data Source Test** (akan gagal pada kode buggy):
   Mock `localStorage.getItem` untuk mengembalikan `null`, panggil `loadData()`, asersi bahwa `orders` tetap `[]` — mengkonfirmasi bahwa dashboard tidak memanggil fetch API

5. **Status Badge Render Test** (akan gagal pada kode buggy):
   Render komponen dashboard dengan order `{ status: "MASUK" }`, verifikasi bahwa badge menampilkan "Masuk" — akan gagal karena `statusLabel["MASUK"]` = `undefined`

**Expected Counterexamples:**
- `statusMap["DITERIMA"] === 0` padahal seharusnya `=== 1`
- Setelah transisi `MASUK → DITERIMA`, `trackingState` tidak berubah dari `0`
- `loadData()` tidak pernah memanggil `fetch` — data selalu dari `localStorage`
- `statusLabel["MASUK"]` = `undefined` — badge menggunakan fallback yang salah

### Fix Checking

**Goal**: Verifikasi bahwa untuk semua input di mana bug condition berlaku, fungsi yang sudah diperbaiki menghasilkan perilaku yang diharapkan.

**Pseudocode:**
```
// Fix Check 1 — Tracking State
FOR ALL status IN ["MASUK", "DITERIMA", "DIMASAK", "SIAP", "SELESAI"] DO
  result_fixed := statusMap_fixed[status]
  ASSERT result_fixed IS UNIQUE ACROSS ALL statuses
  IF status = "DITERIMA" THEN ASSERT result_fixed > statusMap_fixed["MASUK"]
  IF status = "DIMASAK"  THEN ASSERT result_fixed > statusMap_fixed["DITERIMA"]
  IF status = "SIAP"     THEN ASSERT result_fixed > statusMap_fixed["DIMASAK"]
  IF status = "SELESAI"  THEN ASSERT result_fixed > statusMap_fixed["SIAP"]
END FOR

// Fix Check 2 — Dashboard Data Source
MOCK fetch("/api/seblak/orders") TO RETURN { success: true, data: [order1, order2] }
MOCK fetch("/api/seblak/menu")   TO RETURN { success: true, data: [menu1, menu2] }
CALL loadData_fixed()
ASSERT orders = [order1, order2]
ASSERT menus = [menu1, menu2]
ASSERT fetch WAS CALLED WITH "/api/seblak/orders"
ASSERT fetch WAS CALLED WITH "/api/seblak/menu"
```

### Preservation Checking

**Goal**: Verifikasi bahwa untuk semua input di mana bug condition tidak berlaku, fungsi yang sudah diperbaiki menghasilkan output yang identik dengan fungsi asli.

**Pseudocode:**
```
// Preservation Check 1 — Status di luar MASUK/DITERIMA tidak terpengaruh
FOR ALL status IN ["DIMASAK", "SIAP", "SELESAI", "DITOLAK"] DO
  ASSERT statusMap_original[status] = statusMap_fixed[status]
    OR (statusMap_original[status] + 1) = statusMap_fixed[status]  // shift karena penambahan DITERIMA=1
END FOR

// Preservation Check 2 — Polling behavior tidak berubah
FOR ALL orderId, status IN non_buggy_scenarios DO
  ASSERT polling_original(orderId, status).sideEffects = polling_fixed(orderId, status).sideEffects
END FOR
```

**Testing Approach**: Property-based testing direkomendasikan untuk preservation checking karena:
- Dapat menghasilkan banyak kombinasi status secara otomatis
- Menangkap edge case yang mungkin terlewat oleh unit test manual
- Memberikan jaminan kuat bahwa perilaku non-buggy tidak berubah

**Test Cases:**
1. **Checkout Flow Preservation**: Verifikasi alur `handleCheckoutClick → confirmOrder → POST /api/seblak/orders` tidak berubah setelah fix
2. **Polling Continue Preservation**: Verifikasi polling setiap 5 detik tetap berjalan dan memanggil endpoint yang sama
3. **Admin Orders Page Preservation**: Verifikasi halaman `/admin/orders` tetap berfungsi tanpa perubahan
4. **Poin Calculation Preservation**: Verifikasi `poinDari = Math.floor(subtotal / 1000)` dan pemberian poin via `dispatch(tambahPoin(poinDari))` tetap benar
5. **Dashboard Navigation Preservation**: Verifikasi link navigasi dan layout dashboard tidak terpengaruh

### Unit Tests

- Test bahwa setiap key di `statusMap_fixed` memiliki nilai integer unik
- Test bahwa nilai `statusMap_fixed` bersifat strictly increasing mengikuti urutan `MASUK < DITERIMA < DIMASAK < SIAP < SELESAI`
- Test bahwa `loadData_fixed()` memanggil `fetch("/api/seblak/orders")` dan `fetch("/api/seblak/menu")`
- Test bahwa `statusLabel` di dashboard mencakup semua key MongoDB: `MASUK`, `DITERIMA`, `DIMASAK`, `SIAP`, `SELESAI`, `DITOLAK`
- Test bahwa `completedOrders` filter menggunakan `status === 'SELESAI'` bukan `status === 'COMPLETED'`
- Test edge case: `statusMap_fixed["DITOLAK"]` mengembalikan nilai valid (tidak crash UI)

### Property-Based Tests

- **Property**: Untuk semua status MongoDB yang valid, `statusMap_fixed[status]` menghasilkan integer dalam rentang `[0, 4]` tanpa duplikat
- **Property**: Untuk semua urutan transisi status yang valid sesuai `STATUS_FLOW`, `trackingState` tidak pernah menurun (monotone non-decreasing)
- **Property**: Untuk semua respons API yang mengembalikan `{ success: true, data: orders }`, `loadData_fixed()` selalu menghasilkan `orders.length === data.length`
- **Property**: Untuk semua respons API di luar kontrol bug (koneksi gagal), `loadData_fixed()` tetap memanggil fetch sebelum fallback

### Integration Tests

- Test end-to-end: Pelanggan checkout → admin ubah status ke `DITERIMA` → polling pelanggan mendeteksi perubahan dan `trackingState` menjadi `1`
- Test end-to-end: Admin membuka dashboard → `loadData()` dipanggil → statistik menampilkan data real dari MongoDB
- Test end-to-end: Admin tekan tombol "Refresh" → `loadData()` dipanggil ulang → data diperbarui dari API
- Test visual: Badge status di dashboard menampilkan warna dan label yang sesuai untuk setiap status MongoDB
- Test: Urutan lengkap `MASUK → DITERIMA → DIMASAK → SIAP → SELESAI` menghasilkan `trackingState` yang bergerak dari 0 ke 4 tanpa melewati step
