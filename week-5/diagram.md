# Activity Diagram — Proses Peminjaman Buku

## Diagram Alur

```mermaid
flowchart TD
    classDef startEnd fill:#1B5E20,color:#FFF,stroke:#1B5E20,stroke-width:3px,font-weight:bold;
    classDef process fill:#E3F2FD,stroke:#1565C0,stroke-width:2px,font-weight:bold,color:#0D47A1;
    classDef decision fill:#FFF3E0,stroke:#E65100,stroke-width:2px,font-weight:bold,color:#BF360C;
    classDef reject fill:#FFEBEE,stroke:#C62828,stroke-width:2px,font-weight:bold,color:#B71C1C;
    classDef success fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px,font-weight:bold,color:#1B5E20;

    S([MULAI]):::startEnd
    P1[Anggota mengajukan peminjaman]:::process
    D1{Buku tersedia?}:::decision
    D2{Jenis Referensi?}:::decision
    D3{Punya izin?}:::decision
    D4{Ada tunggakan?}:::decision
    D5{Pinjam >= 3?}:::decision
    R1[TOLAK: Stok habis]:::reject
    R2[TOLAK: Butuh izin referensi]:::reject
    R3[TOLAK: Ada tunggakan]:::reject
    R4[TOLAK: Batas pinjam]:::reject
    P2[Kurangi stok buku]:::process
    P3[Buat catatan peminjaman]:::process
    P4[Kirim konfirmasi]:::process
    E([SELESAI: Berhasil]):::success
    X([SELESAI]):::startEnd

    S --> P1 --> D1
    D1 -->|"[eksemplarTersedia > 0]"| D2
    D1 -->|"[eksemplarTersedia <= 0]"| R1 --> X
    D2 -->|"[jenis == REFERENSI]"| D3
    D2 -->|"[jenis != REFERENSI]"| D4
    D3 -->|"[role == DOSEN]"| D4
    D3 -->|"[role != DOSEN]"| R2 --> X
    D4 -->|"[tunggakan <= 0]"| D5
    D4 -->|"[tunggakan > 0]"| R3 --> X
    D5 -->|"[peminjamanAktif < 3]"| P2
    D5 -->|"[peminjamanAktif >= 3]"| R4 --> X
    P2 --> P3 --> P4 --> E
```

---

## Daftar Guard Condition

| No | Decision Node | Guard Condition (Ya) | Guard Condition (Tidak) | Aksi jika Tidak |
|:--:|--------------|--------------------:|-----------------------:|:--------------:|
| 1 | Buku tersedia? | `[eksemplarTersedia > 0]` | `[eksemplarTersedia <= 0]` | TOLAK: Stok habis |
| 2 | Jenis Referensi? | `[jenis == REFERENSI]` | `[jenis != REFERENSI]` | Lanjut ke cek tunggakan |
| 3 | Punya izin? | `[role == DOSEN]` | `[role != DOSEN]` | TOLAK: Butuh izin referensi |
| 4 | Ada tunggakan? | `[tunggakan <= 0]` | `[tunggakan > 0]` | TOLAK: Ada tunggakan |
| 5 | Pinjam >= 3? | `[peminjamanAktif < 3]` | `[peminjamanAktif >= 3]` | TOLAK: Batas pinjam |

---

## Keterangan Warna Diagram

| Warna | Makna |
|-------|-------|
| <span style="color:#1565C0;">■</span> Biru | Proses / aksi |
| <span style="color:#E65100;">■</span> Oranye | Decision node (percabangan) |
| <span style="color:#C62828;">■</span> Merah | Penolakan / gagal |
| <span style="color:#1B5E20;">■</span> Hijau | Mulai / Selesai (sukses) |
