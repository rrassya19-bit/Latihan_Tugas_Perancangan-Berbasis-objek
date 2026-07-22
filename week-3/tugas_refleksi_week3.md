# Laporan Tugas Minggu 3 — Analisis Kebutuhan SIPUSTAKA

**Nama:** Ahmad Rassya Maulana  
**NIM:** 20250140157  
**Mata Kuliah:** Perancangan Berbasis Objek  
**File Utama:** `week-3/modify.js`

---

## Tujuan Tugas

Tugas ini bertujuan untuk menganalisis kebutuhan sistem informasi perpustakaan (SIPUSTAKA) yang diberikan dosen di `index.js`, kemudian mengembangkannya dengan:
1. Menambahkan kebutuhan fungsional & non-fungsional baru
2. Menulis user story tambahan
3. Mengidentifikasi entitas baru dan menulis skeleton class-nya

---

## File yang Terlibat

| File | Status | Keterangan |
|------|--------|------------|
| `week-3/index.js` | Tidak diubah | File asli dosen berisi skeleton class awal |
| `week-3/modify.js` | **Ditulis** | File tugas saya — berisi analisis + skeleton class + verifikasi |
| `week-3/tugas_refleksi_week3.md` | **File ini** | Laporan refleksi tugas |

---

## Analisis Kebutuhan SIPUSTAKA

### A. Kebutuhan Fungsional

Kebutuhan fungsional adalah fitur-fitur yang harus bisa dilakukan oleh sistem.

#### Kebutuhan Fungsional dari Dosen (no. 1–5):

| No | Kebutuhan | Peran |
|----|-----------|-------|
| 1 | Mencari buku berdasarkan judul/kategori | Anggota |
| 2 | Mengajukan peminjaman buku yang tersedia | Anggota |
| 3 | Mengembalikan buku yang sedang dipinjam | Anggota |
| 4 | Menambah/mengubah data buku | Pustakawan |
| 5 | Mendaftarkan anggota baru | Pustakawan |

#### Kebutuhan Fungsional Tambahan Saya (no. 6–10):

| No | Kebutuhan | Peran | Alasan Ditambahkan |
|----|-----------|-------|--------------------|
| 6 | Memperpanjang masa peminjaman (maks. 1x) | Anggota | Anggota kadang butuh waktu lebih untuk membaca |
| 7 | Melihat riwayat peminjaman pribadi | Anggota | Agar anggota bisa track buku yang pernah dipinjam |
| 8 | Mengelola denda keterlambatan | Pustakawan | Agar ada sanksi bagi yang telat mengembalikan |
| 9 | Melihat laporan peminjaman bulanan | Pustakawan | Untuk monitoring kinerja perpustakaan |
| 10 | Mengirim notifikasi pengingat H-1 | Sistem | Mencegah anggota lupa tanggal jatuh tempo |

**Total:** 10 kebutuhan fungsional (5 dari dosen + 5 tambahan saya)

---

### B. Kebutuhan Non-Fungsional

Kebutuhan non-fungsional adalah kualitas/aturan yang harus dimiliki sistem.

#### Non-Fungsional dari Dosen (no. 1–2):

| No | Kebutuhan | Kategori |
|----|-----------|----------|
| 1 | Sistem menolak peminjaman jika stok habis | Integritas data |
| 2 | Riwayat peminjaman tetap tersimpan setelah buku dikembalikan | Retensi data |

#### Non-Fungsional Tambahan Saya (no. 3–4):

| No | Kebutuhan | Kategori | Alasan Ditambahkan |
|----|-----------|----------|--------------------|
| 3 | Password anggota & pustakawan dienkripsi | Keamanan | Melindungi data pengguna dari kebocoran |
| 4 | Sistem mampu menangani 500+ peminjaman aktif | Skalabilitas | Perpustakaan bisa berkembang tanpa ganti sistem |

**Total:** 4 kebutuhan non-fungsional (2 dari dosen + 2 tambahan saya)

---

## User Story

User story adalah cerita pengguna yang menjelaskan siapa, ingin apa, dan mengapa.

### User Story dari Dosen:

| Peran | Aksi | Tujuan |
|-------|------|--------|
| Anggota | Mencari buku berdasarkan judul | Cepat menemukan buku yang dibutuhkan |
| Anggota | Meminjam buku yang tersedia | Bisa membaca di luar perpustakaan |
| Anggota | Melihat tanggal jatuh tempo | Tidak terkena denda |
| Pustakawan | Menambahkan judul buku baru | Koleksi selalu ter-update |

### User Story Tambahan Saya:

| Peran | Aksi | Tujuan | Terkait Kebutuhan |
|-------|------|--------|-------------------|
| Anggota | Memperpanjang peminjaman buku | Tidak terkena denda jika belum selesai membaca | F-6 |
| Pustakawan | Mengelola denda keterlambatan | Anggota lebih disiplin mengembalikan buku tepat waktu | F-8 |
| Anggota | Mendapat notifikasi pengingat pengembalian | Tidak lupa tanggal jatuh tempo | F-10 |

---

## Identifikasi Entitas (Class)

### Entitas dari Dosen (di `index.js`):

| Class | Properti | Method |
|-------|----------|--------|
| `Buku` | isbn, judul, penulis, jumlahEksemplar | - |
| `Anggota` | id, nama, email | cariBuku() |
| `Peminjaman` | buku, anggota, tanggalPinjam, status | - |
| `Pustakawan` | id, nama | tambahBuku() |

### Entitas Baru Tambahan Saya (di `modify.js`):

Berdasarkan kebutuhan no. 8 (denda) dan no. 10 (notifikasi), saya menambahkan 2 entitas baru:

#### 1. Class `Denda`

| Properti | Tipe | Deskripsi |
|----------|------|-----------|
| id | number | ID unik denda |
| peminjaman | object | Referensi ke objek Peminjaman |
| jumlah | number | Besar denda (Rp) |
| statusLunas | boolean | true jika sudah dibayar |
| tanggalDikenakan | date | Tanggal denda dikenakan |

**Alasan:** Kebutuhan F-8 (kelola denda) membutuhkan pencatatan denda yang terstruktur. Tidak bisa hanya disimpan sebagai properti di Peminjaman karena satu peminjaman bisa punya banyak denda.

#### 2. Class `Notifikasi`

| Properti | Tipe | Deskripsi |
|----------|------|-----------|
| id | number | ID unik notifikasi |
| anggota | object | Referensi ke objek Anggota |
| pesan | string | Isi notifikasi |
| tanggalKirim | date | Waktu notifikasi dikirim |
| statusBaca | boolean | true jika sudah dibaca anggota |

**Alasan:** Kebutuhan F-10 (notifikasi pengingat H-1) butuh entity terpisah agar sistem bisa mengirim, melacak, dan menandai status baca notifikasi untuk setiap anggota.

---

## Perubahan yang Dilakukan

### Yang Saya Buat:

| File | Sebelum | Sesudah |
|------|---------|---------|
| `modify.js` | Kosong (0 baris) | Berisi analisis kebutuhan + skeleton class (Buku, Anggota, Peminjaman, Pustakawan, Denda, Notifikasi) + console.log verifikasi |

### Yang Saya TIDAK Ubah:

| File | Alasan |
|------|--------|
| `index.js` | File asli dosen, tidak diubah sesuai instruksi |
| File lain di folder lain | Tidak relevan dengan tugas minggu 3 |

---

## Cara Menjalankan

Buka terminal di folder `week-3`, lalu jalankan:

```bash
node modify.js
```

**Output yang dihasilkan:**

```
Skeleton class hasil analisis kebutuhan berhasil dimuat:
- Buku, Anggota, Peminjaman, Pustakawan, Denda, Notifikasi

Coba jalankan salah satu method yang belum diimplementasikan:
-> Belum diimplementasikan — lihat Minggu 4
```

Ini membuktikan semua class berhasil dimuat dengan benar.

---

## Kesimpulan

| No | Kriteria Tugas | Status |
|----|---------------|--------|
| 1 | 5 kebutuhan fungsional tambahan | **Terpenuhi** (no. 6–10) |
| 2 | 2 kebutuhan non-fungsional tambahan | **Terpenuhi** (no. 3–4) |
| 3 | 3 user story tambahan | **Terpenuhi** (anggota & pustakawan) |
| 4 | Identifikasi entitas baru & tulis skeleton class | **Terpenuhi** (Denda & Notifikasi) |
| 5 | Tidak mengubah file asli dosen | **Terpenuhi** (index.js tetap) |

---

> **Catatan:** Method `cariBuku()` dan `tambahBuku()` masih berupa `throw new Error(...)` sesuai instruksi bahwa implementasi penuh akan dilakukan di minggu-minggu berikutnya setelah pemodelan UML selesai.
