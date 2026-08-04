# Evaluasi Baseline Manual vs Draf AI

**Mata Kuliah:** Perancangan Berbasis Objek  
**Materi:** Minggu 5 — Activity Diagram ke Kode  
**Baseline:** `index.js` (manual)  
**Draf AI:** `modify.js` + `diagram/activity.puml` + `diagram/activity.mmd`

---

## Tabel Perbandingan

| No | Kriteria | Baseline (`index.js`) | Draf AI (`modify.js`) | Keterangan |
|:--:|---------|---------------------|---------------------|------------|
| 1 | **Atribut class Buku** | `isbn`, `judul`, `eksemplarTersedia` | `isbn`, `judul`, `eksemplarTersedia`, `jenis` | Draf AI menambah atribut `jenis` (UMUM/REFERENSI) untuk membedakan jenis buku |
| 2 | **Atribut class Anggota** | `id`, `nama`, `tunggakan`, `peminjamanAktif` | `id`, `nama`, `tunggakan`, `peminjamanAktif`, `role` | Draf AI menambah atribut `role` (MAHASISWA/DOSEN) untuk mengatur hak akses |
| 3 | **Jumlah decision node** | 3 node | 4 node | Draf AI menambah 1 node untuk pengecekan buku referensi |
| 4 | **Jumlah guard condition** | 3 guard | 5 guard | Setiap node punya 2 cabang (ya/tidak). Node referensi + node izin menyumbang 2 guard tambahan |
| 5 | **Alasan penolakan** | `STOK_HABIS`, `ADA_TUNGGAKAN`, `BATAS_PINJAM` | + `BUTUH_IZIN_REFERENSI` | Draf AI menambah jalur penolakan baru untuk buku referensi tanpa izin |
| 6 | **Test coverage** | 3 skenario | 5 skenario | Draf AI menambah 2 skenario: mahasiswa pinjam referensi (ditolak) dan dosen pinjam referensi (berhasil) |
| 7 | **Diagram activity** | Tidak ada | `activity.puml` (PlantUML), `activity.mmd` (Mermaid) | Draf AI dilengkapi diagram dengan guard condition eksplisit di setiap cabang |
| 8 | **Struktur kode** | Satu file (`index.js`) | Dua file + folder diagram | Draf AI terpisah antara kode, diagram, dan evaluasi |

---

## Kesimpulan

1. **Draf AI memiliki atribut yang lebih lengkap** — class `Buku` dan `Anggota` mendapat properti tambahan untuk mengakomodasi aturan peminjaman buku referensi.
2. **Draf AI menerjemahkan lebih banyak decision node** dari activity diagram (3 → 5 guard condition) sehingga alur lebih sesuai dengan kebutuhan nyata.
3. **Test coverage lebih luas** — menjangkau skenario positif dan negatif untuk buku referensi yang tidak ada di baseline.
4. **Dokumentasi lebih baik** — dilengkapi diagram PlantUML dan Mermaid yang setiap guard condition-nya tertulis eksplisit.
5. **Kekurangan baseline** — tidak memiliki diagram activity dan tidak menangani kasus buku referensi.
