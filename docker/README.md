# Docker Zero-to-Hero — چپتر فرانت

مسیر کوتاه **قبل از Kubernetes**: یک جلسهٔ زندهٔ ۹۰ دقیقه‌ای + تکلیف عملی.

مواد Kubernetes همچنان در **ریشهٔ ریپو** هستند. این پوشه فقط track داکر است.

## برای ارائه‌دهنده — از کجا شروع کنید؟

1. [00-conductor.md](./00-conductor.md) را یک‌بار کامل بخوانید (تایم‌باکس، cut priority، چک‌لیست).
2. جلسه را از روی [session-01.md](./session-01.md) جلو ببرید؛ همان فایل اسکریپت ارائه است.
3. یک روز قبل، دموهای داخل [demo/](./demo/) را روی ماشین ارائه build/run کنید.
4. پایان جلسه تکلیف را از [homework.md](./homework.md) اعلام کنید؛ چیت‌شیت دستورات را از [commands.md](./commands.md) لینک دهید.

## فهرست فایل‌ها

| فایل | نقش |
|------|-----|
| [00-conductor.md](./00-conductor.md) | کنداکتور ۹۰ دقیقه‌ای، آماده‌سازی، معیار آمادگی برای K8s |
| [session-01.md](./session-01.md) | اسکریپت کامل ارائه با تایم‌باکس + بگو + دمو |
| [commands.md](./commands.md) | چیت‌شیت دستورات پرکاربرد (قابل‌چاپ؛ progressive disclosure) |
| [homework.md](./homework.md) | تکلیف بعد از جلسه با معیار پذیرش |
| [demo/simple](./demo/simple/) | Dockerfile ساده (nginx + static) |
| [demo/semipro](./demo/semipro/) | multi-stage Node → nginx |
| [demo/advanced](./demo/advanced/) | `.dockerignore`، cache، non-root |
| [demo/compose](./demo/compose/) | Compose: frontend + mock API |
| [demo/swarm](./demo/swarm/) | Stack حداقلی Swarm |

## تایم‌باکس یک‌خطی

| بازه | موضوع |
|------|--------|
| ۰–۵ | خوش‌آمد |
| ۵–۱۵ | تاریخچه |
| ۱۵–۳۰ | Docker در برابر Virtualization |
| ۳۰–۵۵ | Dockerfile ساده → نیمه → پیشرفته (جیب دستورات ~دقیقهٔ ۳۸) |
| ۵۵–۷۰ | Compose |
| ۷۰–۸۵ | Swarm (پل به K8s) |
| ۸۵–۹۰ | جمع‌بندی و تکلیف |

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

## فرض‌های طراحی

- مخاطب: فرانت‌اند — تئوری کم، مدل ذهنی + دمو زیاد
- اصطلاحات رسمی انگلیسی (`Image`, `Container`, `Dockerfile`, `Compose`, `Swarm`, …) حفظ می‌شوند؛ توضیح فارسی است
- Swarm مقدمهٔ ارکستراسیون است، نه راهنمای production
- مسیر بعدی: دورهٔ Kubernetes در ریشهٔ ریپو

## مجوز استفاده در چپتر

این مطالب برای ارائه داخلی چپتر آماده شده‌اند؛ می‌توانید فایل‌های `demo/` را عیناً برای تمرین لوکال کپی کنید. روی سرور/کلاستر production بدون هماهنگی اعمال نکنید.
