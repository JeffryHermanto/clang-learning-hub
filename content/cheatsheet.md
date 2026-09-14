# Cheatsheet Bahasa C

Referensi cepat sintaks dan fungsi standard library C. Untuk penjelasan konsep, lihat [Tutorial C](tutorial.html).

## Compile

```bash
gcc -Wall -Wextra -g file.c -o output
./output

gcc -std=c11 file.c -o output      # pilih standar
gcc -fsanitize=address file.c -o output  # deteksi memory bug
```

## Tipe Data & Format Specifier

| Tipe | Ukuran umum | printf | scanf |
|---|---|---|---|
| `char` | 1 byte | `%c` | `%c` |
| `int` | 4 byte | `%d` | `%d` |
| `unsigned int` | 4 byte | `%u` | `%u` |
| `short` | 2 byte | `%hd` | `%hd` |
| `long` | 4/8 byte | `%ld` | `%ld` |
| `long long` | 8 byte | `%lld` | `%lld` |
| `float` | 4 byte | `%f` | `%f` |
| `double` | 8 byte | `%f` | `%lf` |
| `size_t` | 8 byte | `%zu` | `%zu` |
| pointer | 8 byte | `%p` | — |
| string (`char[]`) | — | `%s` | `%s` |
| hex / oct | — | `%x` / `%o` | `%x` / `%o` |

Modifier lebar/presisi: `%5d` (lebar min 5), `%.2f` (2 angka di belakang koma), `%-10s` (rata kiri lebar 10), `%05d` (padding nol).

## Operator

```c
+ - * / %              // aritmatika
== != > < >= <=         // perbandingan
&& || !                 // logika
& | ^ ~ << >>           // bitwise
= += -= *= /= %=        // assignment
++ --                   // increment/decrement
condisi ? a : b         // ternary
```

## Struktur Kontrol

```c
// if / else if / else
if (kondisi) { }
else if (kondisi2) { }
else { }

// switch
switch (x) {
    case 1: ...; break;
    case 2: ...; break;
    default: ...;
}

// for
for (int i = 0; i < n; i++) { }

// while
while (kondisi) { }

// do-while
do { } while (kondisi);

// ternary
int max = (a > b) ? a : b;
```

## Fungsi

```c
tipe_return nama_fungsi(tipe param1, tipe param2) {
    return nilai;
}

void nama_fungsi(int *param); // pointer untuk "pass by reference"
```

## Array

```c
int arr[5];
int arr[5] = {1, 2, 3, 4, 5};
int arr[] = {1, 2, 3};             // ukuran otomatis
int matrix[2][3] = {{1,2,3},{4,5,6}};

int panjang = sizeof(arr) / sizeof(arr[0]); // hanya valid di scope deklarasi
```

## String (`<string.h>`)

```c
char s[20] = "Hello";

strlen(s)          // panjang string
strcpy(dst, src)    // salin
strncpy(dst, src, n)// salin dibatasi n karakter
strcat(dst, src)    // gabung
strncat(dst, src, n)// gabung dibatasi
strcmp(a, b)        // 0 jika sama, <0 / >0 jika beda
strncmp(a, b, n)     // bandingkan n karakter pertama
strchr(s, 'c')      // cari karakter, hasil pointer atau NULL
strstr(a, b)         // cari substring
sprintf(buf, "%d", x)// tulis format ke string
```

## Pointer

```c
int x = 10;
int *p = &x;    // p menyimpan alamat x
*p              // dereference: nilai yang ditunjuk p
&x              // address-of: alamat x

int **pp = &p;  // pointer ke pointer
int *arr_p = arr;      // array meluruh jadi pointer
*(arr_p + i) == arr[i] // ekuivalen

int *p = NULL;  // pointer kosong
if (p != NULL) { }
```

## Struct & Union

```c
struct Point { int x, y; };
struct Point p1 = {3, 4};
p1.x;                    // akses langsung

struct Point *pp = &p1;
pp->x;                   // akses lewat pointer, setara (*pp).x

typedef struct { int x, y; } Point;   // hilangkan kata "struct"
Point p2 = {1, 2};

union Data { int i; float f; };  // field berbagi 1 alamat memori
```

## Enum

```c
enum Hari { SENIN, SELASA, RABU }; // SENIN=0, SELASA=1, RABU=2
enum Hari h = SELASA;
```

## Memori Dinamis (`<stdlib.h>`)

```c
int *p = malloc(n * sizeof(int));     // alokasi, isi sampah
int *p = calloc(n, sizeof(int));      // alokasi, isi 0
p = realloc(p, m * sizeof(int));      // ubah ukuran
free(p);                              // wajib, cegah memory leak
p = NULL;                             // cegah dangling pointer

if (p == NULL) { /* alokasi gagal */ }
```

## File I/O (`<stdio.h>`)

```c
FILE *f = fopen("file.txt", "r");  // "r" "w" "a" "rb" "wb" "r+" ...
if (f == NULL) { /* gagal buka */ }

fprintf(f, "%d\n", x);             // tulis format ke file
fscanf(f, "%d", &x);               // baca format dari file
fgets(buf, sizeof(buf), f);        // baca satu baris
fputs("teks", f);                  // tulis string
fclose(f);                         // wajib tutup file

feof(f)      // true jika sudah di akhir file
```

## Preprocessor

```c
#include <stdio.h>       // header standar
#include "myheader.h"     // header lokal

#define PI 3.14159
#define SQUARE(x) ((x) * (x))

#ifdef DEBUG
    ...
#endif

#ifndef HEADER_H
#define HEADER_H
...
#endif
```

## Storage Class

```c
static int x;   // dalam fungsi: nilai bertahan antar panggilan
                 // di level file: hanya terlihat dalam file itu
extern int x;    // dideklarasikan di file lain
const int x = 5; // tidak boleh diubah
```

## Fungsi Pointer

```c
int tambah(int a, int b) { return a + b; }
int (*op)(int, int) = tambah;
op(3, 4); // 7
```

## Argumen Command-Line

```c
int main(int argc, char *argv[]) {
    // argc = jumlah argumen (termasuk nama program)
    // argv[0] = nama program, argv[1..] = argumen
}
```

## Math (`<math.h>`, link dengan `-lm`)

```c
sqrt(x)   pow(x, y)   fabs(x)
floor(x)  ceil(x)     round(x)
sin(x) cos(x) tan(x)
```

## Karakter (`<ctype.h>`)

```c
isdigit(c)  isalpha(c)  isalnum(c)
isupper(c)  islower(c)  isspace(c)
toupper(c)  tolower(c)
```

## Konversi (`<stdlib.h>`)

```c
atoi(s)     // string -> int
atof(s)     // string -> double
strtol(s, &endptr, base) // string -> long, lebih aman dari atoi
```

## Urutan Prioritas Operator (ringkas, tinggi -> rendah)

```
()  []  ->  .
!  ~  ++  --  (unary) *  &  sizeof
*  /  %
+  -
<<  >>
<  <=  >  >=
==  !=
&
^
|
&&
||
?:
=  +=  -=  ...
```

## Kesalahan Umum (Cepat Cek)

| Gejala | Kemungkinan Penyebab |
|---|---|
| Segmentation fault | dereference pointer NULL / belum diinisialisasi, akses array di luar batas |
| Output angka aneh/sampah | variabel belum diinisialisasi, format specifier salah |
| Infinite loop | lupa update variabel kondisi, base case rekursi salah |
| Memory leak (valgrind) | `malloc` tanpa `free` yang sepadan |
| Crash setelah `free` | use-after-free / double free |
| Hasil pembagian selalu 0 | pembagian integer, lupa casting ke `float`/`double` |
