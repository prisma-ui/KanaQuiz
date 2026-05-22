# 仮名 Quiz — Belajar Hiragana & Katakana

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](#lisensi)

Aplikasi web interaktif untuk mempelajari dan menguji pemahaman **Hiragana** dan **Katakana** (sistem penulisan Jepang). Aplikasi ini dilengkapi dengan quiz interaktif, visualisasi karakter kana, dan sistem penilaian real-time.

## 🎯 Fitur Utama

### 1. **Quiz Interaktif**
- Pilih jenis kana: Hiragana, Katakana, atau Keduanya
- Pilih kategori: Main, Dakuten, Kombinasi, atau Semua
- Atur jumlah soal: 5-50 pertanyaan
- Input romaji real-time dengan validasi instan
- Feedback visual untuk jawaban benar/salah
- Efek confetti untuk penyelesaian quiz

### 2. **Jelajahi Karakter**
- Lihat daftar lengkap 46 hiragana dan 46 katakana
- Tampil romaji untuk setiap karakter
- Organisasi berdasarkan baris (a-row, ka-row, dll)
- Filter berdasarkan kategori (Main, Dakuten, Kombinasi)

### 3. **Sistem Penilaian**
- Hitung akurasi real-time
- Identifikasi soal yang benar/salah/terlewat
- Ringkasan hasil dengan breakdown terperinci
- Notifikasi toast untuk feedback pengguna

### 4. **Desain Modern**
- Antarmuka yang responsif dan intuitif
- Animasi smooth menggunakan Framer Motion
- Dark theme profesional
- Floating background dengan karakter kana
- Ikon dan indikator visual yang jelas

## 📋 Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **React** | 19.2.6 | UI Framework |
| **TypeScript** | 4.9.5 | Static typing |
| **Framer Motion** | 12.40.0 | Animasi & transisi |
| **React Hot Toast** | 2.6.0 | Notifikasi toast |
| **React Confetti** | 6.4.0 | Efek celebrasi |
| **React Scripts** | 5.0.1 | Build tool (CRA) |

### Testing
- Jest & React Testing Library untuk unit testing
- `npm test` untuk menjalankan test suite

## 🚀 Memulai

### Prerequisites
- Node.js 16+ 
- npm atau yarn

### Instalasi

1. **Clone repository**
```bash
git clone https://github.com/username/kanaquiz.git
cd kanaquiz
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
# URL backend API kamu
REACT_APP_API_URL=https://your-backend-api.hf.space
```

4. **Jalankan development server**
```bash
npm start
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📖 Struktur Project

```
kanaquiz/
├── src/
│   ├── pages/
│   │   ├── Home.tsx          # Halaman utama dengan konfigurasi quiz
│   │   ├── Home.css          # Styling halaman home
│   │   ├── Quiz.tsx          # Komponen quiz interaktif
│   │   ├── Quiz.css          # Styling quiz
│   │   ├── Browse.tsx        # Halaman jelajahi karakter
│   │   └── Browse.css        # Styling browse
│   ├── components/           # Reusable components (jika ada)
│   ├── App.tsx               # Root component & routing
│   ├── App.css               # Global styling
│   ├── api.ts                # API client & type definitions
│   ├── index.tsx             # React entry point
│   └── index.css             # Base styles
├── public/
│   ├── index.html            # HTML template
│   ├── favicon.ico           # App icon
│   └── manifest.json         # PWA manifest
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript config
├── vercel.json               # Vercel deployment config
└── README.md                 # Dokumentasi ini
```

## 🔌 API Integration

Aplikasi terhubung dengan backend API untuk mendapatkan data karakter kana dan mengelola quiz session.

### API Endpoints

#### **GET /api/hiragana**
```typescript
// Query params (opsional)
category?: 'main' | 'dakuten' | 'combination'

// Response
{
  characters: KanaChar[],
  total: number
}
```

#### **GET /api/katakana**
```typescript
// Sama seperti /api/hiragana
```

#### **GET /api/rows**
```typescript
// Response
{
  rows: Array<{
    row: string,
    count: number,
    categories: string[]
  }>
}
```

#### **POST /api/quiz/start**
```typescript
// Body params
{
  type?: 'hiragana' | 'katakana',
  category?: 'main' | 'dakuten' | 'combination',
  count: number // 5-50
}

// Response
{
  session_id: string,
  total_cards: number,
  cards: QuizCard[]
}
```

#### **POST /api/quiz/answer**
```typescript
// Body
{
  session_id: string,
  card_index: number,
  answer: string // romaji input
}

// Response
{
  card_index: number,
  kana: string,
  your_answer: string,
  correct: boolean,
  correct_romaji: string,
  message: string
}
```

#### **POST /api/quiz/finish**
```typescript
// Body
{ session_id: string }

// Response
{
  session_id: string,
  summary: {
    total_cards: number,
    answered: number,
    skipped: number,
    correct: number,
    incorrect: number,
    score_percent: number
  },
  results: AnswerResult[]
}
```

## 💻 Scripts

```bash
# Development server (http://localhost:3000)
npm start

# Build untuk production
npm run build

# Jalankan test suite
npm test

# Eject CRA config (⚠️ one-way operation)
npm run eject
```

## 🎨 Kustomisasi

### Mengganti API URL
Edit `.env.local`:
```
REACT_APP_API_URL=https://api.yourdomain.com
```

### Mengubah Warna Tema
Edit `src/App.css` dan file CSS lainnya untuk menyesuaikan:
- Background color (`#1a1a2e`)
- Text color (`#faf8f3`)
- Accent color
- Border radius & shadows

### Menambahkan Kategori
Update array kategori di `src/pages/Home.tsx`:
```tsx
{ v: 'your-category', label: 'Kategori Baru' }
```

Pastikan backend juga mendukung kategori baru.

## 📱 Deployment

### Vercel (Rekomendasi)
1. Push project ke GitHub
2. Import di [Vercel Dashboard](https://vercel.com)
3. Set environment variable `REACT_APP_API_URL`
4. Deploy! 🎉

```bash
# atau via CLI
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy folder 'build/' ke Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🔐 Environment Variables

| Variabel | Tipe | Default | Deskripsi |
|----------|------|---------|-----------|
| `REACT_APP_API_URL` | string | `https://kana-api.hf.space` | URL backend API |

> Jangan commit `.env.local` ke repository! Gunakan `.env.example` untuk template.

## 📝 TypeScript Types

Aplikasi menggunakan TypeScript untuk type safety. Interface utama:

```typescript
interface KanaChar {
  kana: string;        // Karakter kana (e.g., 'あ')
  romaji: string;      // Romaji (e.g., 'a')
  row: string;         // Row name (e.g., 'a-dan')
  category: string;    // Kategori (main, dakuten, combination)
  type?: string;       // Tipe (hiragana/katakana)
}

interface QuizCard {
  index: number;
  kana: string;
  type: string;
  category: string;
  row: string;
}

interface AnswerResult {
  card_index: number;
  kana: string;
  your_answer: string;
  correct: boolean;
  correct_romaji: string;
  message: string;
}
```

## 🎓 Data Reference

### Hiragana & Katakana Coverage
- **Total karakter**: 92 (46 hiragana + 46 katakana)
- **Kategori**: 3 (Main, Dakuten, Kombinasi)
- **Baris**: 10 (a-dan hingga wa-o-n)

### Romaji System
Menggunakan sistem Hepburn (romanisasi standar):
- あ → a
- か → ka
- さ → sa
- dst.

## 🐛 Troubleshooting

### "API Error: 404"
- Pastikan `REACT_APP_API_URL` di `.env.local` benar
- Periksa backend API sedang berjalan
- Buka browser DevTools → Network untuk debug

### Quiz tidak muncul
- Refresh halaman
- Buka browser console untuk error messages
- Pastikan API health endpoint `/health` responsive

### Build error
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 🤝 Kontribusi

Kami menerima kontribusi! Silakan:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License. Lihat [LICENSE](LICENSE) untuk detail lengkap.

## 🙏 Credits

- Data karakter kana bersumber dari [Tofugu.com](https://www.tofugu.com)
- Animasi menggunakan [Framer Motion](https://www.framer.com/motion/)
- UI framework [React](https://react.dev/)
- Bootstrapped dengan [Create React App](https://create-react-app.dev/)

## 📧 Support & Feedback

- Issues: [GitHub Issues](https://github.com/prisma-ui/KanaQuiz/issues)

---

**Happy Learning!** 🎌 頑張って！(Ganba! - Do your best!)
