// Minggu 5 — Dari Activity Diagram ke Kode
// Setiap decision node pada diagram diterjemahkan menjadi guard/percabangan.

class Buku {
    constructor(isbn, judul, eksemplarTersedia, jenis = "UMUM") {
        this.isbn = isbn;
        this.judul = judul;
        this.eksemplarTersedia = eksemplarTersedia;
        this.jenis = jenis;
    }
}

class Anggota {
    constructor(id, nama, tunggakan = 0, peminjamanAktif = 0, role = "MAHASISWA") {
        this.id = id;
        this.nama = nama;
        this.tunggakan = tunggakan;
        this.peminjamanAktif = peminjamanAktif;
        this.role = role;
    }
}

function prosesPeminjaman(buku, anggota) {
    console.log(`[MULAI] ${anggota.nama} mengajukan "${buku.judul}"`);

    console.log("[CEK] Buku tersedia?");

    if (buku.eksemplarTersedia <= 0) {
        console.log("[TOLAK] Stok buku habis.\n");
    return { berhasil: false, alasan: "STOK_HABIS" };
    }

  // ========== TUGAS 1: Jalur persetujuan khusus untuk buku Referensi ==========
    console.log("[CEK] Buku referensi?");
        if (buku.jenis === "REFERENSI") {
            console.log("[CEK] Anggota memiliki izin khusus? (role == DOSEN)");
        if (anggota.role !== "DOSEN") {
            console.log("[TOLAK] Buku referensi hanya untuk DOSEN.\n");
        return { berhasil: false, alasan: "BUTUH_IZIN_REFERENSI" };
        }
    }

    console.log("[CEK] Anggota memiliki tunggakan?");
        if (anggota.tunggakan > 0) {
    console.log(`[TOLAK] Tunggakan Rp${anggota.tunggakan}.\n`);
    return { berhasil: false, alasan: "ADA_TUNGGAKAN" };
    }

    console.log("[CEK] Peminjaman aktif sudah 3 atau lebih?");
        if (anggota.peminjamanAktif >= 3) {
    console.log("[TOLAK] Batas peminjaman aktif tercapai.\n");
    return { berhasil: false, alasan: "BATAS_PINJAM" };
    }

    buku.eksemplarTersedia -= 1;
    anggota.peminjamanAktif += 1;
    const catatan = {
        isbn: buku.isbn,
        idAnggota: anggota.id,
        status: "DIPINJAM",
    };

    console.log("[AKSI] Buat catatan peminjaman.");
    console.log("[AKSI] Kurangi stok buku.");
    console.log("[AKSI] Kirim konfirmasi.");
    console.log("[SELESAI] Peminjaman berhasil.\n");
    return { berhasil: true, catatan };
}

prosesPeminjaman(new Buku("978-1", "Clean Code", 1), new Anggota(1, "Rani"));
prosesPeminjaman(new Buku("978-2", "Design Patterns", 1), new Anggota(2, "Budi", 15000));
prosesPeminjaman(new Buku("978-3", "UML Distilled", 1), new Anggota(3, "Sinta", 0, 3));
prosesPeminjaman(new Buku("978-4", "Ensiklopedia Sains", 2, "REFERENSI"), new Anggota(4, "Tono"));
prosesPeminjaman(new Buku("978-5", "Jurnal Ilmiah", 2, "REFERENSI"), new Anggota(5, "Prof. Dewi", 0, 0, "DOSEN"));

// ============================================================
// TUGAS 2: Diagram Activity dengan Guard Condition
// ============================================================
/*
  +-------------------+
  |      MULAI        |
  +-------------------+
           |
           v
  +-------------------+
  | [CEK] Buku        |  ── Guard: [eksemplarTersedia <= 0] ──→ [TOLAK] STOK_HABIS
  | tersedia?         |
  +-------------------+  ── Guard: [eksemplarTersedia > 0]
           |
           v
  +-------------------+
  | [CEK] Buku        |  ── Guard: [jenis != "REFERENSI"]
  | Referensi?        |
  +-------------------+  ── Guard: [jenis == "REFERENSI"]
           |                         |
           |                         v
           |               +-------------------+
           |               | [CEK] Anggota     |  ── Guard: [role != "DOSEN"] ──→ [TOLAK] BUTUH_IZIN_REFERENSI
           |               | punya izin?       |
           |               +-------------------+  ── Guard: [role == "DOSEN"]
           |                         |
           +-----------+-------------+
                       |
                       v
              +-------------------+
              | [CEK] Tunggakan?  |  ── Guard: [tunggakan > 0] ──→ [TOLAK] ADA_TUNGGAKAN
              +-------------------+  ── Guard: [tunggakan <= 0]
                       |
                       v
              +-------------------+
              | [CEK] Peminjaman  |  ── Guard: [peminjamanAktif >= 3] ──→ [TOLAK] BATAS_PINJAM
              | aktif >= 3?       |
              +-------------------+  ── Guard: [peminjamanAktif < 3]
                       |
                       v
              +-------------------+
              |    SELESAI        |
              |    (Berhasil)     |
              +-------------------+
*/

// ============================================================
// TUGAS 3: Perbandingan Baseline Manual vs Draf AI
// ============================================================
/*
  TEMPLATE EVALUASI

  +============================+========================+========================+========================+
  | KRITERIA                   | BASELINE (index.js)    | DRAF AI (modify.js)    | KETERANGAN             |
  +============================+========================+========================+========================+
  | Atribut kelas Buku         | isbn, judul,           | + jenis ("UMUM" /      | Bertambah untuk        |
  |                            | eksemplarTersedia      |   "REFERENSI")         | membedakan jenis buku  |
  +----------------------------+------------------------+------------------------+------------------------+
  | Atribut kelas Anggota      | id, nama, tunggakan,   | + role ("MAHASISWA" /  | Menentukan hak akses   |
  |                            | peminjamanAktif        |   "DOSEN")             | peminjaman referensi   |
  +----------------------------+------------------------+------------------------+------------------------+
  | Jumlah decision node       | 3 node                 | 4 node                 | Bertambah 1 node       |
  | (guard condition)          |                        | (stok, referensi,      | untuk buku referensi   |
  |                            |                        |  tunggakan, batas)     |                        |
  +----------------------------+------------------------+------------------------+------------------------+
  | Total guard condition      | 3 guard                | 5 guard                | Node referensi punya   |
  | (termasuk cabang ya/tidak) |                        |                        | 2 guard + 1 guard      |
  |                            |                        |                        | untuk izin khusus      |
  +----------------------------+------------------------+------------------------+------------------------+
  | Alasan penolakan           | STOK_HABIS,            | + BUTUH_IZIN_          | Jalur baru untuk       |
  |                            | ADA_TUNGGAKAN,         |   REFERENSI            | buku referensi         |
  |                            | BATAS_PINJAM           |                        |                        |
  +----------------------------+------------------------+------------------------+------------------------+
  | Diagram activity           | Tidak ada              | Ada (ASCII diagram     | Guard condition        |
  |                            |                        | di komentar)           | eksplisit pada setiap  |
  |                            |                        |                        | decision node          |
  +----------------------------+------------------------+------------------------+------------------------+
  | Test coverage              | 3 skenario (sukses,    | 5 skenario            + Buku referensi untuk    |
  |                            | tunggakan, batas)      |                        | MAHASISWA (ditolak)    |
  |                            |                        |                        | dan DOSEN (sukses)     |
  +----------------------------+------------------------+------------------------+------------------------+
*/
