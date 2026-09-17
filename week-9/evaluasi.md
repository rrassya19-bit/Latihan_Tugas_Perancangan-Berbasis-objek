# Evaluasi Kritis & Laporan — Minggu 9 (Communication Diagram & Event-Driven)

**Mata Kuliah:** Perancangan Berbasis Objek  
**Materi:** Minggu 9 — Communication Diagram, Event-Driven Architecture, Correlation ID & Coupling Analysis  
**Nama:** Ahmad Rassya Maulana  
**NIM:** 20250140157  
**Baseline Kode:** [`week-9/index.js`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/index.js)  
**Kode Modifikasi:** [`week-9/modify.js`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/modify.js)  

---

## 1. Traceability Tugas ke Kode

| Tugas / Requirement | Berkas / Method | Status Traceability |
|:---|:---|:---:|
| **Tugas 1**: Menambahkan Correlation ID pada alur transaksi | [`week-9/modify.js`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/modify.js)<br/>• `ajukanPeminjaman(anggota, isbn, correlationId)`<br/>• `prosesPermintaan(isbn, correlationId)`<br/>• Payload Event `stokBerkurang`, `stokHabis`, `peminjamanSukses`, `peminjamanGagal` | **100% Traceable** |
| **Tugas 2**: Analisis perbandingan Coupling & Debugging | [`week-9/modify.js`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/modify.js)<br/>• Output tabel konsol & komentar analisis terstruktur | **100% Traceable** |
| **Communication Diagram**: UML Specification | [`week-9/diagram/communication_diagram.mmd`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/diagram/communication_diagram.mmd)<br/>[`week-9/diagram/communication_diagram.puml`](file:///D:/SEMESTER_ANTARA/Perancangan_Berbasis_Objek/Latihan_Pengerjaan/week-9/diagram/communication_diagram.puml) | **100% Traceable** |

---

## 2. Rincian Penjelasan Materi & Hasil Evaluasi

### A. Implikasi Correlation ID terhadap Transaction Tracing
Dengan menambahkan `correlationId` pada setiap argumen method dan payload event:
- Setiap log transaksi dapat dikelompokkan berdasarkan ID uniknya (`[TXN-1001]`, `[TXN-1002]`).
- Dalam lingkungan terdistribusi (*microservices*), `correlationId` memungkinkan pengumpulan log lintas layanan (*Distributed Tracing*) menggunakan *tooling* seperti Jaeger atau Zipkin.

### B. Matriks Evaluasi Direct Call vs Event-Driven

```text
┌──────────────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ Kriteria         │ Direct Call                                  │ Event-Driven Architecture                    │
├──────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ 1. Coupling      │ Tight Coupling                               │ Loose Coupling (Decoupled)                   │
│ 2. Debugging     │ Mudah (Synchronous Call Stack)               │ Membutuhkan Correlation ID & Central Log     │
│ 3. Skalabilitas  │ Terbatas (Penambahan fitur mengubah caller)  │ Tinggi (Tinggal menambah listener baru)      │
│ 4. Eksekusi      │ Direct / Blocking                            │ Event Bus / Non-blocking Pub-Sub             │
└──────────────────┴──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 3. Cara Pengujian Kode

```bash
node week-9/modify.js
```
