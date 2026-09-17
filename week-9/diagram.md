# Communication Diagram — Sistem Peminjaman Perpustakaan (Minggu 9)

**Mata Kuliah:** Perancangan Berbasis Objek  
**Materi:** Minggu 9 — Communication Diagram (UML Interaction Diagram)  
**Baseline Kode:** [`index.js`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/index.js)

---

## 1. Konsep Utama Communication Diagram

**Communication Diagram** (sebelumnya disebut *Collaboration Diagram* pada UML 1.x) adalah jenis diagram interaksi UML yang menekankan **struktur organisasi objek** yang saling bertukar pesan.

Berbeda dengan *Sequence Diagram* yang berfokus pada garis waktu vertikal, Communication Diagram menampilkan:
1. **Objek & Hubungan (Link):** Jaringan objek bertipe *Boundary*, *Control*, dan *Entity* (arsitektur BCE).
2. **Penomoran Pesan Hirarkis (Sequence Numbering):** Menunjukkan urutan eksekusi pesan (contoh: `1`, `1.1`, `1.2`).
3. **Arah Pesan:** Ditandai dengan panah penunjuk arah pada garis asosiasi/link.

---

## 2. Diagram Mermaid (Graph LR)

```mermaid
graph LR
    %% Styling berdasarkan arsitektur BCE (Boundary, Control, Entity)
    classDef boundary fill:#E1F5FE,stroke:#0288D1,stroke-width:2px,color:#01579B;
    classDef control fill:#FFF9C4,stroke:#FBC02D,stroke-width:2px,color:#F57F17;
    classDef entity fill:#E8F5E9,stroke:#388E3C,stroke-width:2px,color:#1B5E20;
    classDef noteStyle fill:#FFFFFF,stroke:#B0BEC5,stroke-width:1px,stroke-dasharray: 5 5,color:#37474F;

    %% Objek / Lifeline dengan Stereotype
    A["«boundary»<br/><u>a : Anggota</u>"]:::boundary
    S["«control»<br/><u>s : SistemPerpustakaan</u>"]:::control
    K["«entity»<br/><u>k : Katalog</u>"]:::entity
    N["«boundary»<br/><u>n : LayananNotifikasi</u>"]:::boundary
    D["«entity»<br/><u>db : LogAudit</u>"]:::entity

    %% Pesan Komunikasi & Sequence Numbering
    A -- "1: ajukanPeminjaman(anggota, isbn)" --> S
    
    subgraph Pengecekan_Stok ["Proses Pengecekan Stok"]
        S -- "1.1: prosesPermintaan(isbn)" --> K
        K -.->|"1.2: stokBerkurang(isbn, sisaStok) [stok > 0]<br/>1.2b: stokHabis(isbn) [stok == 0]"| S
    end

    subgraph Event_Handling ["Penanganan Event / Broadcast"]
        S -- "1.3: peminjamanSukses(isbn) / 1.3b: peminjamanGagal(isbn)" --> N
        S -- "1.4: catatPeminjaman(isbn) / 1.4b: catatPeminjamanGagal(isbn)" --> D
    end

    N -.->|"1.5: konfirmasiBerhasil() / 1.5b: konfirmasiGagal()"| A

    %% Catatan Penjelasan Diagram
    NoteUML["<b>Keterangan Communication Diagram:</b><br/>1. Panah solid (-->) = Call Method / Direct Message<br/>2. Panah putus-putus (-.->) = Event Return / Broadcast Listener<br/>3. Nomor hirarkis (1, 1.1, 1.2) = Urutan eksekusi pesan"]:::noteStyle
    S -.-> NoteUML
```

---

## 3. Diagram PlantUML Code

File PlantUML tersimpan di [`diagram/communication_diagram.puml`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/diagram/communication_diagram.puml):

```plantuml
@startuml Communication Diagram - Sistem Peminjaman Perpustakaan
title Communication Diagram — Sistem Peminjaman Perpustakaan (Minggu 9)

skinparam style strictuml
skinparam handwritten false
skinparam ObjectBackgroundColor white
skinparam ObjectBorderColor black

object "<u>a : Anggota</u>\n«boundary»" as a #E1F5FE
object "<u>s : SistemPerpustakaan</u>\n«control»" as s #FFF9C4
object "<u>k : Katalog</u>\n«entity»" as k #E8F5E9
object "<u>n : LayananNotifikasi</u>\n«boundary»" as n #E1F5FE
object "<u>db : LogAudit</u>\n«entity»" as db #E8F5E9

a -- s : 1: ajukanPeminjaman(anggota, isbn) >
s -- k : 1.1: prosesPermintaan(isbn) >\n< 1.2: stokBerkurang(isbn, sisaStok) [sukses]\n< 1.2b: stokHabis(isbn) [gagal]
s -- n : 1.3: peminjamanSukses(isbn) >\n1.3b: peminjamanGagal(isbn) >
s -- db : 1.4: catatPeminjaman(isbn) >\n1.4b: catatPeminjamanGagal(isbn) >
n -- a : 1.5: konfirmasiBerhasil() >\n1.5b: konfirmasiGagal() >

@enduml
```

---

## 4. Tabel Rincian Pesan & Traceability Kode

| No Pesan | Pengirim | Penerima | Nama Pesan / Method | Tipe Komunikasi | Sumber Kode di `index.js` |
|:--------:|:---------|:---------|:---------------------|:---------------|:-------------------------|
| **1** | `a : Anggota` | `s : SistemPerpustakaan` | `ajukanPeminjaman(anggota, isbn)` | Direct Call | `sistem.ajukanPeminjaman({ nama: "Rani" }, "978-1")` |
| **1.1** | `s : SistemPerpustakaan` | `k : Katalog` | `prosesPermintaan(isbn)` | Direct Call | `this.#katalog.prosesPermintaan(isbn)` |
| **1.2** | `k : Katalog` | `s : SistemPerpustakaan` | `emit("stokBerkurang", ...)` *(Sukses)* | Event Response | `this.emit("stokBerkurang", { isbn, sisaStok })` |
| **1.2b** | `k : Katalog` | `s : SistemPerpustakaan` | `emit("stokHabis", ...)` *(Gagal)* | Event Response | `this.emit("stokHabis", { isbn })` |
| **1.3** | `s : SistemPerpustakaan` | `n : LayananNotifikasi` | `emit("peminjamanSukses", ...)` | Event Broadcast | `sistem.on("peminjamanSukses", ...)` |
| **1.3b** | `s : SistemPerpustakaan` | `n : LayananNotifikasi` | `emit("peminjamanGagal", ...)` | Event Broadcast | `sistem.on("peminjamanGagal", ...)` |
| **1.4** | `s : SistemPerpustakaan` | `db : LogAudit` | `catatPeminjaman(isbn)` | Event Listener | `this.#riwayat.push(...)` |
| **1.5** | `n : LayananNotifikasi` | `a : Anggota` | `konfirmasiBerhasil()` | UI Notification | `console.log("1.5: LayananNotifikasi --> Anggota: konfirmasi berhasil")` |

---

## 5. Komparasi: Communication Diagram vs Sequence Diagram

| Aspek | Communication Diagram | Sequence Diagram |
|:---|:---|:---|
| **Fokus Utama** | Organisasi struktural & relasi antar objek. | Urutan waktu (chronological order) dari atas ke bawah. |
| **Penggunaan Ruang** | Lebih hemat tempat (berbentuk grafik net/web). | Membutuhkan area vertikal yang panjang. |
| **Penomoran Pesan** | **Wajib** memakai penomoran hirarkis (`1`, `1.1`, `1.2`). | Implisit berdasarkan garis waktu vertikal. |
| **Penggunaan Ideal** | Menggambarkan arsitektur komponen & event-driven decoupling. | Menggambarkan alur eksekusi detail per milidetik. |
