# تکلیف عملی — بعد از جلسه Docker (چپتر فرانت)

هدف تکلیف: همان روز یا حداکثر تا قبل از شروع دورهٔ Kubernetes، دستتان به `docker build` / `docker run` / Compose بخورد — نه پروژه سنگین.

**قانون کلی:** این تکلیف باید در **کمتر از ۹۰ دقیقه** قابل انجام باشد.

**فایل‌های کمکی:** [session-01.md](./session-01.md) · [commands.md](./commands.md) (چیت‌شیت دستورات) · [dockerfile-anatomy.md](./dockerfile-anatomy.md) · [compose-anatomy.md](./compose-anatomy.md) · [networking.md](./networking.md) · [demo/](./demo/)

---

## تکلیف — بعد از جلسه Docker

### هدف

1. یک Image فرانت (multi-stage) بسازید و در مرورگر ببینید
2. دو سرویس را با Docker Compose بالا بیاورید و از UI به API برسید
3. (اختیاری) یک نکتهٔ advanced را عمداً لمس کنید

### پیش‌نیاز

| محیط | مناسب وقتی که… |
|------|----------------|
| Docker Desktop | روی macOS / Windows هستید |
| Docker Engine + Compose plugin | روی لینوکس هستید |

قبل از شروع:

```bash
docker version
docker compose version
```

اگر نصب گیر کرد، در کانال چپتر بپرسید (Helper می‌تواند کمک کند). روی ماشین production شرکت بدون هماهنگی چیزی اجرا نکنید. برای یادآوری دستورات روزمره به [commands.md](./commands.md) نگاه کنید.

### مراحل اجباری

#### ۱) Semipro — multi-stage

```bash
cd docker/demo/semipro
docker build -t fe-homework-semipro .
docker run --rm -p 8081:80 fe-homework-semipro
```

مرورگر: `http://localhost:8081`

#### ۲) Compose — frontend + mock API

در ترمینال جدا (یا بعد از stop کردن Container قبلی):

```bash
cd docker/demo/compose
docker compose up --build
```

مرورگر: `http://localhost:8083` → دکمهٔ فراخوانی API را بزنید تا JSON برگردد.

توقف وقتی تمام شد:

```bash
docker compose down
```

#### ۳) سه جملهٔ فهم (بنویسید)

در گزارش تکلیف، با زبان خودتان جواب دهید:

1. تفاوت Image و Container چیست؟
2. multi-stage چه مشکلی از Image فرانت را حل می‌کند؟
3. در Compose، چرا فرانت می‌تواند با hostname `api` صحبت کند؟

### معیار پذیرش (Definition of Done)

تکلیف قبول است اگر **همه** موارد زیر را داشته باشید:

- [ ] خروجی (یا اسکرین) `docker images` که `fe-homework-semipro` را نشان دهد
- [ ] تأیید یک‌خطی یا اسکرین که `http://localhost:8081` صفحهٔ semipro را نشان داده
- [ ] خروجی `docker compose ps` (یا اسکرین) در حالت Up برای `web` و `api`
- [ ] اسکرین یا paste از پاسخ JSON دکمهٔ API روی `http://localhost:8083`
- [ ] پاسخ کوتاه به ۳ سوال فهم بالا

خروجی‌ها را در کانال تکلیف / PR / پیام به presenter بفرستید — هر روشی که چپتر توافق کرده.

### چالش اختیاری (پیشنهادی)

حداقل یکی را انجام دهید:

1. **Advanced rebuild:** در `demo/advanced` متن `index` را عوض کنید (از طریق `build.js`)، دوباره `docker build` بزنید، و بنویسید آیا انتظار دارید لایهٔ `npm install` از cache بیاید یا نه — و چرا.
2. **پورت عوض:** در Compose پورت میزبان `web` را از `8083` به `8090` تغییر دهید و دوباره `up` کنید.
3. **Swarm walkthrough (بدون اجبار به Cluster واقعی):** فایل `demo/swarm/stack.yaml` را بخوانید و در ۵ خط بنویسید `replicas` و `restart_policy` از نظر شما چه می‌گویند. اگر Swarm روی ماشین خودتان راحت است، `stack deploy` هم امتیاز اضافی است.

### اگر Docker ندارید

تا جلسهٔ Kubernetes / office-hour:

- حداقل Dockerfileهای `simple` و `semipro` را خط‌به‌خط بخوانید و برای هر دستور یک خط توضیح بنویسید
- در نظرسنجی بگویید «محیط ندارم» تا Helper برای نصب گروهی وقت بگذارد

---

## قالب گزارش تکلیف (کپی کنید)

```text
نام:
جلسه: Docker zero-to-hero
محیط: Docker Desktop / Engine لینوکس / سایر
دستورات کلیدی که زدم:
خروجی‌ها (paste یا اسکرین):
پاسخ ۳ سوال فهم:
1)
2)
3)
چالش اختیاری: زدم / نزدم — شرح:
مشکل‌هایی که خوردم:
سوال برای مسیر Kubernetes:
```

---

## نکات ایمنی و دامنه

- فقط روی ماشین شخصی / محیط تمرینی کار کنید.
- Secret واقعی (توکن، پسورد) را داخل Image یا چت عمومی نگذارید.
- Imageهای عمومی (`nginx`, `node`) برای تمرین کافی‌اند؛ اجبار به Dockerize کردن ریپوی پروداکشن تیم نیست مگر بخواهید و مجاز باشید.
