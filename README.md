# 🐾 Laravel-React PetStore

> **Training Project** — React inside Laravel dengan arsitektur Frontend-Only.
> Semua data diambil dari [PetStore Swagger API](https://petstore.swagger.io).
> Laravel hanya berfungsi sebagai shell/wrapper. Tidak ada database, model, atau migration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| PHP Framework | Laravel 12 |
| JS Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| SPA Bridge | Inertia.js v2 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| HTTP Client | Axios |
| Server State | TanStack Query (React Query) v5 |
| Global State | Zustand v5 |
| Notifications | React Hot Toast |
| Local Dev | Laravel Herd |

---

## Prasyarat

Sebelum memulai, pastikan tools berikut sudah terinstall. Ikuti **Dokumen Prerequisite** untuk panduan lengkap instalasi.

```bash
# Verifikasi semua tools
php --version        # PHP 8.2+ (dari Laravel Herd)
composer --version   # Composer 2.x
laravel --version    # Laravel Installer 5.x
node --version       # Node.js v20.x (via NVM)
npm --version        # npm 10.x
```

---

## Instalasi & Setup

### 1. Clone repository

```bash
git clone https://github.com/username/laravel-react-petstore.git
cd laravel-react-petstore
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Setup environment

```bash
# Copy file environment
cp .env.example .env

# Generate application key Laravel
php artisan key:generate
```

### 4. Install Node.js dependencies

```bash
# Pastikan menggunakan versi Node.js yang benar
nvm use   # otomatis baca .nvmrc (Node 20)

# Install semua dependencies
npm install
```

### 5. Jalankan development server

```bash
# Cara 1: Jalankan keduanya bersamaan (direkomendasikan)
composer run dev

# Cara 2: Dua terminal terpisah
# Terminal 1 — Laravel server
php artisan serve

# Terminal 2 — Vite HMR server
npm run dev
```

### 6. Akses aplikasi

| Metode | URL |
|---|---|
| Via Herd (direkomendasikan) | `http://laravel-react-petstore.test` |
| Via artisan serve | `http://localhost:8000` |

> **Login:** Gunakan `username: user1` dan `password: user1` (akun demo PetStore API)

---

## NPM Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan Vite development server dengan HMR |
| `npm run build` | Build semua asset React untuk production |
| `npm run preview` | Preview hasil build production secara lokal |

### `npm run dev` — Development

```bash
npm run dev
```

Menjalankan Vite dalam mode development:
- **Hot Module Replacement (HMR)** aktif — perubahan kode langsung terlihat di browser tanpa reload halaman
- Source maps tersedia untuk debugging
- Code tidak diminifikasi untuk memudahkan debug
- Vite server berjalan di `http://localhost:5173`
- Proxy `/api-proxy` aktif untuk menghindari masalah CORS

### `npm run build` — Production

```bash
npm run build
```

Melakukan proses build lengkap untuk production:
1. **Transpile TypeScript** → JavaScript standar
2. **Transpile JSX/TSX** → JavaScript yang bisa dibaca browser
3. **Bundle** semua module menjadi file-file yang dioptimalkan
4. **Tree-shaking** — hapus kode yang tidak digunakan
5. **Minification** — compress JavaScript dan CSS
6. **Code Splitting** — pecah bundle besar menjadi chunk kecil:
   - `react-vendor.js` — React dan ReactDOM
   - `inertia-vendor.js` — Inertia.js
   - `query-vendor.js` — TanStack Query
   - `motion-vendor.js` — Framer Motion
   - `app.js` — kode aplikasi utama
   - Setiap Page — di-load on-demand (lazy)
7. **Hash versioning** — nama file mengandung hash (`app-Cx3Nu.js`) untuk cache busting
8. **Output** → disimpan ke `public/build/`

### Hasil Build

```
public/build/
├── manifest.json          ← peta file original ke nama hash
└── assets/
    ├── app-[hash].js      ← bundle utama
    ├── app-[hash].css     ← semua CSS
    ├── react-vendor-[hash].js
    ├── inertia-vendor-[hash].js
    ├── query-vendor-[hash].js
    └── [Page]-[hash].js   ← setiap halaman sebagai chunk terpisah
```

Blade template otomatis memuat file yang benar menggunakan `@vite` directive yang membaca `manifest.json`.

---

## Struktur Folder

```
resources/js/
├── app.tsx                 ← Entry point React + Inertia setup
├── bootstrap.ts            ← Inisialisasi Axios dasar
│
├── types/
│   └── index.ts            ← Semua TypeScript interfaces & types
│
├── Services/               ← SERVICE LAYER: Semua HTTP calls di sini
│   ├── api.ts              ← Axios instance dengan interceptors
│   ├── petService.ts       ← CRUD untuk /pet endpoints
│   ├── storeService.ts     ← /store endpoints
│   └── userService.ts      ← /user endpoints
│
├── Hooks/                  ← Custom React hooks
│   ├── usePets.ts          ← TanStack Query hooks untuk Pet
│   ├── useStore.ts         ← TanStack Query hooks untuk Store
│   └── useAuth.ts          ← Hook autentikasi
│
├── Store/                  ← Global state management
│   └── authStore.ts        ← Zustand auth store (token, user)
│
├── Components/
│   ├── ui/                 ← Komponen UI primitif
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── common/             ← Komponen yang dipakai di banyak halaman
│   │   └── Navbar.tsx
│   └── feature/            ← Komponen spesifik fitur
│       ├── PetCard.tsx
│       ├── PetForm.tsx
│       └── DeletePetModal.tsx
│
├── Layouts/
│   ├── AppLayout.tsx       ← Layout untuk halaman yang perlu Navbar
│   └── GuestLayout.tsx     ← Layout untuk halaman login
│
└── Pages/                  ← Satu file per route (dikelola Inertia)
    ├── Auth/
    │   └── Login.tsx
    ├── Pets/
    │   ├── Index.tsx       ← Daftar semua pet dengan filter & search
    │   ├── Show.tsx        ← Detail satu pet
    │   ├── Create.tsx      ← Form tambah pet
    │   └── Edit.tsx        ← Form edit pet
    ├── Store/
    │   └── Index.tsx       ← Inventori stok
    ├── User/
    │   └── Index.tsx       ← Cari user by username
    └── Dashboard.tsx       ← Halaman utama dengan statistik
```

---

## Arsitektur & Alur Data

```
Browser
  │
  ▼
Laravel (Shell Only)
  ├── routes/web.php   → render Inertia page
  └── app.blade.php    → @vite + @inertia
  │
  ▼
React App (resources/js/)
  ├── Pages/           → UI per halaman
  ├── Hooks/           → useQuery, useMutation
  ├── Services/        → axios.get/post/put/delete
  └── Store/           → Zustand auth state
  │
  ▼ (HTTP)
PetStore Swagger API
  └── https://petstore.swagger.io/v2
```

---

## CORS & Proxy

Saat development, semua request React ke API melewati **Vite proxy** untuk menghindari CORS:

```
Browser → /api-proxy/pet → Vite Server → petstore.swagger.io/v2/pet
```

Konfigurasi di `vite.config.ts`:
```ts
server: {
  proxy: {
    '/api-proxy': {
      target: 'https://petstore.swagger.io/v2',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api-proxy/, ''),
    },
  },
},
```

Di production, request langsung ke `VITE_API_BASE_URL`.

---

## Keamanan

| Praktik | Implementasi |
|---|---|
| Token storage | `sessionStorage` (bukan localStorage) — hilang saat tab ditutup |
| API Key | Tidak ada API Key rahasia di client. Semua variabel VITE_ bersifat publik. |
| CORS dev | Request melalui Vite proxy, bukan langsung dari browser |
| Auth state | Dikelola Zustand dengan `persist` ke sessionStorage |
| Lazy loading | Komponen berat di-load on-demand, mengurangi initial bundle |

---

## Deployment ke Production

```bash
# 1. Setup environment production
cp .env.example .env
# Edit: APP_ENV=production, APP_DEBUG=false
# Edit: VITE_API_BASE_URL=https://petstore.swagger.io/v2

# 2. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci

# 3. Build frontend
npm run build

# 4. Optimasi Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Set permissions (Linux server)
chmod -R 775 storage bootstrap/cache
```

### Nginx Config (penting untuk React Router)

```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

# Cache asset Vite yang sudah punya hash (1 tahun)
location /build {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Fitur yang Diimplementasikan

### Pets
- [x] Daftar pet dengan filter status (available/pending/sold)
- [x] Search pet by nama
- [x] Detail pet
- [x] Tambah pet baru
- [x] Edit pet
- [x] Hapus pet dengan konfirmasi modal
- [x] Upload foto pet

### Store
- [x] Tampilkan inventori stok per status

### Users
- [x] Cari user by username
- [x] Tampilkan detail user

### Auth
- [x] Login dengan PetStore API
- [x] Token disimpan di sessionStorage
- [x] Logout (hapus session)
- [x] Halaman login dengan demo credentials

---

## API Reference

Semua endpoint mengacu ke [PetStore Swagger UI](https://petstore.swagger.io).

**Base URL:** `https://petstore.swagger.io/v2`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/pet/findByStatus?status=available` | Daftar pet by status |
| GET | `/pet/{id}` | Detail pet |
| POST | `/pet` | Tambah pet |
| PUT | `/pet` | Update pet |
| DELETE | `/pet/{id}` | Hapus pet |
| POST | `/pet/{id}/uploadImage` | Upload foto |
| GET | `/store/inventory` | Stok inventori |
| GET | `/user/login` | Login |
| GET | `/user/logout` | Logout |
| GET | `/user/{username}` | Data user |

---

## Troubleshooting

**Halaman 404 saat refresh**
→ Pastikan fallback route ada di `routes/web.php`. Sudah dikonfigurasi di project ini.

**Asset CSS/JS tidak muncul**
→ Jalankan `npm run build` atau pastikan `npm run dev` sedang berjalan.

**CORS error di console browser**
→ Pastikan `npm run dev` berjalan (Vite proxy aktif). Di production pastikan API mendukung CORS.

**`nvm use` versi tidak ditemukan**
→ Jalankan `nvm install 20` terlebih dahulu.

**Herd: site .test tidak bisa diakses**
→ Pastikan folder project berada di dalam parked directory Herd.
