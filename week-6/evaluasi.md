# Evaluasi Kritis Draf AI — Class Diagram

**Mata Kuliah:** Perancangan Berbasis Objek
**Materi:** Minggu 6 — Class Diagram (Agregasi & Asosiasi)
**Baseline:** `index.js` (manual, tanpa Pustakawan)
**Draf AI:** `modify.js` (dengan Pustakawan) + `diagram/class_diagram.mmd` + `diagram/class_diagram.puml`
**Kerangka:** Traceability & kelengkapan relasi

---

## Tabel 1 — Traceability (setiap class & relasi → requirement)

| Class / Relasi | Sumber requirement / komentar | Traceable? |
|----------------|-------------------------------|:----------:|
| `Buku` | Kode `index.js` + komentar agregasi ("mengagregasi ... relasi memiliki banyak") | Ya |
| `Anggota` | Kode `index.js` + komentar agregasi | Ya |
| `Peminjaman` | Kode `index.js` + komentar "asosiasi -> Buku/Anggota" | Ya |
| `Perpustakaan` | Komentar "mengagregasi Buku, Anggota, dan Peminjaman" | Ya |
| `Pustakawan` | Tugas 1 (soal): class baru yang diminta | Ya |
| Relasi `Peminjaman -> Buku` | Komentar `// asosiasi -> Buku` | Ya |
| Relasi `Peminjaman -> Anggota` | Komentar `// asosiasi -> Anggota` | Ya |
| Relasi `Perpustakaan -> Buku/Anggota/Peminjaman` (1..\*) | Komentar "mengagregasi ... relasi memiliki banyak" | Ya |
| Relasi `Perpustakaan -> Pustakawan` (1..\*) | Tugas 1: "asosiasi 1..\* mengelola" | Ya |
| Relasi `Peminjaman -> Pustakawan` (diproses oleh) | Tidak ada di requirement; ditambahkan draf AI | ⚠ Perlu justifikasi |

**Hasil:** 9 dari 10 item tertelusur penuh ke requirement/komentar. Satu relasi
tambahan (`diproses oleh`) perlu dinyatakan sebagai asumsi desain agar
traceability 100%.

---

## Tabel 2 — Kelengkapan Relasi (baseline vs draf AI)

| Kriteria | Baseline (`index.js`) | Draf AI (`modify.js`) | Keterangan |
|----------|----------------------|----------------------|------------|
| Class `Pustakawan` | Tidak ada | Ada (`id`, `nip`, `nama`) | Dipenuhi Tugas 1 |
| Asosiasi 1..\* "mengelola" (Perpustakaan → Pustakawan) | Tidak ada | Ada (1 → 1..\*) via `#pustakawan` | Sesuai requirement |
| Relasi agregasi 1..\* (Buku, Anggota, Peminjaman) | Implisit (array internal) | Eksplisit di diagram (`o-- "1..*"`) | Kelengkapan meningkat |
| Relasi asosiasi `Peminjaman -> Buku` dan `-> Anggota` | Implisit (atribut) | Eksplisit (1..1) | Diambil dari komentar |
| Multiplicity eksplisit | Tidak ada | Ada (1, 1..\*) | Kode JS tidak menyatakan cardinality formal |
| Navigability / arah asosiasi | Tidak ditandai | Ditandai label + arah | Lebih mudah diverifikasi |
| Class tanpa dasar requirement | — | Tidak ada | Larangan pada prompt terpenuhi |

---

## Temuan / Keterbatasan Draf AI

1. **Relasi tambahan tanpa dasar requirement:** `Peminjaman -> Pustakawan`
   ("diproses oleh") tidak ada pada komentar baseline. Secara domain masuk akal
   (pustakawan memproses peminjaman), tetapi untuk traceability 100% harus
   dinyatakan sebagai asumsi desain/requirement eksplisit.
2. **Multiplicity baseline hanya implisit:** array internal pada class tidak
   menyatakan cardinality formal; diagram final membuatnya eksplisit sehingga
   kelengkapan relasi mudah diverifikasi.
3. **Terminologi "asosiasi 1..\* mengelola":** diwujudkan dengan koleksi
   `#pustakawan`. Dalam UML, relasi ini valid sebagai asosiasi 1..\* ataupun
   agregasi; diagram final memakai asosiasi sesuai wording soal.

---

## Kesimpulan

Draf AI **lengkap dan tertelusur** untuk seluruh relasi yang diminta soal.
Kualitas tinggi pada kelengkapan relasi (semua relasi dari komentar terwakili,
plus multiplicity eksplisit). Satu catatan kritis: relasi `diproses oleh`
perlu dijustifikasi sebagai asumsi desain agar memenuhi traceability penuh.
