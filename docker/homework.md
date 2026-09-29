# تکالیف عملی — دوره Docker چپتر فرانت

هدف تکالیف: تثبیت Image / Dockerfile / Compose قبل از شروع Kubernetes — نه پروژه سنگین.

**قانون کلی:** تکلیف اجباری باید در **کمتر از ۹۰ دقیقه** قابل انجام باشد.

---

## تکلیف A — بعد از جلسه Docker (قبل از Kubernetes)

### هدف

1. یک Image استاتیک با Dockerfile (ترجیحاً multi-stage یا حداقل `nginx` + `COPY`) بسازید و اجرا کنید.
2. یک `compose.yaml` با **حداقل دو service** بالا بیاورید و وضعیت را نشان دهید.

### پیش‌نیاز

| محیط | مناسب وقتی که… |
|------|----------------|
| Docker Desktop | macOS / Windows و می‌خواهید UI ساده |
| Docker Engine + Compose plugin | لینوکس |

چک:

```bash
docker version
docker compose version
```

### مراحل اجباری

#### ۱) Dockerfile ساده یا نیمه‌حرفه‌ای

یکی از این دو مسیر:

**مسیر آسان:** از روی [demo/simple](./demo/simple) کپی کنید، متن `index.html` را عوض کنید، build/run کنید.

**مسیر پیشنهادی:** از روی [demo/semipro](./demo/semipro) یک multi-stage بسازید (یا همان را با نام خودتان build کنید).

```bash
docker build -t chapter-frontend:1 .
docker run --rm -p 8080:80 chapter-frontend:1
```

مرورگر: `http://localhost:8080` باید صفحهٔ شما را نشان دهد.

#### ۲) Compose با دو سرویس

از روی [demo/compose](./demo/compose) یا معادل خودتان:

```bash
docker compose up --build -d
docker compose ps
```

باید حداقل دو سرویس در وضعیت running / up دیده شوند.

```bash
docker compose down
```

#### ۳) تحویل در کانال چپتر

یکی از این‌ها کافی است:

- اسکرین‌شات `docker compose ps` + آدرس صفحه‌ای که باز کردید
- یا متن خروجی ترمینال همان دستورات (بدون secret)

### معیار پذیرش

- [ ] `docker build` بدون خطا Image می‌سازد
- [ ] `docker run` یا سرویس Compose صفحه را روی پورت اعلام‌شده سرو می‌کند
- [ ] `compose.yaml` حداقل دو service دارد
- [ ] در تحویل مشخص است از چه دستوراتی استفاده کرده‌اید

### خارج از اسکوپ (لازم نیست)

- Swarm روی چند Node واقعی
- Push به Registry سازمانی
- CI کامل

اگر Swarm را برای یادگیری اضافه کردید، عالی است ولی اجباری نیست:

```bash
docker swarm init
docker stack deploy -c stack.yaml mydemo
docker stack rm mydemo
```

فقط روی ماشین خودتان؛ Swarm را بعد از تمرین `leave` کنید اگر لازم نیست.

---

## سوالات سریع خودآزمایی

1. تفاوت Image و Container در یک جمله؟
2. چرا multi-stage برای فرانت (SPA) رایج است؟
3. Compose چه مشکلی از `docker run`های تکراری را حل می‌کند؟
4. Swarm و Kubernetes از نظر *ایده* چه شباهتی دارند؟

اگر هر چهار را جواب می‌دهید، برای جلسهٔ Kubernetes آماده‌اید.
