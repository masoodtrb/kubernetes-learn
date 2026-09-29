# Docker Zero-to-Hero — چپتر فرانت

مسیر عملی **قبل از Kubernetes**: کارگاه آموزشی (قابل ارائه در یک جلسهٔ بلند یا چند بخش) + تکلیف عملی.

مواد Kubernetes همچنان در **ریشهٔ ریپو** هستند. این پوشه فقط track داکر است.

## برای ارائه‌دهنده — از کجا شروع کنید؟

1. [00-conductor.md](./00-conductor.md) را یک‌بار کامل بخوانید (نقشهٔ کارگاه، راهنمای اختیاری زمان، چک‌لیست).
2. جلسه را از روی [session-01.md](./session-01.md) جلو ببرید؛ همان فایل اسکریپت ارائه است.
3. در صورت نیاز به عمق بیشتر روی فایل‌ها و شبکه، مراجع anatomy را باز کنید (جدول زیر).
4. یک روز قبل، دموهای داخل [demo/](./demo/) را روی ماشین ارائه build/run کنید.
5. پایان جلسه تکلیف را از [homework.md](./homework.md) اعلام کنید؛ چیت‌شیت دستورات را از [commands.md](./commands.md) لینک دهید.

## فهرست فایل‌ها

| فایل | نقش |
|------|-----|
| [00-conductor.md](./00-conductor.md) | کنداکتور کارگاه، آماده‌سازی، معیار آمادگی برای K8s |
| [session-01.md](./session-01.md) | اسکریپت کامل ارائه با بگو + دمو (+ راهنمای اختیاری زمان) |
| [dockerfile-anatomy.md](./dockerfile-anatomy.md) | اجزای Dockerfile دستور‌به‌دستور |
| [compose-anatomy.md](./compose-anatomy.md) | اجزای `compose.yaml` |
| [stack-anatomy.md](./stack-anatomy.md) | اجزای `stack.yaml` / Swarm `deploy` |
| [networking.md](./networking.md) | شبکهٔ Docker به زبان فرانت |
| [commands.md](./commands.md) | چیت‌شیت دستورات پرکاربرد (قابل‌چاپ؛ progressive disclosure) |
| [homework.md](./homework.md) | تکلیف بعد از جلسه با معیار پذیرش |
| [demo/simple](./demo/simple/) | Dockerfile ساده (nginx + static) |
| [demo/semipro](./demo/semipro/) | multi-stage Node → nginx |
| [demo/advanced](./demo/advanced/) | `.dockerignore`، cache، non-root |
| [demo/compose](./demo/compose/) | Compose: frontend + mock API |
| [demo/swarm](./demo/swarm/) | Stack حداقلی Swarm |

## نقشهٔ موضوعی (راهنمای اختیاری زمان)

باکس‌های زمانی **اجباری نیستند**؛ کارگاه می‌تواند یک‌تکه یا چندقسمتی باشد. اعداد زیر فقط برای برنامه‌ریزی ارائه‌دهنده است.

| بلوک (تقریبی) | موضوع |
|---------------|--------|
| افتتاحیه | خوش‌آمد و هدف |
| تاریخچه | چرا Docker فراگیر شد |
| مدل ذهنی | Docker در برابر Virtualization |
| Dockerfile | ساده → نیمه → پیشرفته + آناتومی دستورات |
| شبکه + Compose | networking کوتاه + چند سرویس |
| Swarm | ارکستراسیون سبک (پل به K8s) + آناتومی stack |
| جمع‌بندی | تکلیف و نظرسنجی |

عمق را برای ساعت قربانی نکنید؛ اگر وقت کم است از اولویت حذف در [کنداکتور](./00-conductor.md) استفاده کنید.

## پیش‌فرض محیط دمو

```bash
docker version
docker compose version
```

Imageهای پایهٔ پیشنهادی برای کش قبلی:

```bash
docker pull nginx:1.27-alpine
docker pull node:22-alpine
```

**پورت‌های دمو:** simple `8080` · semipro `8081` · advanced `8082` · compose `8083` · swarm `8084`

## فرض‌های طراحی

- مخاطب: فرانت‌اند — تئوری کم، مدل ذهنی + دمو زیاد
- اصطلاحات رسمی انگلیسی (`Image`, `Container`, `Dockerfile`, `Compose`, `Swarm`, …) حفظ می‌شوند؛ توضیح فارسی است
- Swarm مقدمهٔ ارکستراسیون است، نه راهنمای production
- مسیر بعدی: دورهٔ Kubernetes در ریشهٔ ریپو

## مجوز استفاده در چپتر

این مطالب برای ارائه داخلی چپتر آماده شده‌اند؛ می‌توانید فایل‌های `demo/` را عیناً برای تمرین لوکال کپی کنید. روی سرور/کلاستر production بدون هماهنگی اعمال نکنید.
