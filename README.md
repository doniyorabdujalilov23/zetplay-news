# ZetPlay News

Zamonaviy, tezkor va xavfsiz yangiliklar platformasi. Next.js 15 (App Router), TypeScript,
Tailwind CSS va Firebase (Authentication, Firestore, Storage) asosida qurilgan, to'liq
ishlaydigan production-ready loyiha.

## Texnologiyalar

- **Next.js 15** (App Router, Server Components, ISR)
- **TypeScript** (strict mode)
- **Tailwind CSS** + `@tailwindcss/typography`
- **Firebase Authentication** (Email/Password) — admin panel uchun
- **Cloud Firestore** — maqolalar, kategoriyalar, teglar, izohlar, foydalanuvchilar, sozlamalar
- **Firebase Storage** — rasm va video fayllar
- **TipTap** — rich text editor
- **Framer Motion** — animatsiyalar
- **Lucide React** — ikonkalar
- Vercel'ga deploy qilishga tayyor (Cron Jobs bilan)

## Asosiy imkoniyatlar

### Frontend (foydalanuvchilar uchun)
- Bosh sahifa: hero slider, so'nggi yangiliklar, mashhur yangiliklar, kategoriya navigatsiyasi,
  infinite scroll
- 10 ta standart kategoriya: O'zbekiston, Dunyo, Sport, Texnologiya, Iqtisodiyot, Siyosat,
  Madaniyat, Avto, Kino, O'yinlar
- Har bir maqola sahifasida: to'liq matn, galereya (lightbox), YouTube video, muallif,
  o'qilishlar soni, like, ulashish tugmalari, teglar, o'xshash yangiliklar, izohlar tizimi
- Qidiruv, breadcrumb, dark/light mode, loading skeleton, maxsus 404 va xatolik sahifalari
- To'liq SEO: dynamic metadata, OpenGraph, Twitter Cards, JSON-LD (NewsArticle, BreadcrumbList,
  Organization), sitemap.xml, robots.txt, RSS lenta (`/rss.xml`)
- PWA: web manifest + service worker (oflayn keshlash)

### Admin panel (`/admin`, kirish `/login` orqali)
- Faqat Firebase Authentication orqali ro'yxatdan o'tgan va **admin/muharrir/moderator** roli
  tayinlangan foydalanuvchilar kira oladi (Firebase custom claims orqali)
- **Dashboard**: statistikalar, bugungi maqolalar, eng mashhur maqolalar, oxirgi foydalanuvchilar
- **Yangiliklar**: qo'shish/tahrirlash/o'chirish, Draft/Publish/Schedule Publish, Featured
  belgilash, TipTap rich text editor, drag & drop rasm/galereya yuklash, SEO Title/Description,
  avtomatik URL slug
- **Media manager**: barcha yuklangan fayllar, qidiruv, preview, o'chirish
- **Kategoriyalar** va **Teglar**: to'liq CRUD
- **Foydalanuvchilar**: Admin/Editor/Moderator rollarini boshqarish (Firebase custom claims)
- **Izohlar**: tasdiqlash, spam belgilash, o'chirish
- **Sozlamalar**: sayt nomi, logo, favicon, footer, ijtimoiy tarmoqlar, Google Analytics,
  reklama kodlari

## Loyiha tuzilishi

```
zetplay-news/
├── src/
│   ├── app/                     # Next.js App Router sahifalari
│   │   ├── (site)/              # Ommaviy sahifalar (Header/Footer bilan)
│   │   │   ├── page.tsx         # Bosh sahifa
│   │   │   ├── kategoriya/[slug]/
│   │   │   ├── yangilik/[slug]/
│   │   │   ├── teg/[slug]/
│   │   │   └── qidiruv/
│   │   ├── admin/               # Admin panel (AdminGuard bilan himoyalangan)
│   │   ├── login/               # Admin login sahifasi
│   │   ├── api/                 # API route'lar (users, view counter, cron, revalidate)
│   │   ├── sitemap.ts, robots.ts, manifest.ts
│   │   └── rss.xml/route.ts
│   ├── components/               # Qayta ishlatiluvchi komponentlar
│   ├── context/                  # Auth va Theme context'lari
│   ├── lib/
│   │   ├── firebase/             # Client va Admin SDK konfiguratsiyasi
│   │   ├── data/                 # Firestore/Storage data-access qatlami
│   │   └── utils/                # Slug, sana, reading time va h.k.
│   └── types/                    # TypeScript type'lar
├── scripts/
│   ├── create-admin.ts           # Birinchi admin foydalanuvchini yaratish
│   └── seed-categories.ts        # Standart kategoriyalarni yaratish
├── firestore.rules, storage.rules, firestore.indexes.json, firebase.json
├── vercel.json                   # Cron Jobs konfiguratsiyasi
└── .env.example
```

## O'rnatish (lokal muhitda)

### 1. Repozitoriyani klonlash va paketlarni o'rnatish

```bash
git clone <repo-url> zetplay-news
cd zetplay-news
npm install
```

### 2. Firebase loyihasini yaratish

1. [Firebase Console](https://console.firebase.google.com) ga kiring va yangi loyiha yarating.
2. **Authentication** bo'limida **Email/Password** provayderini yoqing.
3. **Firestore Database** yarating (production mode).
4. **Storage** yoqing.
5. Project Settings > General bo'limidan **Web App** qo'shing va konfiguratsiya
   qiymatlarini oling (`apiKey`, `authDomain`, va h.k.).
6. Project Settings > Service Accounts bo'limidan **yangi maxfiy kalit yarating**
   (`serviceAccountKey.json` yuklab olinadi) — bu Admin SDK uchun kerak.

### 3. Muhit o'zgaruvchilarini sozlash

```bash
cp .env.example .env.local
```

`.env.local` faylini oching va quyidagilarni to'ldiring:

- `NEXT_PUBLIC_FIREBASE_*` — Web App konfiguratsiyasidan
- `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY` —
  yuklab olingan `serviceAccountKey.json` faylidan (private key ichidagi qator ko'chirishlarni
  `\n` ko'rinishida saqlang)
- `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` — birinchi admin hisobingiz uchun
- `CRON_SECRET` — Vercel Cron Jobs uchun ixtiyoriy maxfiy token
- `REVALIDATE_SECRET_TOKEN` — on-demand ISR revalidation uchun maxfiy token

### 4. Firestore xavfsizlik qoidalari va indekslarni joylashtirish

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # loyihangizni tanlang, .firebaserc faylini yangilang
firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 5. Standart ma'lumotlarni yaratish

```bash
npm run seed          # 10 ta standart kategoriya + sayt sozlamalarini yaratadi
npm run create-admin  # ADMIN_BOOTSTRAP_EMAIL/PASSWORD asosida birinchi admin hisobini yaratadi
```

### 6. Loyihani ishga tushirish

```bash
npm run dev
```

Brauzerda [http://localhost:3000](http://localhost:3000) ni oching. Admin panelga kirish uchun
[http://localhost:3000/login](http://localhost:3000/login) sahifasiga o'ting va `create-admin`
skriptida ko'rsatilgan email/parol bilan kiring.

## Foydali buyruqlar

```bash
npm run dev          # Development server
npm run build         # Production build
npm run start         # Production serverni ishga tushirish
npm run lint           # ESLint tekshiruvi
npm run lint:fix        # ESLint xatolarini avtomatik tuzatish
npm run format          # Prettier bilan formatlash
npm run type-check      # TypeScript tekshiruvi (strict mode)
npm run create-admin    # Yangi bosh admin hisobini yaratish
npm run seed             # Standart kategoriya va sozlamalarni yaratish
```

## GitHub'ga yuklash

```bash
git init
git add .
git commit -m "ZetPlay News: boshlang'ich commit"
git branch -M main
git remote add origin https://github.com/<username>/zetplay-news.git
git push -u origin main
```

> **Muhim:** `.env.local` va `serviceAccountKey.json` fayllari `.gitignore` orqali repozitoriyaga
> kirmaydi. Bu maxfiy ma'lumotlarni hech qachon GitHub'ga yuklamang.

## Vercel'ga deploy qilish

1. [vercel.com](https://vercel.com) ga kiring va GitHub repozitoriyangizni import qiling.
2. **Environment Variables** bo'limida `.env.example` dagi barcha o'zgaruvchilarni qo'shing
   (Production, Preview va Development muhitlari uchun).
   - `FIREBASE_ADMIN_PRIVATE_KEY` qiymatini kiritishda qator ko'chirishlar (`\n`) saqlanishiga
     e'tibor bering — Vercel matn maydonига to'g'ridan-to'g'ri joylashtirsangiz bo'ladi.
3. **Deploy** tugmasini bosing.
4. Deploy tugagach, Vercel loyiha sozlamalaridan **Cron Jobs** yoqilganini tekshiring
   (`vercel.json` faylida `/api/cron/publish-scheduled` har 5 daqiqada ishga tushadi — bu
   rejalashtirilgan (Schedule Publish) maqolalarni vaqti kelganda avtomatik chop etadi).
5. Domenni ulash uchun Vercel loyihasi sozlamalaridan **Domains** bo'limiga o'ting.
6. `NEXT_PUBLIC_SITE_URL` o'zgaruvchisini asosiy domeningizga moslab yangilang va qayta deploy
   qiling (SEO metadata va sitemap to'g'ri ishlashi uchun muhim).

### Firebase Storage CORS (agar kerak bo'lsa)

Agar rasm yuklashda CORS xatoligi chiqsa, Firebase Storage bucket uchun CORS konfiguratsiyasini
o'rnating:

```bash
gsutil cors set cors.json gs://<your-bucket-name>
```

`cors.json` namunasi:

```json
[
  {
    "origin": ["https://your-domain.com", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type"]
  }
]
```

## Xavfsizlik arxitekturasi

- **Firebase Authentication** — faqat Email/Password, admin panelga kirish shu orqali amalga
  oshiriladi.
- **Custom Claims** (`role: admin | editor | moderator`) — foydalanuvchi roli Firebase ID
  tokeniga o'rnatiladi va quyidagi 3 qatlamda tekshiriladi:
  1. **Middleware** (`src/middleware.ts`) — `/admin/*` yo'llariga kirishda sessiya cookie
     mavjudligini tezkor tekshiradi (UX uchun).
  2. **AdminGuard** komponenti — clientda foydalanuvchi rolini tekshiradi va ruxsatsiz
     foydalanuvchini `/login` ga yo'naltiradi.
  3. **Firestore/Storage Security Rules** — haqiqiy ma'lumotlar xavfsizligini ta'minlaydigan
     asosiy qatlam; barcha yozish amallari `request.auth.token.role` orqali tekshiriladi.
- **Admin SDK API route'lari** (`/api/users/*`) — foydalanuvchi rollarini boshqarish
  (custom claims o'rnatish) faqat server tomonida, ID token tasdiqlangandan so'ng bajariladi.
- Barcha sahifalarda xavfsizlik header'lari (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`) `next.config.ts` orqali o'rnatilgan.

## Litsenziya

Ushbu loyiha sizning buyurtmangiz asosida yaratildi va istalgan maqsadda erkin foydalanishingiz
mumkin.
