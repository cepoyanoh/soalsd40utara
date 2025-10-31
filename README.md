# Pengelola Google Forms

Aplikasi web full-stack yang dibangun dengan Next.js yang memungkinkan siswa mengakses Google Forms tanpa login dan guru untuk mengelola formulir dengan login.

## Fitur

- Halaman siswa: Melihat dan membuka Google Forms tanpa login
- Halaman guru: Login diperlukan untuk mengelola Google Forms
- Guru dapat menambah, mengedit, dan menghapus formulir
- Formulir disimpan di MongoDB dengan tanggal berakhir
- Desain responsif dengan Tailwind CSS

## Teknologi yang Digunakan

- Frontend: Next.js (React) + Tailwind CSS
- Backend: Next.js API Routes
- Database: MongoDB Atlas via Mongoose
- Autentikasi: JWT + bcryptjs

## Prasyarat

- Node.js (v14 atau lebih tinggi)
- Akun MongoDB Atlas
- Google Forms

## Instruksi Setup

1. Clone repositori:
   ```
   git clone <url-repositori>
   cd google-forms-manager
   ```

2. Install dependensi:
   ```
   npm install
   ```

3. Buat file `.env.local` di direktori root dengan variabel berikut:
   ```
   MONGODB_URI=mongodb+srv://tonyarianto11_db_user:C3poyanoh@dbsoalnew.busgpmm.mongodb.net/?appName=dbsoalnew
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Jalankan server pengembangan:
   ```
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Menanamkan Data Awal

Untuk membuat akun guru awal, Anda dapat menggunakan endpoint registrasi API atau memasukkan dokumen pengguna secara manual ke dalam koleksi MongoDB dengan struktur berikut:

```json
{
  "email": "teacher@example.com",
  "passwordHash": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S", // Kata sandi: Password123!
  "name": "Contoh Guru",
  "role": "teacher",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

Hash kata sandi adalah untuk kata sandi `Password123!`. Anda dapat menghasilkan hash Anda sendiri menggunakan bcryptjs.

## Deploy ke Vercel

1. Push kode ke repositori GitHub
2. Masuk ke akun Vercel Anda
3. Klik "New Project" dan impor repositori Anda
4. Tambahkan variabel lingkungan berikut di pengaturan proyek Vercel:
   - `MONGODB_URI`: String koneksi MongoDB Anda
   - `JWT_SECRET`: Kunci rahasia JWT Anda
   - `NEXT_PUBLIC_BASE_URL`: URL aplikasi Vercel Anda (misalnya https://your-app.vercel.app)
5. Deploy proyek

## Endpoint API

### Autentikasi
- `POST /api/auth/register` - Mendaftarkan akun guru baru
- `POST /api/auth/login` - Login dan menerima token JWT
- `GET /api/auth/profile` - Mendapatkan profil pengguna yang terautentikasi

### Formulir
- `GET /api/forms` - Daftar semua formulir (publik)
- `GET /api/forms/:id` - Mendapatkan formulir tertentu (publik)
- `POST /api/forms` - Membuat formulir baru (khusus guru)
- `PUT /api/forms/:id` - Memperbarui formulir (khusus guru)
- `DELETE /api/forms/:id` - Menghapus formulir (khusus guru)

## Penanganan URL Google Form

Aplikasi secara otomatis mengonversi URL Google Form standar ke format embedded dengan:
- Mengganti `/viewform` dengan `/viewform`
- Menambahkan `?embedded=true` ke URL

Ini memastikan formulir ditampilkan dengan benar dalam iframe.

## Akses untuk Guru

Guru dapat mengakses halaman login melalui URL `/login` untuk mengelola formulir. Siswa tidak akan melihat tautan login di halaman utama.

## Pertimbangan Keamanan

- Kata sandi dihash secara aman menggunakan bcryptjs
- Token JWT digunakan untuk autentikasi
- Rute API dilindungi dengan pemeriksaan otorisasi
- Validasi input dilakukan pada semua endpoint

## Kontribusi

Silakan fork repositori dan kirim pull request untuk perbaikan.