// Nama  : [Ahmad Rassya Maulana]
// NIM   : [20250140157]

// ============ ANALISIS KEBUTUHAN TAMBAHAN ============

// Kebutuhan Fungsional (+5):
//   6. Anggota dapat memperpanjang masa peminjaman (maks. 1x)
//      Alasan: mengurangi keluhan anggota yang telat karena lupa,
//      sekaligus tetap membatasi 1x biar buku tidak "dikuasai" terlalu lama.
//
//   7. Anggota dapat melihat riwayat peminjaman pribadi
//      Alasan: anggota butuh transparansi buku apa saja yang pernah/sedang
//      dipinjam, tanpa harus tanya langsung ke pustakawan.
//
//   8. Pustakawan dapat mengelola denda keterlambatan
//      Alasan: proses hitung & catat denda saat ini manual, rawan salah
//      hitung dan tidak ada bukti tercatat kalau sudah lunas atau belum.
//
//   9. Pustakawan dapat melihat laporan peminjaman bulanan
//      Alasan: dibutuhkan untuk evaluasi, misalnya buku apa yang paling
//      sering dipinjam, untuk bahan pengadaan buku berikutnya.
//
//  10. Sistem mengirim notifikasi pengingat pengembalian H-1
//      Alasan: langkah preventif — mengurangi jumlah keterlambatan
//      dan otomatis mengurangi beban kerja pustakawan menagih manual.

// Kebutuhan Non-Fungsional (+2):
//   3. Password anggota & pustakawan dienkripsi sebelum disimpan
//      Alasan: keamanan data pengguna adalah syarat wajib sistem yang
//      menyimpan data login, mencegah kebocoran password asli jika data dicuri.
//
//   4. Sistem mampu menangani minimal 500 peminjaman aktif
//      Alasan: menyesuaikan skala pengguna (jumlah anggota & buku)
//      supaya sistem tidak lambat/error saat dipakai ramai-ramai.

// User Story Tambahan (+3):
//   - Anggota ingin perpanjang peminjaman agar tidak terkena denda
//   - Pustakawan ingin kelola denda agar anggota lebih disiplin
//   - Anggota ingin notifikasi pengingat agar tidak lupa jatuh tempo

// ============ CATATAN STRUKTUR TAMBAHAN & ALASANNYA ============

// - Anggota & Pustakawan sama-sama butuh id, nama, dan login (password).
//   Daripada duplikat kode, keduanya diturunkan dari superclass Pengguna.
//   Alasan: menghindari duplikasi atribut/kode (prinsip DRY) dan
//   memudahkan kalau nanti ada aturan login yang berlaku untuk keduanya.
//
// - Perpanjangan TIDAK dibuat class baru, cukup jadi atribut tambahan
//   di dalam Peminjaman (jumlahPerpanjangan, tanggalJatuhTempo).
//   Alasan: perpanjangan bukan "hal" yang berdiri sendiri, melainkan
//   perubahan status dari peminjaman yang sudah ada — jadi cukup atribut,
//   bukan entitas/tabel terpisah.
//
// - Laporan bulanan TIDAK dibuat class baru, cukup jadi method di
//   Pustakawan yang mengolah data Peminjaman yang sudah ada.
//   Alasan: laporan sifatnya hasil olahan/kesimpulan dari data yang
//   sudah tersimpan, bukan data baru yang perlu disimpan permanen.
//
// - Entitas baru yang benar-benar dibutuhkan: Kategori, Denda, Notifikasi.
//   Alasan tiap entitas:
//     * Kategori   -> agar pencarian & pengelompokan buku lebih terstruktur,
//                     tidak sekadar teks bebas yang rawan typo/beda-beda.
//     * Denda      -> perlu dicatat sebagai data tersendiri karena punya
//                     siklus hidup sendiri (dikenakan -> lunas/belum lunas).
//     * Notifikasi -> perlu dicatat sebagai data tersendiri agar sistem
//                     tahu pesan apa yang sudah/belum dikirim & dibaca.

// ============ SUPERCLASS ============

class Pengguna {
    constructor(id, nama, password) {
        this.id = id;
        this.nama = nama;
        this.password = password; // asumsi sudah dienkripsi (NFR #3)
    }

    login(passwordInput) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }
}

// ============ ENTITAS UTAMA ============

class Kategori {
    constructor(id, namaKategori) {
        this.id = id;
        this.namaKategori = namaKategori;
    }
}

class Buku {
    constructor(isbn, judul, penulis, jumlahEksemplar, kategori) {
        this.isbn = isbn;
        this.judul = judul;
        this.penulis = penulis;
        this.jumlahEksemplar = jumlahEksemplar;
        this.kategori = kategori; // relasi ke Kategori
    }
}

class Anggota extends Pengguna {
    constructor(id, nama, password, email) {
        super(id, nama, password);
        this.email = email;
    }

    cariBuku(kataKunci) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }

    // FR #6: perpanjang masa peminjaman (maks. 1x)
    perpanjangPeminjaman(peminjaman) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }

    // FR #7: lihat riwayat peminjaman pribadi
    lihatRiwayatPeminjaman() {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }
}

class Pustakawan extends Pengguna {
    constructor(id, nama, password) {
        super(id, nama, password);
    }

    tambahBuku(dataBuku) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }

    // FR #8: kelola denda keterlambatan
    kelolaDenda(denda) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }

    // FR #9: laporan peminjaman bulanan (hasil olahan data Peminjaman)
    buatLaporanBulanan(bulan, tahun) {
        throw new Error("Belum diimplementasikan — lihat Minggu 4");
    }
}

class Peminjaman {
    constructor(buku, anggota, tanggalPinjam) {
        this.buku = buku;
        this.anggota = anggota;
        this.tanggalPinjam = tanggalPinjam;
        this.status = "PENGAJUAN";
        this.jumlahPerpanjangan = 0;   // FR #6: dibatasi maksimal 1
        this.tanggalJatuhTempo = null;
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
console.log("- Pengguna (super), Anggota, Pustakawan, Kategori, Buku, Peminjaman, Denda, Notifikasi");

console.log("\nCoba jalankan salah satu method yang belum diimplementasikan:");
try {
    const anggota = new Anggota(1, "Rani", "hashed_password_123", "rani@kampus.ac.id");
    anggota.cariBuku("Clean Code");
} catch (err) {
    console.log(`-> ${err.message}`);
}