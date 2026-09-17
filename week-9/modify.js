// Minggu 9 — Communication Diagram: Correlation ID & Analisis Event-Driven vs Direct Call
// Nama : [Ahmad Rassya Maulana]
// NIM  : [20250140157]
//
// FILE INI = JAWABAN TUGAS MINGGU 9 (modify.js)
// ------------------------------------------
// Tugas 1: Tambahkan Correlation ID agar pesan satu transaksi dapat ditelusuri (Tracing).
// Tugas 2: Bandingkan Direct Call dan Event-Driven dari sisi Coupling dan Debugging.
// ============================================================

import { EventEmitter } from "node:events";

// ============================================================
// 1. IMPLEMENTASI TUGAS 1: CORRELATION ID
// ============================================================

class Katalog extends EventEmitter {
  #buku = new Map();

  tambah(buku) {
    this.#buku.set(buku.isbn, buku);
  }

  prosesPermintaan(isbn, correlationId) {
    const buku = this.#buku.get(isbn);
    if (buku && buku.eksemplarTersedia > 0) {
      buku.eksemplarTersedia -= 1;
      this.emit("stokBerkurang", { isbn, sisaStok: buku.eksemplarTersedia, correlationId });
    } else {
      this.emit("stokHabis", { isbn, correlationId });
    }
  }
}

class SistemPerpustakaan extends EventEmitter {
  #katalog = new Katalog();

  constructor() {
    super();
    this.#katalog.on("stokBerkurang", ({ isbn, sisaStok, correlationId }) => {
      console.log(`[${correlationId}] 1.2: Katalog --> SistemPerpustakaan: stokBerkurang(${isbn}, sisa: ${sisaStok})`);
      this.emit("peminjamanSukses", { isbn, correlationId });
    });

    this.#katalog.on("stokHabis", ({ isbn, correlationId }) => {
      console.log(`[${correlationId}] 1.2: Katalog --> SistemPerpustakaan: stokHabis(${isbn})`);
      this.emit("peminjamanGagal", { isbn, correlationId });
    });
  }

  get katalog() {
    return this.#katalog;
  }

  ajukanPeminjaman(anggota, isbn, correlationId = `TXN-${Math.floor(1000 + Math.random() * 9000)}`) {
    console.log(`\n--- Memulai Transaksi: [${correlationId}] ---`);
    console.log(`[${correlationId}] 1: Anggota(${anggota.nama}) --> SistemPerpustakaan: ajukanPeminjaman(${isbn})`);
    console.log(`[${correlationId}] 1.1: SistemPerpustakaan --> Katalog: prosesPermintaan(${isbn})`);
    this.#katalog.prosesPermintaan(isbn, correlationId);
  }
}

class LayananNotifikasi {
  constructor(sistem) {
    sistem.on("peminjamanSukses", ({ isbn, correlationId }) => {
      console.log(`[${correlationId}] 1.3: SistemPerpustakaan --> LayananNotifikasi: peminjamanSukses(${isbn})`);
      console.log(`[${correlationId}] 1.5: LayananNotifikasi --> Anggota: Konfirmasi berhasil dikirim`);
    });

    sistem.on("peminjamanGagal", ({ isbn, correlationId }) => {
      console.log(`[${correlationId}] 1.3: SistemPerpustakaan --> LayananNotifikasi: peminjamanGagal(${isbn})`);
      console.log(`[${correlationId}] 1.5: LayananNotifikasi --> Anggota: Konfirmasi gagal dikirim (Stok Habis)`);
    });
  }
}

class LogAudit {
  #riwayat = [];

  constructor(sistem) {
    sistem.on("peminjamanSukses", ({ isbn, correlationId }) => {
      const catatan = `[${correlationId}] Peminjaman ISBN ${isbn} BERHASIL pada ${new Date().toISOString()}`;
      this.#riwayat.push(catatan);
      console.log(`[${correlationId}] 1.4: SistemPerpustakaan --> LogAudit: catatPeminjamanSukses()`);
    });

    sistem.on("peminjamanGagal", ({ isbn, correlationId }) => {
      const catatan = `[${correlationId}] Peminjaman ISBN ${isbn} GAGAL (Stok Habis) pada ${new Date().toISOString()}`;
      this.#riwayat.push(catatan);
      console.log(`[${correlationId}] 1.4: SistemPerpustakaan --> LogAudit: catatPeminjamanGagal()`);
    });
  }

  semua() {
    return [...this.#riwayat];
  }
}

// --- DEMO SIMULASI TUGAS 1 ---
console.log("============================================================");
console.log("DEMO SIMULASI TUGAS 1: CORRELATION ID & TRACING PESAN");
console.log("============================================================");

const sistem = new SistemPerpustakaan();
new LayananNotifikasi(sistem);
const audit = new LogAudit(sistem);

sistem.katalog.tambah({ isbn: "978-1", judul: "Clean Code", eksemplarTersedia: 1 });

// Transaksi 1: Rani meminjam buku (Berhasil)
sistem.ajukanPeminjaman({ nama: "Rani" }, "978-1", "TXN-1001");

// Transaksi 2: Budi meminjam buku yang sama (Gagal - Stok Habis)
sistem.ajukanPeminjaman({ nama: "Budi" }, "978-1", "TXN-1002");

console.log("\n--- REKAP LOG AUDIT TRANSACTION TRACING ---");
audit.semua().forEach((log) => console.log(log));


// ============================================================
// 2. IMPLEMENTASI TUGAS 2: ANALISIS PERBANDINGAN
//    DIRECT CALL vs EVENT-DRIVEN
// ============================================================

console.log("\n============================================================");
console.log("ANALISIS TUGAS 2: PERBANDINGAN DIRECT CALL VS EVENT-DRIVEN");
console.log("============================================================");

const analisisPerbandingan = `
┌──────────────────┬──────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────┐
│ Kriteria         │ Direct Call (Metode Konvensional / Pemanggilan Langsung) │ Event-Driven Architecture (EventEmitter / Pub-Sub)    │
├──────────────────┼──────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ 1. Coupling      │ TIGHT COUPLING (Keterikatan Tinggi)                      │ LOOSE COUPLING (Keterikatan Rendah/Decoupled)         │
│                  │ - Pengirim harus memegang referensi eksplisit            │ - Publisher tidak perlu tahu siapa atau berapa        │
│                  │   objek penerima.                                        │   banyak listener yang mendengarkan event.            │
│                  │ - Menambah komponen baru (misal: LogAudit)               │ - Menambah komponen baru cukup mendaftarkan           │
│                  │   menuntut perubahan kode pada pengirim.                 │   listener (.on) tanpa mengubah publisher.            │
├──────────────────┼──────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────┤
│ 2. Debugging     │ LEBIH MUDAH (Synchronous Call Stack)                     │ LEBIH KOMPLEKS (Membutuhkan Correlation ID)           │
│                  │ - Stack trace runtut secara linier dari awal             │ - Call stack terputus pada perantara event            │
│                  │   hingga akhir eksekusi (mudah di-step-over).            │   emitter (terutama jika asinkron/distributed)        │
│                  │ - Mudah melacak kesalahan secara lokal.                  │ - Membutuhkan Correlation ID / Distributed            │
│                  │                                                          │   Tracing untuk merangkai alur transaksi.             │
└──────────────────┴──────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────┘
`;

console.log(analisisPerbandingan);

/*
================================================================================
PENJELASAN RINGKAS:
1. Mengapa Correlation ID Penting pada Event-Driven Architecture?
   Dalam arsitektur Event-Driven, beberapa event dari berbagai transaksi dapat
   berjalan secara bersamaan (konkuren). Tanpa Correlation ID, log dari transaksi
   TXN-1001 dan TXN-1002 akan bercampur aduk sehingga sulit diidentifikasi mana
   notifikasi atau audit yang milik transaksi Rani atau Budi.

2. Kapan Harus Menggunakan Direct Call vs Event-Driven?
   - Gunakan Direct Call ketika alur bersifat sangat terikat, butuh kepastian
     return value secara instan, dan prosesnya sederhana.
   - Gunakan Event-Driven ketika ingin membangun sistem modular/microservices,
     memungkinkan ekstensi fitur (misal: SMS, Email, Audit) tanpa mengubah
     inti logika bisnis (Open/Closed Principle).
================================================================================
*/
