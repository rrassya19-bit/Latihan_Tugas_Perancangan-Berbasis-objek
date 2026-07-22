// Nama  : [Ahmad Rassya Maulana]
// NIM   : [20250140157]

// ============ ANALISIS KEBUTUHAN TAMBAHAN ============

// Kebutuhan Fungsional (+5):
//   6. Anggota dapat memperpanjang masa peminjaman (maks. 1x)
//   7. Anggota dapat melihat riwayat peminjaman pribadi
//   8. Pustakawan dapat mengelola denda keterlambatan
//   9. Pustakawan dapat melihat laporan peminjaman bulanan
//  10. Sistem mengirim notifikasi pengingat pengembalian H-1
//
// Kebutuhan Non-Fungsional (+2):
//   3. Password anggota & pustakawan dienkripsi sebelum disimpan
//   4. Sistem mampu menangani minimal 500 peminjaman aktif
//
// User Story Tambahan (+3):
//   - Anggota ingin perpanjang peminjaman agar tidak terkena denda
//   - Pustakawan ingin kelola denda agar anggota lebih disiplin
//   - Anggota ingin notifikasi pengingat agar tidak lupa jatuh tempo

// ============ SKELETON CLASS ============

class Buku {
    constructor(isbn, judul, penulis, jumlahEksemplar) {
        this.isbn = isbn;
        this.judul = judul;
        this.penulis = penulis;
        this.jumlahEksemplar = jumlahEksemplar;
    }
}

class Anggota {
    constructor(id, nama, email) {
        this.id = id;
        this.nama = nama;
        this.email = email;
    }
    cariBuku(kataKunci) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }
}

class Peminjaman {
    constructor(buku, anggota, tanggalPinjam) {
        this.buku = buku;
        this.anggota = anggota;
        this.tanggalPinjam = tanggalPinjam;
        this.status = "PENGAJUAN";
    }
}

class Pustakawan {
    constructor(id, nama) {
        this.id = id;
        this.nama = nama;
    }
    tambahBuku(dataBuku) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }
}

// ============ ENTITAS BARU ============

// Dari kebutuhan di atas, dibutuhkan 2 entitas baru:
//   - Denda      : mencatat denda keterlambatan per peminjaman
//   - Notifikasi : mengirim pengingat ke anggota

class Denda {
    constructor(id, peminjaman, jumlah, tanggalDikenakan) {
        this.id = id;
        this.peminjaman = peminjaman;
        this.jumlah = jumlah;
        this.statusLunas = false;
        this.tanggalDikenakan = tanggalDikenakan;
    }
}

class Notifikasi {
    constructor(id, anggota, pesan, tanggalKirim) {
        this.id = id;
        this.anggota = anggota;
        this.pesan = pesan;
        this.tanggalKirim = tanggalKirim;
        this.statusBaca = false;
    }
}

// ============ VERIFIKASI ============

console.log("Skeleton class hasil analisis kebutuhan berhasil dimuat:");
console.log("- Buku, Anggota, Peminjaman, Pustakawan, Denda, Notifikasi");
console.log("\nCoba jalankan salah satu method yang belum diimplementasikan:");
try {
    const anggota = new Anggota(1, "Rani", "rani@kampus.ac.id");
    anggota.cariBuku("Clean Code");
} catch (err) {
    console.log(`-> ${err.message}`);
}
