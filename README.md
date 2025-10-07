# Carton PS5 eFootball Cup

مدیر تورنمنت برای بازی **eFootball (PS5)** با تمرکز بر زبان فارسی و چیدمان **RTL**.
امکانات اصلی شامل: ایجاد و مدیریت گروه‌ها، برنامه بازی‌ها، ثبت نتایج، محاسبه رده‌بندی، مدیریت بازیکن‌ها، **گزارش‌/خبر** با مدیا، لایک/نظر، و **پنل ویرایش/حذف فقط برای مدیر**.

> Tech: **Next.js 15** · **Prisma** · **SQLite** (پیش‌فرض) · **TailwindCSS** · (اختیاری) **shadcn/ui** · Persian RTL

---

## ✨ امکانات

* **بازیکن‌ها**: ساخت/ویرایش/حذف، لیست‌بندی، جست‌وجو
* **بازی‌ها (Matches)**: ثبت میزبان/میهمان، هفته، نتیجه، زمان شروع، وضعیت (SCHEDULED/DONE)، ویرایش/حذف (فقط مدیر)
* **برنامه بازی‌ها (Fixtures)**: نمایش گروه‌به‌گروه + **تاریخ شمسی** + نتیجه
* **گروه‌ها (Groups)**: لیست، برنامه و نتایج هر گروه
* **گزارش‌ها (Reports)**: ایجاد خبر/گزارش با **آپلود تصویر/ویدیو**، آدرس‌خوان (slug) فارسی، نمایش لایک/نظر
* **احراز هویت سبک**: ورود/خروج، نمایش دکمه‌های مدیریتی فقط برای کاربر واردشده
* **زبان فارسی & RTL**: فونت/راست‌چین، قالب‌بندی تاریخ شمسی (`faDateTime`)
* **Server Actions** و Route Handlers در Next.js 15
* بهینه‌سازی رفرش با `dynamic = "force-dynamic"` در صفحاتی که داده زنده دارند

---

## 🧱 معماری و ساختار پوشه‌ها

```
web/
├─ src/
│  ├─ app/
│  │  ├─ admin/                 # ورودی‌های مدیریتی (اختیاری)
│  │  ├─ api/
│  │  │  └─ upload/route.ts     # آپلود فایل → برمی‌گرداند { url }
│  │  ├─ fixtures/page.tsx      # برنامه بازی‌ها + تاریخ شمسی
│  │  ├─ groups/page.tsx        # جدول گروه‌ها
│  │  ├─ login/page.tsx         # ورود
│  │  ├─ logout/page.tsx        # خروج
│  │  ├─ matches/
│  │  │  ├─ page.tsx            # لیست بازی‌ها
│  │  │  └─ [id]/edit/page.tsx  # ویرایش/حذف بازی (مدیر)
│  │  ├─ players/
│  │  │  ├─ page.tsx            # لیست بازیکن‌ها (+ دکمه ویرایش برای مدیر)
│  │  │  ├─ new/page.tsx        # ساخت بازیکن
│  │  │  └─ [id]/edit/page.tsx  # ویرایش/حذف بازیکن
│  │  ├─ reports/
│  │  │  ├─ page.tsx            # لیست گزارش‌ها
│  │  │  ├─ new/page.tsx        # ساخت گزارش + آپلود مدیا
│  │  │  └─ [slug]/page.tsx     # نمایش گزارش + لایک/نظر
│  │  └─ page.tsx               # خانه
│  ├─ components/               # NavClient و اجزای UI
│  ├─ lib/
│  │  ├─ auth.ts                # کوکی/توکن و کمک‌متد requireUser
│  │  ├─ db.ts                  # Prisma Client
│  │  ├─ date.ts                # faDateTime, faDate
│  │  └─ prisma-helpers.ts      # پارسرهای عدد/تاریخ (intOrNull, dateOrNull,…)
│  └─ styles/                   # Tailwind, globals
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/               # مهاجرت‌ها
└─ public/
   └─ uploads/YYYY-MM-DD/       # فایل‌های آپلودشده
```

---

## 🗃️ مدل‌های داده (خلاصه)

> فایل کامل: `prisma/schema.prisma`

* **Player**: `id, fullName, dept?, groupId`
* **Group**: `id, name, …`
* **Match**:
  `id, groupId, homeId, awayId, week?, kickoffAt?, homeScore?, awayScore?, status(enum)`
* **Report**: `id, slug, title, summary?, content?, likesCount, commentsCount, medias[]`
* **Media**: `id, reportId, url, type(IMAGE|VIDEO)`
* **Comment**: `id, reportId, author?, content, approved`
* (به‌روزرسانی شده) **Cascade** حذف مدیا/کامنت هنگام حذف گزارش

---

## 🔧 راه‌اندازی سریع

### 1) پیش‌نیازها

* Node.js 18+
* pnpm یا npm/yarn
* (پیش‌فرض) SQLite – قابل‌تعویض با Postgres/MySQL

### 2) کلون و نصب

```bash
git clone https://github.com/setarehHosseinNet/carton-ps5-efootball-cup.git
cd carton-ps5-efootball-cup/web
pnpm install
```

### 3) تنظیم متغیرهای محیطی (`.env`)

نمونه:

```env
# Prisma
DATABASE_URL="file:./dev.db"

# Auth (نمونه)
AUTH_SECRET="a-very-strong-secret"

# مسیر آپلودها (اختیاری)
UPLOAD_DIR="public/uploads"
MAX_UPLOAD_MB=10
```

### 4) دیتابیس

```bash
pnpm prisma migrate dev --name init
# (اختیاری) اگر اسکریپت seed دارید:
pnpm prisma db seed
```

### 5) اجرا

```bash
pnpm dev
# http://localhost:3000
```

### 6) ساخت و اجرا در تولید

```bash
pnpm build
pnpm start
```

---

## 🔐 احراز هویت / نقش‌ها

* **کاربر وارد نشده**: فقط مشاهده (بازیکن‌ها، برنامه، گروه‌ها، گزارش‌ها)
* **مدیر (وارد شده)**: دکمه‌های «ویرایش/حذف/ایجاد» را می‌بیند و می‌تواند:

  * `/players/new`, `/players/[id]/edit`
  * `/matches/[id]/edit`
  * `/reports/new`, و حذف/ویرایش گزارش‌ها (در صفحه‌ی گزارش)
* کنترل دسترسی با هلپرهای `getSessionUser()` و `requireUser()` (در `lib/auth.ts`) انجام می‌شود.

---

## 🖼️ آپلود فایل

* Route: `POST /api/upload`
* ورودی: `FormData` با فیلد `file`
* خروجی: `{ url: string }`
* فایل‌ها در `public/uploads/YYYY-MM-DD/` ذخیره می‌شوند.
* در ساخت گزارش، ابتدا فایل‌ها آپلود و URLها ذخیره می‌شوند؛ سپس گزارش با آرایه `mediaUrls[]` ایجاد می‌شود.

> **نکته:** در ویندوز اگر خطاهای مربوط به `pagefile.sys` یا `DumpStack.log.tmp` دیدید، مربوط به Watchpack است و ارتباطی با پروژه ندارد.

---

## 📄 صفحات و مسیرها

| مسیر                 | دسترسی | توضیح                                          |
| -------------------- | ------ | ---------------------------------------------- |
| `/`                  | عمومی  | خانه                                           |
| `/players`           | عمومی  | لیست بازیکن‌ها (با دکمه ویرایش برای مدیر)      |
| `/players/new`       | مدیر   | ساخت بازیکن                                    |
| `/players/[id]/edit` | مدیر   | ویرایش/حذف بازیکن                              |
| `/matches`           | عمومی  | لیست بازی‌ها                                   |
| `/matches/[id]/edit` | مدیر   | ویرایش/حذف بازی                                |
| `/fixtures`          | عمومی  | برنامه‌ی بازی‌ها گروه‌به‌گروه + **تاریخ شمسی** |
| `/groups`            | عمومی  | جدول گروه‌ها                                   |
| `/reports`           | عمومی  | لیست گزارش‌ها/اخبار                            |
| `/reports/new`       | مدیر   | ایجاد گزارش + آپلود                            |
| `/reports/[slug]`    | عمومی  | صفحه گزارش (لایک/نظر + مدیا)                   |
| `/login`, `/logout`  | عمومی  | ورود/خروج                                      |

---

## 🧠 نکات فنی مهم

* صفحات داده‌محور با `export const dynamic = "force-dynamic"` تعریف شده‌اند تا داده همیشه تازه باشد.
* برای مقداردهی ورودی‌ها از `defaultValue` استفاده شده (نه `value`) تا با Server Components سازگار باشد.
* در فرم‌ها، به جای state-management، از **Server Actions** استفاده شده است.
* در TypeScript: فیلدهای نتیجه بازی‌ها **`homeScore`** و **`awayScore`** هستند (نه `gHome/gAway`).

---

## 🐛 مشکلات رایج

* **Module not found: './like.client'**
  اگر لایک/کامنت کلاینتی را لازم ندارید، importها را حذف یا کامنت کنید.
* **cookies was called outside a request scope**
  تابع‌های Auth را فقط داخل مسیرهای RSC/Route Handler فراخوانی کنید و از `dynamic = "force-dynamic"` کمک بگیرید.
* **خطای Watchpack در ویندوز**
  پیام‌های `EINVAL pagefile.sys` بی‌خطرند و به File Watcher مربوط‌اند.

---

## 🛣️ نقشه راه (Roadmap)

* پنل مدیریتی یکپارچه برای همه عملیات
* محاسبه رده‌بندی زنده گروه‌ها
* فیلتر/جست‌وجوی پیشرفته
* چندزبانه‌سازی (i18n)
* OAuth و نقش‌های چندگانه کاربری

---

## 📜 مجوز

MIT – آزاد برای استفاده/توسعه.
اگر از پروژه استفاده کردید، یک ⭐️ به مخزن بدهید!

---

## 🤝 مشارکت

۱) فورک → ۲) برنچ `feat/your-feature` → ۳) کامیت‌های معنی‌دار → ۴) PR
قوانین کامیت:
`feat: ...`، `fix: ...`، `chore: ...`، `docs: ...`, `refactor: ...`

---

## ⚙️ اسکریپت‌ها

```bash
pnpm dev         # اجرای توسعه
pnpm build       # ساخت تولید
pnpm start       # اجرای تولید
pnpm prisma db push
pnpm prisma migrate dev --name <name>
pnpm prisma studio
```

---

هرجا گیر کردید یا ایده‌ای داشتید، ایشو باز کنید 😊
