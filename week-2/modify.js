// Minggu 2 — Konsep Class, Object, Atribut, dan Method
// Studi kasus: SIPUSTAKA — mendefinisikan entitas Buku

class Buku {
  constructor(isbn, judul, penulis, kategori, jumlahEksemplar) {
    this.isbn = isbn;
    this.judul = judul;
    this.penulis = penulis;
    this.kategori = kategori;                     // Atribut kategori
    this.jumlahEksemplar = jumlahEksemplar;
    this.eksemplarTersedia = jumlahEksemplar;
  }

  // Method: mengecek apakah buku berkategori Referensi
  isReferensi() {
    return this.kategori === "Referensi";
  }

  // Method: meminjam buku
  pinjam() {
    if (this.eksemplarTersedia <= 0) {
      throw new Error(`Buku "${this.judul}" sedang tidak tersedia.`);
    }
    this.eksemplarTersedia -= 1;
    return true;
  }

  // Method: mengembalikan buku
  kembalikan() {
    if (this.eksemplarTersedia < this.jumlahEksemplar) {
      this.eksemplarTersedia += 1;
    }
  }

  // Method: menampilkan info buku
  info() {
    return `${this.judul} oleh ${this.penulis} (${this.kategori}) — tersedia ${this.eksemplarTersedia}/${this.jumlahEksemplar}`;
  }
}

// --- Membuat beberapa OBJECT dari CLASS Buku ---
const buku1 = new Buku("978-1", "Clean Code", "Robert C. Martin", "Teknik", 2);
const buku2 = new Buku("978-2", "Design Patterns", "GoF", "Komputer", 1);

console.log("--- Data awal ---");
console.log(buku1.info());
console.log(buku2.info());

console.log("\n--- Simulasi peminjaman ---");
buku1.pinjam();
console.log(buku1.info());
buku2.pinjam();
console.log(buku2.info());

try {
  buku2.pinjam(); // eksemplar habis -> harus gagal
} catch (err) {
  console.log(`Gagal meminjam: ${err.message}`);
}

// --- Tugas: 3 object Buku baru dalam array + perulangan ---
console.log("\n=== TUGAS LATIHAN ===");

const daftarBuku = [
  new Buku("978-3", "Pemrograman Java", "John Doe", "Referensi", 3),
  new Buku("978-4", "Algoritma Dasar", "Jane Doe", "Akademik", 5),
  new Buku("978-5", "Cerita Rakyat", "Si Kancil", "Fiksi", 4),
];

console.log("\n--- Cetak info() semua buku dengan forEach ---");
daftarBuku.forEach((buku, index) => {
  console.log(`[${index + 1}] ${buku.info()} | Referensi: ${buku.isReferensi()}`);
});
