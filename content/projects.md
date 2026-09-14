# Mini Project Latihan C

Kumpulan latihan project untuk mempraktikkan konsep dari [Tutorial C](tutorial.html), diurutkan dari mudah ke sulit. Kerjakan berurutan — tiap project sengaja dirancang memakai konsep dari project sebelumnya.

Cara pakai: baca **Tujuan** dan **Requirement**, coba kerjakan sendiri dulu sebelum melihat **Hint**. Semua project bisa dikerjakan hanya dengan C standar (`gcc`), tanpa library eksternal.

---

## Level Pemula

### Project 1 — Kalkulator Sederhana

**Konsep:** input/output, operator, percabangan.

**Tujuan:** program menerima dua angka dan satu operator (`+ - * /`) dari user, lalu menampilkan hasilnya.

**Requirement:**

- Baca dua `double` dan satu `char` operator lewat `scanf`.
- Gunakan `switch` atau `if-else` untuk memilih operasi.
- Tangani pembagian dengan 0 — tampilkan pesan error, jangan biarkan program crash.

**Hint:** cek `operator` dengan `switch (op) { case '+': ... }`. Untuk pembagian nol: `if (b == 0) { printf("Error\n"); }` sebelum melakukan `a / b`.

**Tantangan bonus:** ubah jadi loop supaya user bisa hitung berkali-kali sampai memasukkan `q` untuk keluar.

---

### Project 2 — Tebak Angka

**Konsep:** perulangan, percabangan, `rand()`.

**Tujuan:** komputer memilih angka acak 1–100, user menebak sampai benar, program memberi petunjuk "lebih besar"/"lebih kecil".

**Requirement:**

- Gunakan `srand(time(NULL))` sekali di awal `main` supaya angka acak berbeda tiap run, lalu `rand() % 100 + 1`.
- Gunakan `while` untuk mengulang sampai tebakan benar.
- Hitung dan tampilkan jumlah percobaan di akhir.

**Hint:** header yang dibutuhkan `<stdlib.h>` dan `<time.h>`.

**Tantangan bonus:** batasi maksimal 7 percobaan, kalah jika habis.

---

### Project 3 — Konversi Suhu & Kalkulator Kalimat

**Konsep:** fungsi, tipe data, `float`/`double`.

**Tujuan:** buat beberapa fungsi konversi suhu (`celciusKeFahrenheit`, `celciusKeKelvin`, dst) dan sebuah menu yang memanggilnya.

**Requirement:**

- Minimal 3 fungsi konversi, masing-masing menerima `double` dan mengembalikan `double`.
- Tampilkan menu pilihan dengan `switch`, panggil fungsi sesuai pilihan user.
- Program berjalan dalam loop sampai user memilih keluar.

**Hint:** deklarasikan prototype semua fungsi di atas `main`, definisikan implementasinya di bawah.

---

## Level Menengah

### Project 4 — Manajemen Nilai Mahasiswa (Array)

**Konsep:** array, fungsi dengan parameter array, statistik dasar.

**Tujuan:** program menyimpan nilai N mahasiswa dalam array, lalu menghitung rata-rata, nilai tertinggi, nilai terendah, dan jumlah mahasiswa yang lulus (nilai >= 60).

**Requirement:**

- Minta user memasukkan jumlah mahasiswa (maks 50), lalu input tiap nilai ke dalam array.
- Buat fungsi terpisah untuk masing-masing statistik (`hitungRataRata(int arr[], int n)`, dst) — **jangan** hitung semuanya langsung di `main`.
- Tampilkan hasil akhir dalam format rapi.

**Hint:** ingat array yang dikirim ke fungsi butuh parameter panjang terpisah karena informasi panjang array hilang saat "meluruh" jadi pointer.

**Tantangan bonus:** urutkan nilai dari terbesar ke terkecil (bubble sort sederhana) sebelum ditampilkan.

---

### Project 5 — Pengolah Kata (String)

**Konsep:** string, `<string.h>`, `<ctype.h>`.

**Tujuan:** program menerima satu kalimat dari user (pakai `fgets`, bukan `scanf`, supaya bisa ada spasi), lalu:

1. Menghitung jumlah kata.
2. Menghitung jumlah huruf vokal.
3. Membalik urutan kalimat (kata terakhir jadi pertama).
4. Mengubah semua huruf menjadi kapital.

**Requirement:**

- Gunakan `fgets` untuk membaca input, lalu hapus karakter `\n` di akhir jika ada.
- Manfaatkan `isalpha`, `tolower`/`toupper` dari `<ctype.h>`.
- Jangan gunakan `strtok` dulu jika belum dipelajari — coba iterasi manual karakter demi karakter dulu untuk latihan memahami string sebagai array.

**Hint:** kata baru dimulai setelah spasi (atau di awal string) — hitung transisi dari spasi ke non-spasi untuk menghitung jumlah kata.

---

### Project 6 — Buku Alamat dengan Struct

**Konsep:** struct, array of struct, `strcpy`.

**Tujuan:** program menyimpan daftar kontak (nama, nomor telepon, email) sebagai array of struct, dengan menu: tambah, tampilkan semua, cari berdasarkan nama, hapus.

**Requirement:**

```c
typedef struct {
    char nama[50];
    char telepon[20];
    char email[50];
} Kontak;
```

- Gunakan array `Kontak daftar[100]` dan variabel penghitung jumlah kontak aktif.
- Fungsi `cari` mengembalikan index kontak (atau -1 jika tidak ditemukan) menggunakan `strcmp`.
- Fungsi `hapus` bisa menggeser elemen setelahnya ke kiri, atau menandai slot sebagai kosong — pilih salah satu dan pahami trade-off-nya.

**Hint:** karena field `char[]` tidak bisa di-assign langsung dengan `=`, gunakan `strcpy(daftar[i].nama, "Budi")`.

---

## Level Lanjutan

### Project 7 — Linked List Sederhana

**Konsep:** pointer, struct self-referential, `malloc`/`free`.

**Tujuan:** implementasikan singly linked list untuk menyimpan angka, dengan operasi: tambah di akhir, tampilkan semua, hapus berdasarkan nilai, hitung jumlah node, bebaskan seluruh list di akhir program.

**Requirement:**

```c
typedef struct Node {
    int data;
    struct Node *next;
} Node;
```

- Fungsi `tambah(Node **head, int nilai)` — perhatikan kenapa butuh `Node **` (pointer ke pointer): supaya fungsi bisa mengubah `head` itu sendiri jika list awalnya kosong.
- Fungsi `hapusList(Node **head)` yang mengunjungi tiap node, `free` satu per satu, baru set `*head = NULL`.
- **Jalankan dengan `valgrind` (atau `-fsanitize=address`) untuk memastikan tidak ada memory leak** — ini project pertama di mana leak benar-benar mudah terjadi tanpa disadari.

**Hint:** pola umum menambah di akhir list: telusuri dari `head` sampai node dengan `next == NULL`, baru sambungkan node baru ke situ. Kasus khusus: list masih kosong (`*head == NULL`).

---

### Project 8 — Pencatat Keuangan dengan File

**Konsep:** file I/O, struct, alokasi dinamis, gabungan semua konsep sebelumnya.

**Tujuan:** aplikasi command-line pencatat transaksi (pemasukan/pengeluaran) yang datanya **tersimpan permanen** di file teks, bisa dibuka lagi setelah program ditutup.

**Requirement:**

- Struct `Transaksi` berisi: deskripsi, jumlah (boleh negatif untuk pengeluaran), tanggal (string sederhana `"YYYY-MM-DD"`).
- Saat program dibuka: baca semua transaksi dari `transaksi.txt` (jika ada) ke dalam array/linked list di memori.
- Menu: tambah transaksi, tampilkan semua, tampilkan saldo total, simpan & keluar.
- Saat "simpan & keluar" dipilih: tulis ulang seluruh data ke `transaksi.txt` dengan format yang bisa dibaca ulang oleh program yang sama (mis. satu baris per transaksi, dipisah `;`).

**Hint:** untuk parsing baris file, `sscanf(baris, "%[^;];%lf;%[^;]", deskripsi, &jumlah, tanggal)` bisa membantu membaca field yang dipisah `;`. Uji coba dulu dengan data kecil sebelum data besar.

**Tantangan bonus:** tambahkan fitur filter transaksi per bulan, dan laporan ringkas (total pemasukan, total pengeluaran, saldo akhir).

---

## Cara Menguji Project-mu

```bash
gcc -Wall -Wextra -g project.c -o project
./project

# cek memory leak / bug memori (khusus project 7 & 8, sangat direkomendasikan)
valgrind --leak-check=full ./project
# atau, alternatif tanpa install valgrind:
gcc -fsanitize=address -g project.c -o project && ./project
```

Jika compiler menampilkan warning dari `-Wall -Wextra`, perbaiki dulu sebelum lanjut — warning di C sering menandakan bug nyata, bukan sekadar gaya penulisan kode.
