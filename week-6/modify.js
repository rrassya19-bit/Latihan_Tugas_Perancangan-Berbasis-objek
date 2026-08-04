// ============================================================
// Minggu 6 — Class Diagram: Agregasi, Asosiasi, dan Pustakawan
// Nama : [Ahmad Rassya Maulana]
// NIM  : [20250140157]
//
// FILE INI = JAWABAN TUGAS 1 (KODE DRAF AI)
// ------------------------------------------
// Baseline  : index.js (tidak diubah) — pembanding.
// Diagram   : diagram/class_diagram.mmd & diagram/class_diagram.puml.
// Prompt AI : prompt.md (jawaban Prompt Engineering).
// Evaluasi  : evaluasi.md (Kerangka Evaluasi Kritis).
// ============================================================

// ============================================================
// DRAF AI — KODE MODIFIKASI
// 1. Tambah class Pustakawan (id, nip, nama).
// 2. Perpustakaan mengelola Pustakawan (asosiasi 1..* "mengelola").
// 3. Peminjaman mencatat pustakawan yang memproses (diprosesOleh).
// ============================================================

class Buku {
  constructor(isbn, judul, kategori, jumlahEksemplar) {
    this.isbn = isbn;
    this.judul = judul;
    this.kategori = kategori;
    this.jumlahEksemplar = jumlahEksemplar;
    this.eksemplarTersedia = jumlahEksemplar;
  }
}

class Anggota {
  constructor(id, nama, email) {
    this.id = id;
    this.nama = nama;
    this.email = email;
  }
}

class Pustakawan {
  constructor(id, nip, nama) {
    this.id = id;
    this.nip = nip;
    this.nama = nama;
  }
}

class Peminjaman {
  constructor(id, buku, anggota, tanggalPinjam, diprosesOleh) {
    this.id = id;
    this.buku = buku;       // asosiasi -> Buku
    this.anggota = anggota; // asosiasi -> Anggota
    this.diprosesOleh = diprosesOleh; // asosiasi -> Pustakawan (tambahan draf AI)
    this.tanggalPinjam = tanggalPinjam;
    this.status = "DIPINJAM";
  }
}

class Perpustakaan {
  #buku = [];
  #anggota = [];
  #peminjaman = [];
  #pustakawan = [];
  #nomorPeminjaman = 1;

  tambahBuku(buku) {
    this.#buku.push(buku);
  }

  tambahAnggota(anggota) {
    this.#anggota.push(anggota);
  }

  tambahPustakawan(pustakawan) {
    this.#pustakawan.push(pustakawan);
  }

  daftarPustakawan() {
    return this.#pustakawan;
  }

  pinjamkan(isbn, idAnggota, idPustakawan, tanggal) {
    const buku = this.#buku.find((b) => b.isbn === isbn);
    const anggota = this.#anggota.find((a) => a.id === idAnggota);
    const pustakawan = this.#pustakawan.find((p) => p.id === idPustakawan);
    if (!buku || !anggota) throw new Error("Buku/anggota tidak ditemukan.");
    if (!pustakawan) throw new Error("Pustakawan tidak ditemukan.");
    if (buku.eksemplarTersedia <= 0) throw new Error("Stok habis.");

    buku.eksemplarTersedia -= 1;
    const peminjaman = new Peminjaman(
      this.#nomorPeminjaman++,
      buku,
      anggota,
      tanggal,
      pustakawan
    );
    this.#peminjaman.push(peminjaman);
    return peminjaman;
  }

  daftarPeminjamanAktif() {
    return this.#peminjaman.filter((p) => p.status === "DIPINJAM");
  }
}

// --- Simulasi draf AI ---
console.log("=== SIMULASI DRAF AI (modify.js) ===\n");

const perpus = new Perpustakaan();
perpus.tambahBuku(new Buku("978-1", "Clean Code", "Teknologi", 2));
perpus.tambahBuku(new Buku("978-2", "Design Patterns", "Teknologi", 3));
perpus.tambahAnggota(new Anggota(1, "Rani", "rani@kampus.ac.id"));
perpus.tambahPustakawan(new Pustakawan(1, "NPK-001", "Pak Budi"));
perpus.tambahPustakawan(new Pustakawan(2, "NPK-002", "Bu Sari"));

const p1 = perpus.pinjamkan("978-1", 1, 1, new Date("2026-02-01"));
console.log(
  `Peminjaman #${p1.id}: "${p1.buku.judul}" oleh ${p1.anggota.nama}, ` +
    `diproses ${p1.diprosesOleh.nama}, status: ${p1.status}`
);

console.log("\nPeminjaman aktif:");
for (const p of perpus.daftarPeminjamanAktif()) {
  console.log(`  #${p.id} — ${p.buku.judul} (${p.anggota.nama})`);
}

console.log("\nPustakawan yang dikelola Perpustakaan (1..*):");
for (const p of perpus.daftarPustakawan()) {
  console.log(`  ${p.id}. ${p.nama} (NIP: ${p.nip})`);
}

console.log("\n--- Lihat prompt.md, evaluasi.md, dan diagram/ untuk jawaban lengkap ---");