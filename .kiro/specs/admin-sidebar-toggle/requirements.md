# Requirements Document

## Introduction

Fitur ini menambahkan kemampuan toggle (buka/tutup) pada sidebar navigasi di halaman admin QR Menu Seblak RR. Saat ini sidebar selalu terbuka dengan lebar tetap 256px (`w-64`), sehingga area konten utama tidak dapat dimaksimalkan. Dengan adanya toggle, admin dapat menutup sidebar untuk mendapatkan lebih banyak ruang layar saat bekerja, lalu membukanya kembali kapan saja. Fitur ini diimplementasikan pada `src/app/admin/layout.tsx` yang merupakan layout bersama untuk semua halaman admin.

---

## Glossary

- **Sidebar**: Panel navigasi kiri pada halaman admin dengan lebar 256px yang memuat logo, menu navigasi (Dashboard, Pesanan, Manajemen Menu), dan footer.
- **Tombol_Toggle**: Elemen interaktif (tombol) yang digunakan untuk membuka atau menutup Sidebar.
- **Admin_Layout**: Komponen layout bersama (`src/app/admin/layout.tsx`) yang membungkus seluruh halaman admin.
- **Konten_Utama**: Area `<main>` di sebelah kanan Sidebar yang menampilkan konten halaman admin aktif.
- **State_Sidebar**: Nilai boolean yang menyimpan kondisi Sidebar saat ini — `terbuka` (true) atau `tertutup` (false).
- **Kondisi_Terbuka**: Keadaan Sidebar saat terlihat penuh dengan lebar 256px.
- **Kondisi_Tertutup**: Keadaan Sidebar saat disembunyikan atau dikecilkan sehingga tidak menampilkan teks dan ikon navigasi secara penuh.

---

## Requirements

### Requirement 1: Tombol Toggle Sidebar

**User Story:** Sebagai admin, saya ingin ada tombol toggle pada antarmuka admin, agar saya bisa membuka dan menutup sidebar sesuai kebutuhan.

#### Acceptance Criteria

1. THE Admin_Layout SHALL menyediakan Tombol_Toggle yang ditempatkan di Top Bar (kiri atas, sebelum judul halaman) dan selalu terlihat pada semua kondisi State_Sidebar.
2. WHEN Tombol_Toggle diklik dan State_Sidebar adalah `expanded` (lebar 256px), THE Admin_Layout SHALL mengubah State_Sidebar menjadi `collapsed` (sidebar tersembunyi, Konten_Utama mengisi lebar penuh).
3. WHEN Tombol_Toggle diklik dan State_Sidebar adalah `collapsed`, THE Admin_Layout SHALL mengubah State_Sidebar menjadi `expanded` (sidebar kembali ke lebar 256px).
4. WHILE State_Sidebar adalah `expanded`, THE Tombol_Toggle SHALL menampilkan ikon `PanelLeftClose` (atau setara); WHILE State_Sidebar adalah `collapsed`, THE Tombol_Toggle SHALL menampilkan ikon `PanelLeftOpen` (atau setara).
5. THE Admin_Layout SHALL menginisialisasi State_Sidebar dalam kondisi `expanded` saat halaman admin pertama kali dimuat.

---

### Requirement 2: Tampilan Sidebar Saat Terbuka

**User Story:** Sebagai admin, saya ingin sidebar dalam kondisi terbuka menampilkan semua elemen navigasi secara lengkap, agar saya dapat mengakses semua menu dengan mudah.

#### Acceptance Criteria

1. WHILE State_Sidebar adalah `expanded`, THE Sidebar SHALL ditampilkan dengan lebar tepat 256px.
2. WHILE State_Sidebar adalah `expanded`, THE Sidebar SHALL menampilkan logo "SR", teks "SeblakRR", dan teks "Admin Panel" secara bersamaan dalam area header sidebar.
3. WHILE State_Sidebar adalah `expanded`, THE Sidebar SHALL menampilkan label teks dan teks deskripsi untuk setiap item navigasi: "Dashboard" dengan deskripsi "Ringkasan & statistik", "Pesanan" dengan deskripsi "Kelola pesanan masuk", "Manajemen Menu" dengan deskripsi "Tambah, edit, hapus menu".
4. WHILE State_Sidebar adalah `expanded`, THE Sidebar SHALL menampilkan link "Lihat Halaman User" (yang membuka halaman `/` di tab baru) dan teks hak cipta "Seblak RR © 2025 · Simulasi" di bagian footer.
5. WHILE State_Sidebar adalah `expanded`, THE Sidebar SHALL menampilkan item navigasi yang aktif (pathname cocok) dengan latar belakang `bg-orange-600` yang berbeda secara visual dari item tidak aktif.

---

### Requirement 3: Tampilan Sidebar Saat Tertutup

**User Story:** Sebagai admin, saya ingin sidebar yang tertutup tidak memakan ruang layar berlebih, agar area konten utama bisa lebih luas.

#### Acceptance Criteria

1. WHILE State_Sidebar adalah `collapsed`, THE Sidebar SHALL tidak menampilkan label teks dan teks deskripsi item navigasi sehingga tidak terlihat dan tidak memakan ruang layout.
2. WHILE State_Sidebar adalah `collapsed`, THE Sidebar SHALL menampilkan hanya ikon setiap item navigasi dengan ukuran 20×20 piksel (kelas `w-5 h-5`).
3. WHILE State_Sidebar adalah `collapsed`, THE Sidebar SHALL memiliki lebar tepat 64px, yang cukup untuk menampilkan ikon saja.
4. WHILE State_Sidebar adalah `collapsed`, THE Sidebar SHALL tidak menampilkan teks "SeblakRR", "Admin Panel", link "Lihat Halaman User", dan teks hak cipta sehingga tidak terlihat dan tidak memakan ruang layout.
5. WHILE State_Sidebar adalah `collapsed` dan kursor diarahkan ke ikon item navigasi, THE Sidebar SHALL menampilkan tooltip dengan label item tersebut dalam waktu tidak lebih dari 300ms; IF tooltip gagal ditampilkan atau melewati batas waktu 300ms, THE Sidebar SHALL dianggap melanggar spesifikasi ini.

---

### Requirement 4: Perluasan Konten Utama

**User Story:** Sebagai admin, saya ingin area konten utama otomatis melebar saat sidebar ditutup, agar saya punya lebih banyak ruang untuk melihat data.

#### Acceptance Criteria

1. WHEN Tombol_Toggle diklik, THE Admin_Layout SHALL mengubah State_Sidebar (expanded ↔ collapsed) yang memicu perubahan lebar Sidebar dan Konten_Utama secara bersamaan.
2. WHEN State_Sidebar berubah menjadi `collapsed`, THE Konten_Utama SHALL melebar untuk mengisi seluruh lebar viewport yang tersedia (dikurangi 64px untuk sidebar collapsed).
3. WHEN State_Sidebar berubah menjadi `expanded`, THE Konten_Utama SHALL kembali ke lebar yang tersisa setelah Sidebar selebar 256px ditampilkan.
4. THE Admin_Layout SHALL menerapkan transisi animasi CSS dengan durasi antara 150ms hingga 300ms pada perubahan lebar Sidebar dan Konten_Utama; IF durasi yang ditentukan berada di luar rentang ini, THE Admin_Layout SHALL memaksa (clamp) nilai tersebut ke dalam rentang yang diperbolehkan.

---

### Requirement 5: Navigasi Tetap Berfungsi

**User Story:** Sebagai admin, saya ingin navigasi antar halaman admin tetap berfungsi dengan benar di semua kondisi sidebar, agar pekerjaan saya tidak terganggu.

#### Acceptance Criteria

1. WHILE Sidebar berada dalam kondisi `collapsed`, THE Sidebar SHALL tetap merender link navigasi yang dapat diklik untuk setiap item dengan area klik minimal 44×44 piksel (Dashboard, Pesanan, Manajemen Menu).
2. WHEN item navigasi diklik, THE Admin_Layout SHALL mengarahkan pengguna ke URL yang sesuai (`/admin` untuk Dashboard, `/admin/orders` untuk Pesanan, `/admin/menu` untuk Manajemen Menu) tanpa mengubah State_Sidebar saat itu.
3. WHILE Sidebar berada dalam kondisi `collapsed`, THE Sidebar SHALL tetap menampilkan indikator visual aktif pada ikon item yang URL-nya sama persis dengan pathname halaman yang sedang dibuka, dengan tampilan yang berbeda secara visual dari item tidak aktif.
4. IF pathname halaman yang sedang dibuka tidak sama persis dengan URL item navigasi manapun (termasuk sub-halaman seperti `/admin/orders/123` yang tidak sama persis dengan `/admin/orders`), THEN THE Sidebar SHALL tidak menampilkan indikator visual aktif pada item manapun.

---

### Requirement 6: Posisi Tombol Toggle

**User Story:** Sebagai admin, saya ingin tombol toggle mudah ditemukan dan dijangkau, agar saya dapat menggunakannya dengan cepat.

#### Acceptance Criteria

1. THE Tombol_Toggle SHALL ditempatkan di sisi kiri Top Bar, sebelum teks judul halaman aktif, sehingga terlihat tanpa scroll pada semua ukuran viewport yang didukung admin panel.
2. THE Tombol_Toggle SHALL tetap terlihat dan dapat diklik (tidak tertimpa elemen lain) baik saat State_Sidebar `expanded` maupun `collapsed`, termasuk saat sidebar dalam kondisi expanded yang secara fungsional redundan.
3. WHILE State_Sidebar adalah `collapsed`, THE Tombol_Toggle SHALL dapat diakses tanpa memerlukan scroll vertikal maupun horizontal pada semua ukuran viewport yang didukung admin panel.
4. IF elemen lain di Top Bar bertumpuk dengan Tombol_Toggle pada lebar viewport tertentu, THEN THE Tombol_Toggle SHALL tetap mendapatkan prioritas tampil dan tidak tersembunyi.

---

### Requirement 7: Integritas Tampilan yang Ada

**User Story:** Sebagai admin, saya ingin fitur toggle tidak merusak tampilan dan fungsionalitas yang sudah ada, agar pengalaman menggunakan panel admin tetap konsisten.

#### Acceptance Criteria

1. THE Admin_Layout SHALL mempertahankan semua elemen yang sudah ada (logo SR, nav items, footer link, Top Bar, badge "Simulasi Aktif") setelah fitur toggle diimplementasikan.
2. THE Admin_Layout SHALL mempertahankan skema warna yang sudah ada (`bg-[#140800]` untuk sidebar, `bg-[#0d0400]` untuk background utama, warna aksen `orange-500`/`orange-600`) setelah fitur toggle diimplementasikan.
3. IF terjadi error saat merender komponen Sidebar, THEN THE Admin_Layout SHALL tetap menampilkan Konten_Utama dengan seluruh `{children}` tanpa gangguan.
4. THE Admin_Layout SHALL mempertahankan perilaku sticky (`sticky top-0`) pada Top Bar di kondisi State_Sidebar `expanded` maupun `collapsed`.
5. WHEN State_Sidebar berubah (expanded ↔ collapsed), THE Konten_Utama SHALL mereflow layout-nya tanpa menyembunyikan atau memotong konten `{children}` yang sedang ditampilkan.
