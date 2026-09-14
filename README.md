# Belajar C — Tutorial & Cheatsheet

Website statis untuk belajar bahasa C: tutorial konseptual, cheatsheet referensi cepat, dan mini project latihan.

## Struktur

```
.
├── index.html            # shell website (sidebar, TOC, search)
├── assets/
│   ├── style.css
│   └── app.js             # router hash + render markdown (marked.js + highlight.js)
├── content/
│   ├── tutorial.md         # tutorial C: dasar -> pointer, struct, memori, file I/O
│   ├── cheatsheet.md       # referensi cepat sintaks & standard library
│   └── projects.md         # 8 mini project latihan, pemula -> lanjutan
└── .claude/launch.json     # konfigurasi dev server lokal
```

## Menjalankan

File markdown dimuat lewat `fetch`, jadi harus diakses lewat HTTP server lokal (tidak bisa dibuka langsung sebagai `file://`):

```bash
python3 -m http.server 8842
```

Lalu buka `http://localhost:8842`.

## Konten

- **Tutorial** — 22 bab, mencakup struktur program, tipe data, operator, kontrol alur, fungsi, array, string, pointer, struct/union, memori dinamis, file I/O, preprocessor, scope/storage class, rekursi, enum, function pointer, argumen command-line, dan undefined behavior.
- **Cheatsheet** — tabel referensi cepat: format specifier, operator, struktur kontrol, fungsi standard library (`string.h`, `stdlib.h`, `math.h`, `ctype.h`), dan daftar kesalahan umum.
- **Mini Project** — 8 latihan bertingkat (kalkulator, tebak angka, konversi suhu, manajemen nilai mahasiswa, pengolah string, buku alamat, linked list, pencatat keuangan dengan file) untuk mempraktikkan konsep dari tutorial.

## Tech stack

Vanilla HTML/CSS/JS, [marked.js](https://marked.js.org/) untuk parsing markdown, dan [highlight.js](https://highlightjs.org/) untuk syntax highlighting — semua dimuat lewat CDN, tanpa build step.
