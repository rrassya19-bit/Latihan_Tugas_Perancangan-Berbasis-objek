# Refleksi — Class, Object, Atribut, Method & Encapsulation

## Tabel Refleksi — 4 Pendekatan dalam Pengembangan

| Pendekatan                  | Kekuatan                                                                                                         | Risiko/Batasan                                                                 | Contoh penggunaan                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| **Class-based OOP**         | Blueprint jelas; kode terorganisir per entitas; reusability via inheritance; encapsulation jaga konsistensi data | Overhead abstraksi; bisa over-engineering untuk hal sederhana                  | Java, C++, Python, JavaScript (class syntax) |
| **Prototype-based (JS)**    | Fleksibel; object bisa langsung dibuat tanpa class; mudah extend                                                 | Kurang terstruktur untuk skala besar; rawan bug karena tidak ada tipe          | JavaScript murni (sebelum ES6 class)         |
| **Functional programming**  | Pure function → mudah di-test; immutability → minim side effect; komposisi fungsi                                | Sulit untuk stateful logic; learning curve (monad, functor)                    | React (hooks), Redux, Ramda                  |
| **AI-assisted development** | Cepat prototyping; generate boilerplate; bantu debugging & refactoring                                           | Kode belum tentu optimal/aman; developer bisa kehilangan pemahaman fundamental | GitHub Copilot, ChatGPT, TabNine             |

---

## Refleksi: Kapan Class dan Object Tepat Digunakan?

### Karakteristik Proyek yang Cocok untuk Class-based OOP

Class dan object paling tepat digunakan ketika ada **entitas dunia nyata** yang memiliki **data (atribut)** sekaligus **perilaku (method)**. Contohnya buku di perpustakaan: setiap buku punya data (judul, penulis, ISBN, stok) dan bisa melakukan aksi (dipinjam, dikembalikan, dicek ketersediaannya). Membungkus semuanya dalam satu class `Buku` membuat kode lebih terorganisir.

Class juga berguna ketika ada **banyak object sejenis**. Dengan class, kita cukup mendefinisikan blueprint sekali, lalu membuat banyak object dari blueprint yang sama. Setiap object punya data sendiri-sendiri tetapi berbagi method yang sama — efisien dan konsisten.

Sebaliknya, untuk data sederhana tanpa perilaku (misal: konfigurasi, response API), object literal `{ }` atau `Map` sudah cukup. Tidak perlu membuat class untuk sesuatu yang hanya menyimpan data statis.

### Analogi Sederhana

- **Class** = cetakan kue. Satu cetakan bisa menghasilkan banyak kue dengan bentuk yang sama.
- **Object** = kue hasil cetakan. Setiap kue bisa punya topping berbeda (data berbeda), tapi bentuk dasarnya sama.
- **Atribut** = properti kue (warna, rasa, topping).
- **Method** = kue (dipotong, dimakan, dihias).

---

## Dokumentasi Tugas Modifikasi

### Tabel Perbandingan — Sebelum (`index.js`) vs Sesudah (`modify.js`)

| Aspek                      | Sebelum (index.js)                                      | Sesudah (modify.js)                                                     |
| -------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Constructor params**     | `(isbn, judul, penulis, jumlahEksemplar)` — 4 parameter | `(isbn, judul, penulis, **kategori**, jumlahEksemplar)` — 5 parameter   |
| **Atribut kategori**       | Tidak ada                                               | `this.kategori = kategori`                                              |
| **Method `isReferensi()`** | Tidak ada                                               | Ada — mengecek `this.kategori === "Referensi"`                          |
| **Method `info()`**        | Cetak tanpa kategori                                    | Cetak dengan `(kategori)`                                               |
| **Jumlah object**          | 2 variabel terpisah (`buku1`, `buku2`)                  | 2 variabel + **3 object dalam array**                                   |
| **Looping cetak**          | Manual satu per satu                                    | `forEach()` otomatis — semua buku tercetak                              |
| **`eksemplarTersedia`**    | Public — bisa diakses/diubah langsung dari luar         | Sama (public), tapi dijelaskan **kenapa sebaiknya dijaga lewat method** |

---

### Code Diff — Penjelasan Detail Perubahan Kode

Bagian ini menjelaskan **setiap perubahan** dari `index.js` ke `modify.js` baris per baris, serta **mengapa** perubahan itu penting.

---

#### A. Constructor — Penambahan Parameter `kategori`

**Sebelum — `index.js`:**

```js
constructor(isbn, judul, penulis, jumlahEksemplar) {
    this.isbn = isbn;
    this.judul = judul;
    this.penulis = penulis;
    this.jumlahEksemplar = jumlahEksemplar;
    this.eksemplarTersedia = jumlahEksemplar;
}
```

**Sesudah — `modify.js`:**

```js
constructor(isbn, judul, penulis, kategori, jumlahEksemplar) {
    this.isbn = isbn;
    this.judul = judul;
    this.penulis = penulis;
    this.kategori = kategori;                     // BARIS BARU
    this.jumlahEksemplar = jumlahEksemplar;
    this.eksemplarTersedia = jumlahEksemplar;
}
```

**Penjelasan:**

Constructor adalah **method spesial** yang otomatis dijalankan saat kita membuat object baru dengan `new Buku(...)`. Ia bertugas menerima data awal dan menyimpannya ke dalam atribut object.

Perubahan hanya 1 baris: parameter `kategori` ditambahkan di urutan ke-4 (sebelum `jumlahEksemplar`), lalu nilainya disimpan ke `this.kategori`.

**Apa yang terjadi saat `new Buku("978-3", "Pemrograman Java", "John Doe", "Referensi", 3)` dipanggil?**

| Langkah | Kode yang dijalankan              | Hasil                         |
| ------- | --------------------------------- | ----------------------------- |
| 1       | `this.isbn = "978-3"`             | isbn tersimpan                |
| 2       | `this.judul = "Pemrograman Java"` | judul tersimpan               |
| 3       | `this.penulis = "John Doe"`       | penulis tersimpan             |
| 4       | **`this.kategori = "Referensi"`** | **kategori tersimpan — BARU** |
| 5       | `this.jumlahEksemplar = 3`        | jumlah tersimpan              |
| 6       | `this.eksemplarTersedia = 3`      | stok awal = jumlah            |

**Kenapa kategori penting?** Kategori memungkinkan kita membedakan jenis buku (Referensi, Fiksi, Akademik). Di masa depan, aturan seperti "buku Referensi tidak bisa dipinjam" atau "denda Referensi 2x lipat" bisa diimplementasikan dengan mudah karena data kategori sudah tersedia.

---

#### B. Method Baru — `isReferensi()`

**Sebelum — `index.js`:**

```js
// (Tidak ada method isReferensi)
```

**Sesudah — `modify.js`:**

```js
isReferensi() {
    return this.kategori === "Referensi";
}
```

**Penjelasan:**

**Apa itu method?** Method adalah fungsi yang "menempel" pada sebuah object. Bedanya dengan fungsi biasa: method bisa mengakses data object itu sendiri melalui kata kunci `this`.

Bayangkan buku di dunia nyata. Kamu bisa bertanya "Apakah buku ini buku referensi?" dan buku itu bisa menjawab sendiri karena ia tahu kategorinya. Itulah yang dilakukan method `isReferensi()`.

**Cara kerja baris per baris:**

- `this.kategori` → mengambil nilai atribut `kategori` yang sudah disimpan di constructor (misal: `"Referensi"`)
- `=== "Referensi"` → operator perbandingan ketat. Mengecek apakah nilai `this.kategori` **sama persis** (tipe dan nilai) dengan string `"Referensi"`
- `return` → mengembalikan hasil perbandingan: `true` jika sama, `false` jika tidak

**Alur untuk 3 object buku:**

| Object           | `this.kategori` | `this.kategori === "Referensi"` | Return  |
| ---------------- | --------------- | ------------------------------- | ------- |
| Pemrograman Java | `"Referensi"`   | `true`                          | `true`  |
| Algoritma Dasar  | `"Akademik"`    | `false`                         | `false` |
| Cerita Rakyat    | `"Fiksi"`       | `false`                         | `false` |

**Kenapa dibuat method, bukan langsung akses `buku.kategori === "Referensi"` dari luar?**

1. **Abstraction (penyembunyian detail):** Pemanggil method tidak perlu tahu **bagaimana** pengecekan dilakukan. Cukup panggil `buku.isReferensi()` dan dapat hasilnya.

2. **Reusability (pemakaian ulang):** Jika aturan berubah (misal: kategori "Referensi" berubah jadi "R" di database), cukup ubah 1 baris di dalam method, tidak perlu mencari semua tempat di kode yang melakukan pengecekan manual.

3. **Readability (kemudahan baca):** `buku.isReferensi()` lebih jelas maksudnya daripada `buku.kategori === "Referensi"`. Method memberi **nama** pada logika pengecekan.

---

#### C. Method `info()` — Informasi Kategori Ditambahkan

**Sebelum — `index.js`:**

```js
info() {
    return `${this.judul} oleh ${this.penulis} — tersedia ${this.eksemplarTersedia}/${this.jumlahEksemplar}`;
}
```

**Sesudah — `modify.js`:**

```js
info() {
    return `${this.judul} oleh ${this.penulis} (${this.kategori}) — tersedia ${this.eksemplarTersedia}/${this.jumlahEksemplar}`;
}
```

**Perubahan:** String template ditambah `(${this.kategori})` setelah nama penulis.

**Contoh perbedaan output:**

- Sebelum: `Pemrograman Java oleh John Doe — tersedia 3/3`
- Sesudah: `Pemrograman Java oleh John Doe (Referensi) — tersedia 3/3`

Dengan menampilkan kategori, informasi buku jadi lebih lengkap. Pengguna bisa langsung tahu jenis buku hanya dari `info()`.

---

#### D. Tiga Object Buku dalam Array + Looping `forEach()`

**Sebelum — `index.js`:**

```js
const buku1 = new Buku("978-1", "Clean Code", "Robert C. Martin", 2);
const buku2 = new Buku("978-2", "Design Patterns", "GoF", 1);

// Cetak manual satu per satu
console.log(buku1.info());
console.log(buku2.info());
```

**Sesudah — `modify.js`:**

```js
const daftarBuku = [
  new Buku("978-3", "Pemrograman Java", "John Doe", "Referensi", 3),
  new Buku("978-4", "Algoritma Dasar", "Jane Doe", "Akademik", 5),
  new Buku("978-5", "Cerita Rakyat", "Si Kancil", "Fiksi", 4),
];

daftarBuku.forEach((buku, index) => {
  console.log(
    `[${index + 1}] ${buku.info()} | Referensi: ${buku.isReferensi()}`,
  );
});
```

**Penjelasan:**

**Apa itu array?** Array adalah struktur data yang bisa menyimpan **banyak object** dalam satu variabel. Bayangkan array sebagai **rak buku** — kamu bisa meletakkan banyak buku dalam satu rak, bukan buku-buku berserakan di lantai (variabel terpisah).

| Tanpa Array                               | Dengan Array           |
| ----------------------------------------- | ---------------------- |
| `const buku1 = ...`                       | `const daftarBuku = [` |
| `const buku2 = ...`                       | `  new Buku(...),`     |
| `const buku3 = ...`                       | `  new Buku(...),`     |
| (tambah variabel baru setiap tambah buku) | `  new Buku(...)`      |
|                                           | `]`                    |

**Apa itu `forEach()`?** `forEach()` adalah method bawaan array untuk **memproses setiap anggota** array satu per satu secara otomatis. Kita tidak perlu menulis loop manual.

**Cara kerja `forEach()`:**

```js
daftarBuku.forEach((buku, index) => { ... })
```

Parameter `forEach` menerima sebuah **fungsi callback** yang akan dijalankan untuk setiap element array. Callback ini menerima 2 parameter:

- `buku` → berisi satu object Buku dari array (berganti setiap iterasi)
- `index` → nomor urut (mulai dari 0)

**Alur eksekusi lengkap:**

| Iterasi | `buku` (object)                                   | `index` | Output `console.log()`                                                             |
| ------- | ------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| 1       | Buku{isbn:"978-3", judul:"Pemrograman Java", ...} | 0       | `[1] Pemrograman Java oleh John Doe (Referensi) — tersedia 3/3 \| Referensi: true` |
| 2       | Buku{isbn:"978-4", judul:"Algoritma Dasar", ...}  | 1       | `[2] Algoritma Dasar oleh Jane Doe (Akademik) — tersedia 5/5 \| Referensi: false`  |
| 3       | Buku{isbn:"978-5", judul:"Cerita Rakyat", ...}    | 2       | `[3] Cerita Rakyat oleh Si Kancil (Fiksi) — tersedia 4/4 \| Referensi: false`      |

**Detail string template untuk iterasi ke-1:**

```
`[${index + 1}] ${buku.info()} | Referensi: ${buku.isReferensi()}`
```

- `${index + 1}` → `0 + 1` = `1`
- `${buku.info()}` → panggil method `info()` → `"Pemrograman Java oleh John Doe (Referensi) — tersedia 3/3"`
- `${buku.isReferensi()}` → panggil method `isReferensi()` → `true`

Hasil: `[1] Pemrograman Java oleh John Doe (Referensi) — tersedia 3/3 | Referensi: true`

---

#### E. Encapsulation — Kenapa `eksemplarTersedia` Sebaiknya Dijaga Lewat Method?

Di kode saat ini (`index.js` dan `modify.js`), atribut `eksemplarTersedia` masih **public** — bisa diakses dan diubah langsung dari luar class. Ini **kurang aman**.

**Contoh masalah — akses langsung dari luar:**

```js
const buku = new Buku("978-3", "Pemrograman Java", "John Doe", "Referensi", 3);

// Masalah 1: Stok jadi negatif — tidak masuk akal!
buku.eksemplarTersedia = -5;
console.log(buku.eksemplarTersedia); // -5 ❌

// Masalah 2: Stok melebihi jumlah eksemplar!
buku.eksemplarTersedia += 100;
console.log(buku.eksemplarTersedia); // 100 (padahal jumlahEksemplar cuma 3) ❌
```

Kedua kode di atas **valid secara JavaScript** — tidak ada error. Tapi secara **logika bisnis** salah total. Buku tidak mungkin punya stok -5 atau stok 100 padahal hanya punya 3 eksemplar.

**Perbandingan: Akses Langsung vs Lewat Method**

| Skenario                       | Akses Langsung ke Atribut                          | Lewat Method (`pinjam()` / `kembalikan()`)                                                   |
| ------------------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Stok jadi negatif              | ✅ Bisa ditulis `= -5` — **data tidak konsisten**  | ❌ Dicegah — method `pinjam()` punya `if (this.eksemplarTersedia <= 0) throw new Error(...)` |
| Stok melebihi jumlah           | ✅ Bisa ditulis `+= 100` — **tidak realistis**     | ❌ Dicegah — method `kembalikan()` cek `if (this.eksemplarTersedia < this.jumlahEksemplar)`  |
| Perubahan aturan di masa depan | ❌ Harus ubah semua tempat yang mengakses langsung | ✅ Cukup ubah di dalam method, pemanggil tidak perlu tahu                                    |

**Apa yang terjadi di dalam `pinjam()`?**

```js
pinjam() {
    if (this.eksemplarTersedia <= 0) {
        throw new Error(`Buku "${this.judul}" sedang tidak tersedia.`);
    }
    this.eksemplarTersedia -= 1;
    return true;
}
```

**Alur eksekusi `pinjam()`:**

| Langkah | Kode                                           | Penjelasan                                             |
| ------- | ---------------------------------------------- | ------------------------------------------------------ |
| 1       | `if (this.eksemplarTersedia <= 0)`             | Cek: apakah stok sudah habis?                          |
| 2       | Jika habis → `throw new Error(...)`            | Hentikan proses, beri tahu pemanggil bahwa stok kosong |
| 3       | Jika masih ada → `this.eksemplarTersedia -= 1` | Kurangi stok sebanyak 1                                |
| 4       | `return true`                                  | Beri tahu pemanggil bahwa peminjaman berhasil          |

**Apa yang terjadi di dalam `kembalikan()`?**

```js
kembalikan() {
    if (this.eksemplarTersedia < this.jumlahEksemplar) {
        this.eksemplarTersedia += 1;
    }
}
```

| Langkah | Kode                                                 | Penjelasan                                                   |
| ------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| 1       | `if (this.eksemplarTersedia < this.jumlahEksemplar)` | Cek: apakah stok saat ini masih kurang dari jumlah maksimal? |
| 2       | Jika iya → `this.eksemplarTersedia += 1`             | Tambah stok 1 (aman, tidak akan melebihi jumlahEksemplar)    |
| 3       | Jika tidak → (tidak melakukan apa-apa)               | Stok sudah penuh, tidak perlu ditambah                       |

**Kesimpulan:** Method `pinjam()` dan `kembalikan()` bertindak sebagai **pintu resmi** untuk mengubah `eksemplarTersedia`. Mereka memastikan data tetap konsisten — tidak negatif, tidak melebihi batas. Di masa depan, jika atribut diubah menjadi private (`#eksemplarTersedia`), akses langsung dari luar akan **dicegah oleh JavaScript** (error), dan semua perubahan hanya bisa lewat method.

---

### Output Terminal — Sebelum vs Sesudah

**Output `index.js` (sebelum — tanpa kategori):**

```
--- Data awal ---
Clean Code oleh Robert C. Martin — tersedia 2/2
Design Patterns oleh GoF — tersedia 1/1

--- Simulasi peminjaman ---
Clean Code oleh Robert C. Martin — tersedia 1/2
Design Patterns oleh GoF — tersedia 0/1
Gagal meminjam: Buku "Design Patterns" sedang tidak tersedia.
```

Hanya 2 buku, tidak ada informasi kategori, dicetak manual.

**Output `modify.js` (sesudah — dengan kategori + array + forEach):**

```
--- Data awal ---
Clean Code oleh Robert C. Martin (Teknik) — tersedia 2/2
Design Patterns oleh GoF (Komputer) — tersedia 1/1

--- Simulasi peminjaman ---
Clean Code oleh Robert C. Martin (Teknik) — tersedia 1/2
Design Patterns oleh GoF (Komputer) — tersedia 0/1
Gagal meminjam: Buku "Design Patterns" sedang tidak tersedia.

=== TUGAS LATIHAN ===

--- Cetak info() semua buku dengan forEach ---
[1] Pemrograman Java oleh John Doe (Referensi) — tersedia 3/3 | Referensi: true
[2] Algoritma Dasar oleh Jane Doe (Akademik) — tersedia 5/5 | Referensi: false
[3] Cerita Rakyat oleh Si Kancil (Fiksi) — tersedia 4/4 | Referensi: false
```

**3 perbedaan utama:**

1. Setiap info buku sekarang menampilkan **kategori** dalam kurung — `(Teknik)`, `(Referensi)`, dll.
2. Ada **3 buku baru** dalam array yang dicetak otomatis dengan `forEach()` — tanpa perlu menulis `console.log()` satu per satu.
3. Setiap baris menampilkan **status referensi** — `Referensi: true` atau `Referensi: false`.

---

### Perbandingan: Tanpa Array vs Dengan Array

| Aspek                | Tanpa Array (`index.js`)               | Dengan Array (`modify.js`)                    |
| -------------------- | -------------------------------------- | --------------------------------------------- |
| **Deklarasi**        | Variabel terpisah: `buku1`, `buku2`    | Satu array: `daftarBuku = [...]`              |
| **Cetak**            | Manual: `console.log(buku1.info())`    | Otomatis: `daftarBuku.forEach(...)`           |
| **Tambah buku baru** | Buat variabel baru + tambah kode cetak | Tinggal tambah `new Buku(...)` ke dalam array |
| **Skalabilitas**     | Ribet kalau 100 buku                   | Tetap mudah — tinggal tambah isi array        |

---

## Saran Refactoring AI + Evaluasi

**Saran dari AI:** Ubah `isReferensi()` dari **method biasa** menjadi **getter** agar lebih natural.

**Kode sebelum (method biasa):**

```js
isReferensi() {
    return this.kategori === "Referensi";
}
// Dipanggil: buku.isReferensi()
```

**Kode sesudah (getter):**

```js
get isReferensi() {
    return this.kategori === "Referensi";
}
// Dipanggil: buku.isReferensi   (tanpa tanda kurung)
```

**Apa itu getter?** Getter adalah method spesial yang membuat method **terlihat seperti atribut biasa**. Kita panggil tanpa tanda kurung `()` — seperti mengakses properti, bukan memanggil fungsi.

**Evaluasi:**

| Aspek                        | Penilaian                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Fungsional**               | ✅ Hasil tetap sama — mengembalikan `true`/`false`                                                                                       |
| **Semantik (makna)**         | ✅ Getter lebih natural karena `isReferensi` adalah **status** (apakah buku ini referensi?), bukan **aksi** (tidak ada yang "dilakukan") |
| **Side effect**              | ✅ Tidak ada — method hanya membaca data (`this.kategori`), tidak mengubah apapun                                                        |
| **Perubahan kode pemanggil** | ⚠️ Semua pemanggil harus dihapus tanda kurungnya: `buku.isReferensi()` → `buku.isReferensi`                                              |
| **Kemudahan maintenance**    | ✅ Jika implementasi berubah (misal: cek dari database), pemanggil tetap sama — `buku.isReferensi`                                       |
| **Kesimpulan**               | ✅ **Layak diterima** — getter membuat kode lebih ekspresif, sesuai prinsip JavaScript modern                                            |

---

## Tindakan yang Tidak Boleh Langsung Diberikan ke AI Tanpa Review Manusia

| Tindakan                                                                        | Risiko                                                           |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Generate kode produksi tanpa review keamanan                                    | Rentan SQL injection, XSS, hardcoded credentials                 |
| Mengubah konfigurasi infrastruktur (Docker, cloud, database)                    | Bisa expose port, hapus resource, biaya membengkak               |
| Menulis aturan bisnis yang kompleks                                             | AI tidak paham konteks bisnis sepenuhnya — bisa salah logika     |
| Mengelola data pengguna (password, PII)                                         | Melanggar privasi & compliance (GDPR, UU PDP)                    |
| Debugging tanpa verifikasi                                                      | AI bisa salah diagnosa dan menyarankan solusi yang keliru        |
| Generate license atau legal notice                                              | Tidak valid secara hukum                                         |
| Menghapus atau memodifikasi file tanpa backup                                   | Data hilang permanen                                             |
| Menulis kode yang mengakses sistem internal (file system, environment variable) | Potensi kebocoran informasi sensitif                             |
| Memberi akses AI ke production API tanpa rate limit                             | Bisa menyebabkan denial of service atau biaya API tak terkendali |
| Menggenerate kode yang melibatkan hak cipta tanpa cek lisensi                   | Risiko tuntutan hukum (copyleft violation)                       |

**Prinsip umum:** AI adalah asisten, bukan decision maker. Semua kode yang memengaruhi keamanan, data pengguna, infrastruktur, dan aturan bisnis harus ditinjau manusia sebelum dijalankan.

---

## Refleksi Akhir

Dari tugas minggu ini, saya mempelajari bahwa **class** adalah cetakan (blueprint) untuk membuat object. **Constructor** adalah method spesial yang menginisialisasi data setiap object baru. **Atribut** menyimpan data, dan **method** mendefinisikan perilaku object.

Penambahan atribut `kategori` dan method `isReferensi()` mengajarkan bahwa method bisa digunakan untuk **membungkus logika pengecekan** — sehingga kode lebih rapi, mudah dibaca, dan mudah diubah di kemudian hari.

Penggunaan **array + `forEach()`** menunjukkan bagaimana OOP bekerja sama dengan struktur data untuk mengelola **banyak object** secara efisien. Tanpa array, setiap buku harus dicetak manual satu per satu — tidak scalable.

Konsep **encapsulation** mulai terlihat pentingnya: method `pinjam()` dan `kembalikan()` menjaga `eksemplarTersedia` tetap konsisten. Meskipun di kode ini atributnya masih public (bisa diakses langsung), kita sudah melihat **mengapa** sebaiknya data dijaga lewat method. Di minggu-minggu berikutnya, atribut akan dibuat **private** (`#`) sehingga akses langsung dari luar benar-benar dicegah.

Kombinasi pemahaman OOP yang kuat + AI sebagai asisten adalah pendekatan terbaik: developer tetap harus mengerti konsep class, object, atribut, method, dan encapsulation untuk bisa menilai dan memperbaiki output AI.
