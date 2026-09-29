# آموزش Docker Zero to Hero — چپتر فرانت

جلسهٔ حدود **۹۰ دقیقه‌ای** قبل از دورهٔ Kubernetes: تاریخچه، تفاوت با VM، Dockerfile، Compose، Swarm.

## برای ارائه‌دهنده — از کجا شروع کنید؟

1. [00-conductor.md](./00-conductor.md) را یک‌بار کامل بخوانید (تایم‌باکس، چک‌لیست، معیار آمادگی برای K8s).
2. جلسه را از روی [session-01.md](./session-01.md) جلو ببرید؛ همان فایل اسکریپت ارائه است.
3. فایل‌های [demo/](./demo/) را از قبل یک‌بار build/run کنید.
4. پایان جلسه تکلیف را از [homework.md](./homework.md) اعلام کنید.

## فهرست فایل‌ها

| فایل | نقش |
|------|------|
| [00-conductor.md](./00-conductor.md) | کنداکتور، تایم‌باکس ۹۰ دقیقه، آماده‌سازی |
| [session-01.md](./session-01.md) | اسکریپت کامل ارائه |
| [homework.md](./homework.md) | تکلیف عملی |
| [demo/simple](./demo/simple) | Dockerfile ساده (nginx + HTML) |
| [demo/semipro](./demo/semipro) | multi-stage Node → nginx |
| [demo/advanced](./demo/advanced) | `.dockerignore` و نکات امنیتی/اندازه |
| [demo/compose](./demo/compose) | دو سرویس با Compose |
| [demo/swarm](./demo/swarm) | Stack حداقلی Swarm |

## فرض‌های طراحی

- مخاطب: فرانت‌اند — تئوری کم، مدل ذهنی و دمو زیاد
- اصطلاحات رسمی انگلیسی حفظ می‌شوند؛ توضیح به فارسی است
- Swarm فقط پل به ارکستراسیون است؛ جایگزین کامل Kubernetes نیست

## محیط پیشنهادی دمو

- Docker Desktop یا Docker Engine + Compose plugin
- قبل از ارائه: `docker version` و در صورت دموی Swarm آمادگی `docker swarm init`

## مسیر یادگیری چپتر

```text
این پوشه (Docker) → دوره Kubernetes در ریشهٔ ریپو
```
