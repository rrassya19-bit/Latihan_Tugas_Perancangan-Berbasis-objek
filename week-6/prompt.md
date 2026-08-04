# Prompt Engineering — AI Text-to-Diagram

**Mata Kuliah:** Perancangan Berbasis Objek
**Materi:** Minggu 6 — Class Diagram (Agregasi & Asosiasi)
**Konteks:** Baseline kode di `index.js`. Komentar yang menjadi dasar diagram:
`// asosiasi -> Buku`, `// asosiasi -> Anggota`, dan
`// Perpustakaan mengagregasi Buku, Anggota, dan Peminjaman (relasi "memiliki banyak").`

---

## Prompt yang Digunakan

Prompt minimal wajib menyebutkan: (1) daftar class dan tanggung jawab;
(2) atribut dan method penting; (3) jenis relasi serta multiplicity;
(4) larangan menambahkan class tanpa dasar requirement; (5) format output Mermaid atau PlantUML.

```
Buatkan Class Diagram untuk sistem perpustakaan SIPUSTAKA.

1. Daftar class dan tanggung jawab:
   - Buku          : entitas buku yang dimiliki perpustakaan.
   - Anggota       : entitas orang yang meminjam buku.
   - Pustakawan    : entitas staf yang mengelola operasional perpustakaan.
   - Peminjaman    : transaksi peminjaman satu buku oleh satu anggota,
                     diproses oleh satu pustakawan.
   - Perpustakaan  : pengelola pusat yang memiliki banyak Buku, Anggota,
                     Peminjaman, dan Pustakawan.

2. Atribut dan method penting:
   - Buku          : isbn, judul, kategori, jumlahEksemplar, eksemplarTersedia.
   - Anggota       : id, nama, email.
   - Pustakawan    : id, nip, nama.
   - Peminjaman    : id, tanggalPinjam, status.
   - Perpustakaan  : tambahBuku(), tambahAnggota(), tambahPustakawan(),
                     daftarPustakawan(), pinjamkan(), daftarPeminjamanAktif().

3. Jenis relasi serta multiplicity:
   - Peminjaman berasosiasi dengan Buku (1..1) dan Anggota (1..1).
   - Perpustakaan mengelola Pustakawan (1..*).
   - Perpustakaan mengagregasi Buku, Anggota, dan Peminjaman (1..*).
   - Peminjaman mencatat Pustakawan yang memproses (diproses oleh).

4. Larangan: jangan menambahkan class, atribut, atau relasi yang tidak
   memiliki dasar requirement/komentar pada kode sumber.

5. Format output: Mermaid classDiagram DAN PlantUML.
```

---

## Hasil Diagram

- **Mermaid:** `diagram/class_diagram.mmd`
- **PlantUML:** `diagram/class_diagram.puml`

Hasil diagram dinilai dengan Kerangka Evaluasi Kritis pada `evaluasi.md`.
