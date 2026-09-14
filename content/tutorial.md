# Tutorial Bahasa C

Panduan belajar bahasa C dari dasar sampai konsep menengah, dengan penjelasan **konseptual** (bukan cuma sintaks) — bagaimana memori bekerja, kenapa C dirancang seperti ini, dan jebakan umum yang perlu dihindari.

## 1. Pengantar: Kenapa C Penting

C dibuat tahun 1972 oleh Dennis Ritchie untuk menulis sistem operasi Unix. Konsep intinya: **memberi programmer kontrol hampir langsung ke memori dan CPU, tanpa terlalu banyak lapisan abstraksi**. Ini yang membedakan C dari bahasa modern seperti Python atau JavaScript.

Kenapa ini penting untuk dipahami:

- Bahasa modern (Java, Python, Go, Rust, JavaScript) semuanya "mewarisi" konsep dari C — variabel, fungsi, array, bahkan cara kerja garbage collector bisa dijelaskan dengan membandingkannya ke manajemen memori manual di C.
- Belajar C = belajar cara komputer sebenarnya menyimpan dan memproses data (stack, heap, alamat memori, byte).
- C tidak punya "jaring pengaman" (no bounds checking, no garbage collector) — ini bikin C cepat, tapi juga berarti **kesalahan kecil bisa menyebabkan bug yang sulit dilacak**. Memahami *kenapa* aturan-aturan C ada akan membuatmu programmer yang lebih waspada di bahasa apa pun.

**Konsep kunci yang akan berulang kali muncul di tutorial ini:** setiap data di program punya **alamat** di memori, dan sebagian besar "keajaiban" bahasa lain (referensi, objek, array dinamis) di C dilakukan secara eksplisit lewat *pointer*.

## 2. Struktur Program & Proses Kompilasi

```c
#include <stdio.h>

int main(void) {
    printf("Hello, World!\n");
    return 0;
}
```

Penjelasan konsep, bukan cuma baris per baris:

- `#include <stdio.h>` — C tidak tahu apa itu `printf` secara bawaan. Baris ini menyuruh **preprocessor** menempelkan isi file header `stdio.h` (berisi deklarasi fungsi I/O) ke atas file-mu, sebelum kompilasi sebenarnya dimulai. Ini terjadi *sebelum* compiler membaca kode sebagai C — makanya disebut "pre"-processor.
- `int main(void)` — setiap program C punya satu titik masuk bernama `main`. Sistem operasi yang memanggil fungsi ini saat program dijalankan. `int` di depan berarti fungsi ini mengembalikan kode status ke OS.
- `return 0;` — konvensi: `0` berarti sukses, non-zero berarti ada error. Bisa dicek di shell dengan `echo $?` setelah program selesai.

### Empat Tahap Kompilasi

Memahami tahap ini membantu debug error compiler:

1. **Preprocessing** — proses semua `#include`, `#define`, `#ifdef` (hasil: file `.c` "murni", tanpa macro).
2. **Compiling** — kode C diterjemahkan ke assembly.
3. **Assembling** — assembly diterjemahkan ke object code (biner, `.o`), tapi belum bisa dijalankan sendiri.
4. **Linking** — object code digabung dengan library (misal implementasi `printf` yang sebenarnya) menjadi satu file executable.

```bash
gcc -Wall -Wextra -g program.c -o program
./program
```

- `-Wall -Wextra`: aktifkan hampir semua warning. **Selalu pakai ini** — banyak bug (variabel tak terinisialisasi, tipe salah) terdeteksi di sini, bukan saat runtime.
- `-g`: sertakan informasi debug supaya bisa dipakai dengan `gdb`/`lldb`.
- `-std=c11`: pilih versi standar C secara eksplisit, supaya perilaku compiler konsisten antar mesin.

## 3. Tipe Data & Variabel

Konsep inti: **variabel adalah nama untuk sekumpulan byte di memori**, dan tipe data menentukan **berapa banyak byte** itu dan **bagaimana cara membacanya**.

| Tipe | Ukuran (umum) | Keterangan |
|---|---|---|
| `char` | 1 byte | karakter tunggal / integer kecil (-128..127) |
| `int` | 4 byte | bilangan bulat |
| `short` | 2 byte | bilangan bulat kecil |
| `long` | 4/8 byte | bilangan bulat besar |
| `long long` | 8 byte | bilangan bulat sangat besar |
| `float` | 4 byte | desimal presisi tunggal (~7 digit signifikan) |
| `double` | 8 byte | desimal presisi ganda (~15 digit signifikan) |
| `_Bool` (`bool` via `stdbool.h`) | 1 byte | true/false |

Poin konseptual penting:

- **Ukuran tipe tidak dijamin sama di semua platform.** Standar C hanya menjamin ukuran *minimum*. Karena itu selalu pakai `sizeof(tipe)` kalau butuh kepastian, jangan hardcode angka byte.
- `float` dan `double` disimpan dalam format IEEE 754 — artinya **tidak semua angka desimal bisa direpresentasikan dengan presisi sempurna** (mis. `0.1` sebenarnya disimpan sebagai nilai mendekati 0.1). Ini kenapa membandingkan float dengan `==` berbahaya.
- `char` sebenarnya adalah tipe integer kecil — `'A'` di memori hanyalah angka `65`. Ini kenapa kamu bisa melakukan `'A' + 1` dan mendapat `'B'`.

```c
int umur = 25;
float tinggi = 172.5f;      // 'f' menandakan literal float, bukan double
double pi = 3.14159265;
char grade = 'A';
const double GRAVITASI = 9.8; // const: compiler akan menolak jika nilai ini diubah
```

`sizeof` adalah operator (bukan fungsi biasa) yang dievaluasi **saat kompilasi**:

```c
printf("%zu\n", sizeof(int)); // %zu untuk size_t, tipe hasil sizeof
```

## 4. Operator

```c
// Aritmatika
+  -  *  /  %

// Perbandingan -> menghasilkan 0 (false) atau 1 (true)
==  !=  >  <  >=  <=

// Logika (short-circuit evaluation)
&&  ||  !

// Bitwise -> operasi langsung pada representasi biner
&  |  ^  ~  <<  >>

// Assignment
=  +=  -=  *=  /=  %=

// Increment/Decrement
++  --
```

Konsep yang sering menjebak pemula:

**Pembagian integer.** Jika kedua operand `int`, hasil dibulatkan ke bawah (dibuang bagian desimalnya), bukan dibulatkan matematis:

```c
int a = 10, b = 3;
printf("%d\n", a / b);          // 3, bukan 3.33
printf("%f\n", (float)a / b);   // 3.333333 -> perlu casting SALAH SATU operand
```

**Short-circuit evaluation.** Pada `&&` dan `||`, jika hasil sudah bisa dipastikan dari operand kiri, operand kanan **tidak dievaluasi sama sekali**. Ini penting untuk pola aman seperti:

```c
if (p != NULL && p->value > 0) { ... } // p->value hanya diakses jika p bukan NULL
```

**Bitwise vs logika** — `&` dan `&&` terlihat mirip tapi sangat berbeda: `&` mengoperasikan bit demi bit pada seluruh angka, `&&` menghasilkan hanya 0/1 dari dua ekspresi boolean. Tertukar keduanya adalah bug klasik.

## 5. Input & Output

Konsep: `printf`/`scanf` adalah fungsi **variadic** (menerima jumlah argumen berapa pun) yang membaca *format string* untuk tahu cara menafsirkan argumen setelahnya. Compiler **tidak mengecek** kecocokan tipe antara format specifier dan argumen — kalau salah, hasilnya undefined behavior (mis. baca sampah dari memori). `-Wall` membantu mendeteksi ini.

| Specifier | Tipe |
|---|---|
| `%d` | int |
| `%f` | float |
| `%lf` | double (untuk scanf; printf boleh `%f` untuk double karena promosi otomatis) |
| `%c` | char |
| `%s` | string (char array) |
| `%p` | pointer/alamat |
| `%zu` | size_t |

```c
int umur;
printf("Masukkan umur: ");
scanf("%d", &umur); // & (address-of) wajib
printf("Umur kamu %d tahun\n", umur);
```

**Kenapa `scanf` butuh `&`?** `scanf` tidak bisa "mengembalikan nilai" seperti fungsi biasa untuk mengisi variabelmu — ia perlu tahu **alamat** variabel supaya bisa menulis langsung ke lokasi memori itu. Ini adalah bentuk paling sederhana dari *pass by reference* yang akan sering kita temui di bagian pointer.

## 6. Percabangan

```c
int nilai = 80;
if (nilai >= 90) {
    printf("A\n");
} else if (nilai >= 75) {
    printf("B\n");
} else {
    printf("C\n");
}
```

Konsep: di C, **setiap nilai non-nol dianggap "true"**, dan `0` dianggap "false" — tidak ada tipe boolean sejati di C lama (sebelum `stdbool.h`). Ini kenapa kode seperti `if (p)` valid untuk cek pointer bukan NULL, atau `if (x)` untuk cek integer bukan nol.

```c
int hari = 3;
switch (hari) {
    case 1: printf("Senin\n"); break;
    case 2: printf("Selasa\n"); break;
    default: printf("Hari lain\n");
}
```

**`break` itu wajib diperhatikan** — tanpa `break`, eksekusi akan "jatuh" (*fall-through*) ke `case` berikutnya meskipun kondisinya tidak cocok. Ini kadang disengaja (untuk beberapa case dengan aksi sama), tapi sering jadi sumber bug jika lupa.

## 7. Perulangan

```c
for (int i = 0; i < 5; i++) { printf("%d\n", i); }

int i = 0;
while (i < 5) { printf("%d\n", i); i++; }

int j = 0;
do { printf("%d\n", j); j++; } while (j < 5); // badan loop pasti jalan minimal 1x
```

Pilih `for` ketika jumlah iterasi diketahui di awal, `while` ketika kondisi berhenti bergantung pada sesuatu yang berubah di tengah proses, `do-while` ketika logikanya harus dijalankan setidaknya sekali (misal: menu program yang selalu tampil sekali sebelum tanya "ulangi?").

`break` keluar dari loop sepenuhnya, `continue` melompat ke pengecekan kondisi berikutnya (melewati sisa badan loop pada iterasi itu).

## 8. Fungsi

```c
int tambah(int a, int b) {
    return a + b;
}

int main(void) {
    int hasil = tambah(3, 4);
    printf("%d\n", hasil); // 7
}
```

**Konsep paling penting soal fungsi di C: pass by value.** Saat kamu memanggil `tambah(3, 4)`, C **menyalin** nilai argumen ke parameter lokal fungsi. Fungsi bekerja dengan salinan, bukan variabel asli si pemanggil.

```c
void tambahSatu(int x) {
    x = x + 1; // hanya mengubah salinan lokal
}

int main(void) {
    int n = 5;
    tambahSatu(n);
    printf("%d\n", n); // tetap 5!
}
```

Untuk benar-benar mengubah variabel di si pemanggil, kirim **alamatnya** (pointer), lalu fungsi men-dereference alamat itu untuk menulis nilai baru langsung ke lokasi memori aslinya:

```c
void tambahSatu(int *x) {
    *x = *x + 1; // menulis ke alamat yang ditunjuk x
}

int main(void) {
    int n = 5;
    tambahSatu(&n);
    printf("%d\n", n); // 6
}
```

Ini adalah pola yang akan terus muncul: **kalau fungsi perlu mengubah sesuatu di luar dirinya, ia butuh alamat (pointer) ke sesuatu itu**, bukan nilainya saja.

## 9. Array

```c
int angka[5] = {10, 20, 30, 40, 50};
printf("%d\n", angka[0]); // 10
angka[1] = 99;
int panjang = sizeof(angka) / sizeof(angka[0]); // 5
```

Konsep krusial: **array di C hanyalah blok memori berurutan (contiguous) tanpa metadata**. `angka[5]` mengalokasikan 5 slot `int` yang saling bersebelahan di memori. `angka[i]` sebenarnya dihitung compiler sebagai "alamat awal array + (i × ukuran tipe)".

Akibat langsung dari ini:

- **Tidak ada bounds checking.** `angka[10]` pada array berukuran 5 tidak akan error saat kompilasi maupun (biasanya) saat runtime — ia hanya membaca/menulis memori di luar array, yang merupakan *undefined behavior* (bisa crash, bisa merusak data lain, bisa "kelihatan jalan normal" tapi sebenarnya bug tersembunyi).
- **Array tidak "tahu" panjangnya sendiri.** `sizeof(angka)/sizeof(angka[0])` adalah trik untuk menghitung jumlah elemen, tapi ini hanya berfungsi di scope tempat array dideklarasikan — begitu array dikirim ke fungsi lain, ia "meluruh" (*array decay*) menjadi pointer biasa dan informasi panjangnya hilang. Itu sebabnya fungsi yang menerima array biasanya juga menerima parameter panjang secara terpisah:

```c
void cetak(int arr[], int panjang) {
    for (int i = 0; i < panjang; i++) printf("%d ", arr[i]);
}
```

Array multidimensi disimpan sebagai satu blok memori besar dalam urutan *row-major* (baris demi baris):

```c
int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
printf("%d\n", matrix[1][2]); // 6
```

## 10. String

C tidak punya tipe string bawaan — string adalah **konvensi**: array `char` yang diakhiri byte `'\0'` (null terminator, nilai 0) untuk menandai "string berhenti di sini".

```c
char nama[20] = "Budi"; // sebenarnya: {'B','u','d','i','\0', ...sisanya tidak terpakai}
printf("%s\n", nama);
printf("Panjang: %zu\n", strlen(nama)); // strlen MENGHITUNG sampai ketemu '\0'
```

Karena string hanyalah array dengan konvensi, semua batasan array berlaku: tidak ada bounds checking, dan fungsi seperti `strcpy` bisa menulis melebihi ukuran buffer tujuan kalau kamu tidak hati-hati (ini penyebab bug keamanan klasik: *buffer overflow*).

| Fungsi | Kegunaan | Catatan bahaya |
|---|---|---|
| `strlen(s)` | panjang string | butuh `'\0'` valid, atau baca sampah tanpa batas |
| `strcpy(dst, src)` | salin string | tidak cek ukuran `dst` — bisa overflow |
| `strncpy(dst, src, n)` | salin string, dibatasi | lebih aman, tapi tidak selalu null-terminate `dst` |
| `strcat(dst, src)` | gabung string | sama, rawan overflow |
| `strcmp(a, b)` | bandingkan (0 = sama) | — |
| `strchr(s, c)` / `strstr(a,b)` | cari karakter/substring | — |

```c
char a[50] = "Hello, ";
strcat(a, "World!");
printf("%s\n", a); // Hello, World!
```

## 11. Pointer

Ini konsep paling penting dan paling sering ditakuti di C — padahal idenya sederhana: **pointer adalah variabel yang isinya adalah alamat memori variabel lain.**

```c
int x = 10;
int *p = &x;   // p sekarang menyimpan alamat x, BUKAN nilai 10

printf("%d\n", x);          // 10        -> nilai x
printf("%p\n", (void*)p);   // 0x7ffee... -> alamat x
printf("%d\n", *p);         // 10        -> "dereference": ambil nilai di alamat yang ditunjuk p

*p = 20;
printf("%d\n", x);          // 20, karena p menunjuk ke x — mengubah *p = mengubah x
```

Dua operator kunci, jangan pernah tertukar artinya:

- `&variabel` — "alamat dari" — mengubah nilai menjadi pointer ke lokasinya
- `*pointer` — "isi dari alamat yang ditunjuk" (dereference) — mengubah pointer menjadi nilai yang ditunjuknya

**Kenapa pointer ada?** Tiga alasan utama yang akan terus kamu temui:

1. **Mengubah variabel dari fungsi lain** (lihat bagian 8) — cara C melakukan "pass by reference".
2. **Bekerja dengan data besar tanpa menyalinnya** — mengirim pointer ke struct besar jauh lebih murah daripada menyalin seluruh struct tiap kali dipanggil fungsi.
3. **Struktur data dinamis** — linked list, tree, dsb butuh "sambungan" antar blok memori, dan sambungan itu direpresentasikan pointer.

Pointer dan array berkaitan erat: nama array, jika dipakai dalam ekspresi, otomatis "meluruh" menjadi pointer ke elemen pertamanya.

```c
int arr[3] = {1, 2, 3};
int *p = arr;              // sama dengan: int *p = &arr[0];
printf("%d\n", *(p + 1));  // 2 -> sama dengan arr[1]. p+1 bergeser 1 x sizeof(int) byte, bukan 1 byte
```

Pointer `NULL` adalah konvensi "pointer ini belum/tidak menunjuk ke apa pun yang valid":

```c
int *p = NULL;
if (p != NULL) {
    // aman di-dereference
}
```

Men-dereference pointer `NULL` atau pointer yang belum diinisialisasi (*wild pointer*) adalah salah satu penyebab crash paling umum di C (`segmentation fault`).

## 12. Struct & Union

`struct` membungkus beberapa variabel bertipe berbeda menjadi satu unit logis — ini fondasi konsep "objek" di bahasa berorientasi objek (yang di C harus dibuat manual).

```c
struct Mahasiswa {
    char nama[50];
    int umur;
    float ipk;
};

int main(void) {
    struct Mahasiswa m1 = {"Ani", 20, 3.8};
    printf("%s - %.2f\n", m1.nama, m1.ipk); // . untuk akses field dari struct langsung

    struct Mahasiswa *p = &m1;
    printf("%s\n", p->nama); // -> untuk akses field lewat POINTER ke struct
    // p->nama setara dengan (*p).nama
    return 0;
}
```

Di memori, field-field struct disimpan berurutan (dengan kemungkinan *padding* tambahan agar tiap field sejajar/aligned sesuai kebutuhan CPU) — ini kenapa `sizeof(struct)` kadang lebih besar dari jumlah `sizeof` tiap field-nya.

`typedef` menghilangkan kebutuhan menulis kata `struct` berulang-ulang:

```c
typedef struct {
    int x;
    int y;
} Point;

Point p1 = {3, 4}; // tanpa perlu tulis "struct Point p1"
```

`union` mirip struct, tapi **semua field berbagi alamat memori yang sama** — ukurannya sebesar field terbesar, dan menulis ke satu field akan "menimpa" field lain. Berguna saat kamu tahu pasti hanya satu field yang aktif dalam satu waktu (menghemat memori), misalnya merepresentasikan nilai yang bisa berupa `int` ATAU `float` tapi tak pernah keduanya sekaligus.

## 13. Alokasi Memori Dinamis: Stack vs Heap

Konsep dasar yang menjelaskan semua ini: program punya dua area memori utama untuk data saat runtime.

- **Stack** — tempat variabel lokal biasa (`int x;`, array ukuran tetap) otomatis dialokasikan dan dibersihkan begitu fungsi selesai (keluar dari scope). Cepat, tapi ukurannya terbatas dan **lenyap begitu fungsi return** — kamu tidak bisa mengembalikan pointer ke variabel lokal fungsi dan berharap masih valid.
- **Heap** — area memori yang kamu kelola **manual** lewat `malloc`/`free`. Bertahan selama kamu tidak meng-`free`-nya, terlepas dari fungsi mana yang mengalokasikannya — cocok untuk data yang ukurannya baru diketahui saat runtime, atau yang perlu "hidup" lebih lama dari fungsi pembuatnya.

Header: `<stdlib.h>`

| Fungsi | Kegunaan |
|---|---|
| `malloc(size)` | alokasi `size` byte di heap (isi tidak ditentukan/sampah) |
| `calloc(n, size)` | alokasi `n × size` byte, semua diisi 0 |
| `realloc(ptr, size)` | ubah ukuran alokasi yang sudah ada (mungkin pindah alamat!) |
| `free(ptr)` | kembalikan memori ke sistem |

```c
int n = 5;
int *arr = malloc(n * sizeof(int));
if (arr == NULL) { // malloc BISA gagal (memori habis) -> selalu cek
    return 1;
}
for (int i = 0; i < n; i++) arr[i] = i * i;

free(arr);   // wajib -- tanpa ini, memori "bocor" (memory leak) selama program berjalan
arr = NULL;  // best practice: cegah "dangling pointer" (pointer yang masih menunjuk ke memori yang sudah dibebaskan)
```

Tiga bug klasik seputar heap yang wajib dipahami:

- **Memory leak** — lupa `free`, memori terus terpakai sampai program berakhir.
- **Dangling pointer / use-after-free** — mengakses memori setelah di-`free`; memori itu bisa saja sudah dipakai ulang untuk data lain.
- **Double free** — memanggil `free` dua kali pada pointer yang sama; merusak struktur internal alokator memori.

Aturan emas: **setiap `malloc`/`calloc` harus punya tepat satu `free` yang sepadan**, dan jangan pernah menyentuh pointer itu lagi setelahnya.

## 14. File I/O

```c
FILE *f = fopen("data.txt", "w");
if (f == NULL) { printf("Gagal membuka file\n"); return 1; }
fprintf(f, "Halo, %s!\n", "dunia");
fclose(f);

char buffer[100];
f = fopen("data.txt", "r");
while (fgets(buffer, sizeof(buffer), f) != NULL) {
    printf("%s", buffer);
}
fclose(f);
```

Konsep: `FILE *` adalah "handle" (pegangan) ke file yang sedang dibuka, dikelola oleh library standar — kamu tidak pernah menyentuh isinya langsung, hanya lewat fungsi seperti `fprintf`/`fgets`. `fopen` bisa gagal (file tidak ada, tidak ada izin akses) sehingga **selalu** harus dicek terhadap `NULL` sebelum dipakai — pola yang sama seperti mengecek `malloc`. `fclose` penting supaya buffer internal ditulis (*flushed*) ke disk dan file handle dikembalikan ke sistem operasi.

Mode buka file: `"r"` (baca, gagal jika file tidak ada), `"w"` (tulis, **menimpa** isi lama atau membuat baru), `"a"` (tambah di akhir file), tambahkan `"b"` untuk mode biner (`"rb"`, `"wb"`) di platform yang membedakan teks vs biner.

## 15. Preprocessor & Macro

Ingat dari bagian 2: preprocessor bekerja **sebelum** kompilasi sebenarnya, murni tekstual (cari-ganti teks), tidak mengerti tipe data atau sintaks C.

```c
#define PI 3.14159
#define SQUARE(x) ((x) * (x))

#ifdef DEBUG
    #define LOG(msg) printf("[DEBUG] %s\n", msg)
#else
    #define LOG(msg)
#endif

int main(void) {
    printf("%f\n", PI);        // preprocessor mengganti PI jadi 3.14159 sebelum kompilasi
    printf("%d\n", SQUARE(5)); // menjadi: ((5) * (5))
    LOG("mulai program");      // hilang total jika DEBUG tidak didefinisikan
}
```

Perhatikan tanda kurung berlapis di `SQUARE(x)` — karena macro adalah cari-ganti teks murni, `SQUARE(a + b)` tanpa kurung akan menjadi `a + b * a + b` (salah secara matematis), bukan `(a+b)*(a+b)`. Kurung ekstra melindungi dari jebakan ini.

`#ifdef`/`#ifndef`/`#endif` mengaktifkan/menonaktifkan blok kode saat kompilasi (*conditional compilation*) — berguna untuk kode debug, atau mendukung beberapa platform dari satu source file.

Header guard mencegah isi header ter-`#include` dua kali dalam satu file (yang akan menyebabkan error "redefinisi"):

```c
#ifndef MYHEADER_H
#define MYHEADER_H
// isi header
#endif
```

## 16. Scope & Storage Class

Konsep: **scope** menentukan *di mana* nama variabel bisa diakses; **storage class** menentukan *seberapa lama* variabel itu hidup dan *di mana* ia disimpan.

```c
int global = 1;           // scope: seluruh file (dan file lain jika di-extern), lifetime: seluruh program

void foo(void) {
    static int counter = 0; // diinisialisasi SEKALI saja, nilainya bertahan antar pemanggilan fungsi
    counter++;
    printf("%d\n", counter); // akan mencetak 1, 2, 3, ... tiap kali foo() dipanggil
}

int main(void) {
    int lokal = 5;          // scope: dalam main saja, lifetime: selama main berjalan (di stack)
    foo(); foo(); foo();    // -> 1 2 3
}
```

- `auto` — default untuk variabel lokal (jarang ditulis eksplisit); hidup di stack, hilang saat scope berakhir.
- `static` (di dalam fungsi) — variabel tetap "ingat" nilainya antar pemanggilan, tapi tetap hanya terlihat/dipanggil dari dalam fungsi itu.
- `static` (di level file, di luar fungsi) — membatasi visibilitas variabel/fungsi hanya untuk file `.c` itu saja (tidak bisa diakses dari file lain lewat `extern`).
- `extern` — mendeklarasikan bahwa variabel didefinisikan di file lain; dipakai untuk berbagi variabel global antar file.

## 17. Rekursi

Fungsi yang memanggil dirinya sendiri, dengan **kasus dasar (base case)** untuk menghentikan pemanggilan berulang:

```c
int faktorial(int n) {
    if (n <= 1) return 1;        // base case -- tanpa ini, rekursi tak berhenti
    return n * faktorial(n - 1); // recursive case
}
```

Konsep di baliknya: setiap pemanggilan fungsi (termasuk rekursif) mendapat *stack frame* baru di stack, menyimpan parameter dan variabel lokalnya sendiri. Rekursi yang terlalu dalam (atau tanpa base case) menghabiskan stack dan menyebabkan crash (*stack overflow*) — beda dengan heap yang habisnya "graceful" (`malloc` mengembalikan `NULL`).

## 18. Enum

```c
enum Hari { SENIN, SELASA, RABU, KAMIS, JUMAT, SABTU, MINGGU };
enum Hari hariIni = RABU;
printf("%d\n", hariIni); // 2 -- enum sebenarnya cuma int bernama, dimulai dari 0
```

`enum` memberi nama pada sekumpulan konstanta integer, membuat kode lebih mudah dibaca dibanding angka "ajaib" (`if (hari == 2)` vs `if (hari == RABU)`).

## 19. Pointer ke Fungsi

Konsep: fungsi juga punya alamat di memori, dan alamat itu bisa disimpan dalam variabel — berguna untuk "menyuntikkan" perilaku (mirip callback di bahasa lain).

```c
int tambah(int a, int b) { return a + b; }
int kali(int a, int b)  { return a * b; }

int hitung(int a, int b, int (*operasi)(int, int)) {
    return operasi(a, b); // memanggil fungsi lewat pointer
}

int main(void) {
    printf("%d\n", hitung(3, 4, tambah)); // 7
    printf("%d\n", hitung(3, 4, kali));   // 12
}
```

## 20. Argumen Command-Line

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Jumlah argumen: %d\n", argc);   // argc: argument count, termasuk nama program
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]); // argv[0] = nama program itu sendiri
    }
    return 0;
}
```

Dijalankan sebagai `./program hello 123` → `argc = 3`, `argv = {"./program", "hello", "123"}`. Perhatikan `argv[i]` selalu bertipe string (`char*`) — jika butuh angka, harus dikonversi manual (`atoi`, `strtol`, dsb).

## 21. Undefined Behavior — Kenapa C "Terasa Berbahaya"

Ini konsep payung yang menjelaskan banyak jebakan di atas: C sengaja **tidak** mendefinisikan apa yang terjadi untuk operasi tertentu (mis. akses array di luar batas, dereference pointer NULL, pakai variabel yang belum diinisialisasi, overflow signed integer). Ini disebut *undefined behavior* (UB).

Kenapa desainnya begini? Supaya compiler bisa mengoptimalkan kode seagresif mungkin tanpa harus menjamin perilaku "aman" untuk kasus yang programmer seharusnya tidak lakukan. Konsekuensinya:

- Program dengan UB bisa "kelihatan jalan normal" di satu komputer/compiler, tapi crash atau menghasilkan output salah di komputer/compiler lain.
- UB **bukan** error yang selalu terdeteksi — tidak ada exception, tidak ada pesan error otomatis.
- Ini kenapa disiplin (`-Wall -Wextra`, selalu cek NULL, selalu inisialisasi variabel, pakai `valgrind`) jauh lebih penting di C dibanding bahasa dengan jaring pengaman bawaan.

## 22. Tips & Best Practices (Ringkasan)

- Selalu inisialisasi variabel sebelum dipakai — variabel lokal C **tidak** otomatis diisi 0.
- Selalu cek hasil `malloc`/`fopen` terhadap `NULL` sebelum dipakai.
- Kompilasi dengan `-Wall -Wextra`, perlakukan warning seperti error.
- Hindari `gets()` (dihapus dari standar modern karena rawan buffer overflow) — pakai `fgets()`.
- Gunakan `const` untuk parameter pointer yang isinya tidak boleh diubah fungsi.
- Satu `malloc` = satu `free`; set pointer ke `NULL` setelah `free`.
- Pahami stack (otomatis, cepat, terbatas, hilang saat fungsi return) vs heap (manual, fleksibel, bisa leak).
- Pakai `valgrind` atau sanitizer (`-fsanitize=address`) untuk mendeteksi memory bug yang tidak selalu kelihatan dari output program.

Lihat juga [Cheatsheet C](cheatsheet.html) untuk referensi cepat sintaks dan fungsi standard library.
