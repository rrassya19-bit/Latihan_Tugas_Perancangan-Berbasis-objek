// Minggu 1 — Pengenalan Perancangan Berorientasi Objek
// Studi kasus: SIPUSTAKA (Sistem Perpustakaan Digital)
// Tujuan: membandingkan pendekatan PROSEDURAL vs BERORIENTASI OBJEK
// untuk kasus yang sama: menghitung denda keterlambatan pengembalian buku.

console.log("=== BAGIAN A: Pendekatan PROSEDURAL ===\n");

// --- Pendekatan Prosedural ---
// Data dan logika dipisah. Fungsi mengembalikan plain object.
function buatPeminjamanProsedural(judulBuku, kategori, tanggalPinjam, tanggalKembali) {
  return { judulBuku, kategori, tanggalPinjam, tanggalKembali };
}

// Fungsi menghitung denda — caller harus ingat memanggil fungsi ini.
function hitungDendaProsedural(peminjaman, tarifPerHari = 500) {
  const batasHari = 7;                                              // Batas maksimal hari peminjaman
  const selisihHari = Math.floor(
    (peminjaman.tanggalKembali - peminjaman.tanggalPinjam) / (1000 * 60 * 60 * 24)
  );

  const telat = Math.max(0, selisihHari - batasHari);                // Hitung jumlah hari telat

  // Aturan: jika kategori "Referensi", tarif denda dikali 2
  const tarifAktual = peminjaman.kategori === "Referensi" ? tarifPerHari * 2 : tarifPerHari;
  return telat * tarifAktual;                                       // Total denda
}

// Test case prosedural — kategori Referensi (denda x2)
const pinjam1 = buatPeminjamanProsedural(
  "Clean Code", "Referensi",
  new Date("2026-01-01"),
  new Date("2026-01-12")
);
console.log(`Denda (prosedural, Referensi): Rp${hitungDendaProsedural(pinjam1)}`);

// Test case prosedural — kategori Fiksi (tarif normal)
const pinjam1b = buatPeminjamanProsedural(
  "Clean Code", "Fiksi",
  new Date("2026-01-01"),
  new Date("2026-01-12")
);
console.log(`Denda (prosedural, Fiksi):     Rp${hitungDendaProsedural(pinjam1b)}`);
console.log(
  "Masalah: data & logika terpisah — siapa pun bisa lupa memanggil fungsi yang\n" +
  "benar, dan tidak ada yang menjaga konsistensi aturan bisnisnya.\n"
);

console.log("=== BAGIAN B: Pendekatan BERORIENTASI OBJEK ===\n");

// --- Pendekatan OOP ---
// Data (atribut) dan perilaku (method) dibungkus dalam satu class.
class PeminjamanBuku {
  // Private field — tidak bisa diakses dari luar class
  #tarifPerHariTelat = 500;       // Tarif denda per hari (Rp)
  #batasHariPeminjaman = 7;       // Batas maksimal hari peminjaman
  #kategori;                       // Kategori buku: "Referensi" atau lainnya

  constructor(judulBuku, kategori, tanggalPinjam, tanggalKembali) {
    this.judulBuku = judulBuku;
    this.#kategori = kategori;     // Simpan kategori sebagai private
    this.tanggalPinjam = tanggalPinjam;
    this.tanggalKembali = tanggalKembali;
  }

  // Private method — hanya dipakai di dalam class
  #hitungSelisihHari() {
    return Math.floor(
      (this.tanggalKembali - this.tanggalPinjam) / (1000 * 60 * 60 * 24)
    );
  }

  // Private method — menentukan tarif berdasarkan kategori
  #dapatkanTarif() {
    // Aturan: jika kategori "Referensi", tarif denda dikali 2
    return this.#kategori === "Referensi" ? this.#tarifPerHariTelat * 2 : this.#tarifPerHariTelat;
  }

  // Public method — satu-satunya cara menghitung denda dari luar
  hitungDenda() {
    const telat = Math.max(0, this.#hitungSelisihHari() - this.#batasHariPeminjaman);
    return telat * this.#dapatkanTarif();   // Gunakan tarif yang sudah disesuaikan
  }
}

// Test case OOP — kategori Referensi (denda x2)
const pinjam2 = new PeminjamanBuku(
  "Clean Code", "Referensi",
  new Date("2026-01-01"),
  new Date("2026-01-12")
);
console.log(`Denda (OOP, Referensi): Rp${pinjam2.hitungDenda()}`);

// Test case OOP — kategori Fiksi (tarif normal)
const pinjam2b = new PeminjamanBuku(
  "Clean Code", "Fiksi",
  new Date("2026-01-01"),
  new Date("2026-01-12")
);
console.log(`Denda (OOP, Fiksi):     Rp${pinjam2b.hitungDenda()}`);
console.log(
  "Keuntungan: logika denda 'menempel' pada objeknya sendiri (encapsulation);\n" +
  "tarif, batas hari, dan aturan kategori jadi private (#) sehingga tidak bisa\n" +
  "diubah sembarangan dari luar object.\n"
);

console.log("=== PERBANDINGAN ===\n");

console.log(
  "Prosedural:\n" +
  "  - Setiap fungsi yang menghitung denda harus 'ingat' mengecek kategori.\n" +
  "  - Jika ada 50 tempat panggil hitungDendaProsedural(), semua harus diubah\n" +
  "    saat aturan berubah. Rentan lupa dan inkonsisten.\n"
);

console.log(
  "OOP:\n" +
  "  - Aturan bisnis terpusat di method #dapatkanTarif() di dalam class.\n" +
  "  - Perubahan cukup di satu method, semua objek otomatis mengikuti.\n" +
  "  - Encapsulation menjaga konsistensi dan memudahkan maintenance.\n"
);
