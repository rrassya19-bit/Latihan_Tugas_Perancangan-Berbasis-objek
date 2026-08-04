// ============================================================
// Modifikasi Sistem Perpustakaan
// 1. Use Case: Lihat Riwayat Peminjaman
// 2. Pembedaan use case publik vs validasi internal
// 3. Pengujian: ID anggota, ISBN, stok, batas perpanjangan
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
  constructor(id, nama) {
    this.id = id;
    this.nama = nama;
    this.tunggakan = 0;
  }
}

class Peminjaman {
  constructor(id, buku, anggota, tanggalPinjam) {
    this.id = id;
    this.buku = buku;
    this.anggota = anggota;
    this.tanggalPinjam = tanggalPinjam;
    this.tanggalJatuhTempo = new Date(tanggalPinjam);
    this.tanggalJatuhTempo.setDate(this.tanggalJatuhTempo.getDate() + 7);
    this.jumlahPerpanjangan = 0;
    this.status = "DIPINJAM";
  }
}

class SistemPerpustakaan {
  #bukuList = [];
  #anggotaList = [];
  #peminjamanList = [];
  #nomorPeminjaman = 1;

  // ===== USE CASE (Publik) =====

  daftarAnggota(id, nama) {
    if (this.#anggotaList.some((anggota) => anggota.id === id)) {
      throw new Error("ID anggota sudah terdaftar.");
    }
    const anggota = new Anggota(id, nama);
    this.#anggotaList.push(anggota);
    return anggota;
  }

  tambahBuku(isbn, judul, kategori, jumlahEksemplar) {
    if (this.#bukuList.some((buku) => buku.isbn === isbn)) {
      throw new Error("ISBN sudah terdaftar.");
    }
    const buku = new Buku(isbn, judul, kategori, jumlahEksemplar);
    this.#bukuList.push(buku);
    return buku;
  }

  cariBuku(kataKunci) {
    const kata = kataKunci.trim().toLowerCase();
    return this.#bukuList.filter((buku) =>
      `${buku.judul} ${buku.kategori}`.toLowerCase().includes(kata)
    );
  }

  ajukanPeminjaman(isbn, idAnggota, tanggalPinjam = new Date()) {
    const { buku, anggota } = this.#validasiPeminjaman(isbn, idAnggota);
    buku.eksemplarTersedia -= 1;
    const peminjaman = new Peminjaman(
      this.#nomorPeminjaman++,
      buku,
      anggota,
      tanggalPinjam
    );
    this.#peminjamanList.push(peminjaman);
    return peminjaman;
  }

  perpanjangPeminjaman(idPeminjaman) {
    const peminjaman = this.#peminjamanList.find(
      (item) => item.id === idPeminjaman
    );
    if (!peminjaman) throw new Error("Peminjaman tidak ditemukan.");
    if (peminjaman.status !== "DIPINJAM")
      throw new Error("Peminjaman tidak aktif.");
    if (peminjaman.jumlahPerpanjangan >= 1)
      throw new Error("Batas perpanjangan tercapai.");

    peminjaman.tanggalJatuhTempo.setDate(
      peminjaman.tanggalJatuhTempo.getDate() + 7
    );
    peminjaman.jumlahPerpanjangan += 1;
    return peminjaman;
  }

  kembalikanBuku(idPeminjaman) {
    const peminjaman = this.#peminjamanList.find(
      (item) => item.id === idPeminjaman
    );
    if (!peminjaman) throw new Error("Peminjaman tidak ditemukan.");
    if (peminjaman.status !== "DIPINJAM")
      throw new Error("Peminjaman sudah ditutup.");

    peminjaman.buku.eksemplarTersedia += 1;
    peminjaman.status = "DIKEMBALIKAN";
    return peminjaman;
  }

  lihatRiwayatPeminjaman(idAnggota) {
    if (idAnggota === undefined) {
      return [...this.#peminjamanList];
    }
    const anggota = this.#anggotaList.find((a) => a.id === idAnggota);
    if (!anggota) throw new Error("Anggota tidak ditemukan.");
    return this.#peminjamanList.filter((p) => p.anggota.id === idAnggota);
  }

  // ===== VALIDASI (Internal/Private) =====

  #validasiPeminjaman(isbn, idAnggota) {
    const buku = this.#bukuList.find((item) => item.isbn === isbn);
    const anggota = this.#anggotaList.find((item) => item.id === idAnggota);
    if (!buku) throw new Error("Buku tidak ditemukan.");
    if (!anggota) throw new Error("Anggota tidak ditemukan.");
    if (buku.eksemplarTersedia <= 0) throw new Error("Stok buku habis.");
    if (anggota.tunggakan > 0) throw new Error("Anggota memiliki tunggakan.");
    return { buku, anggota };
  }
}

// ============================================================
// Pengujian
// ============================================================

function test() {
  let total = 0;
  let sukses = 0;

  function assert(got, expected, label) {
    total++;
    const ok = got === expected;
    if (ok) sukses++;
    console.log(
      `${ok ? "✓" : "✗"} ${label} — ${ok ? `OK (${expected})` : `got: ${got}, expected: ${expected}`}`
    );
  }

  function assertError(fn, label) {
    total++;
    try {
      fn();
      console.log(`✗ ${label} — tidak throw error`);
    } catch (e) {
      sukses++;
      console.log(`✓ ${label} — ${e.message}`);
    }
  }

  console.log("\n=== PENGUJIAN ===");

  // Setup
  const sistem = new SistemPerpustakaan();
  sistem.tambahBuku("978-1", "Clean Code", "Teknologi", 2);
  sistem.tambahBuku("978-2", "Design Patterns", "Teknologi", 0);
  sistem.daftarAnggota(10, "Rani");
  sistem.daftarAnggota(20, "Budi");

  // --- ID Anggota ---
  console.log("\n--- ID Anggota ---");
  assertError(
    () => sistem.daftarAnggota(10, "Rani Lagi"),
    "Daftar anggota dengan ID duplikat (10)"
  );
  assertError(
    () => sistem.ajukanPeminjaman("978-1", 99),
    "Pinjam dengan ID anggota tidak terdaftar (99)"
  );

  // --- ISBN ---
  console.log("\n--- ISBN ---");
  assertError(
    () => sistem.tambahBuku("978-1", "Clean Code v2", "Teknologi", 1),
    "Tambah buku dengan ISBN duplikat (978-1)"
  );
  assertError(
    () => sistem.ajukanPeminjaman("978-999", 10),
    "Pinjam dengan ISBN tidak dikenal (978-999)"
  );

  // --- Stok ---
  console.log("\n--- Stok ---");
  assertError(
    () => sistem.ajukanPeminjaman("978-2", 10),
    "Pinjam buku stok 0"
  );
  const bukuStok1 = new Buku("978-3", "Stok Test", "Test", 1);
  sistem.tambahBuku("978-3", "Stok Test", "Test", 1);
  const pStok = sistem.ajukanPeminjaman("978-3", 10, new Date("2026-09-01"));
  assert(pStok.buku.eksemplarTersedia, 0, "Stok habis setelah 1 peminjaman");
  assertError(
    () => sistem.ajukanPeminjaman("978-3", 20, new Date("2026-09-01")),
    "Pinjam buku stok 0 setelah semua eksemplar dipinjam"
  );
  sistem.kembalikanBuku(pStok.id);
  assert(pStok.buku.eksemplarTersedia, 1, "Stok kembali setelah dikembalikan");

  // --- Batas Perpanjangan ---
  console.log("\n--- Batas Perpanjangan ---");
  const pPerpanjang = sistem.ajukanPeminjaman("978-1", 10, new Date("2026-09-01"));
  const diperpanjang = sistem.perpanjangPeminjaman(pPerpanjang.id);
  assert(diperpanjang.jumlahPerpanjangan, 1, "Jumlah perpanjangan setelah 1x");
  assertError(
    () => sistem.perpanjangPeminjaman(pPerpanjang.id),
    "Perpanjang 2x pada peminjaman yang sama"
  );

  // --- Riwayat Peminjaman ---
  console.log("\n--- Riwayat Peminjaman ---");
  const riwayatRani = sistem.lihatRiwayatPeminjaman(10);
  assert(riwayatRani.length, 2, "Jumlah riwayat Rani (pStok & pPerpanjang)");
  const semuaRiwayat = sistem.lihatRiwayatPeminjaman();
  assert(semuaRiwayat.length, 2, "Jumlah seluruh riwayat");

  console.log(`\n${sukses}/${total} pengujian berhasil.`);
}

test();
