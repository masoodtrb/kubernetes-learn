# آناتومی Compose file — اجزای `compose.yaml`

مرجع برای خواندن و نوشتن فایل Compose با مخاطب فرانت.

**فایل دمو:** [demo/compose/compose.yaml](./demo/compose/compose.yaml)  
**نام‌های رایج فایل:** `compose.yaml` (ترجیح فعلی) · `compose.yml` · `docker-compose.yml` (قدیمی‌تر، هنوز رایج)

---

## مدل ذهنی یک خطی

```text
compose.yaml  →  docker compose up  →  چند Container + یک شبکهٔ پروژه
نام Service   →  DNS hostname داخل آن شبکه
```

به‌جای چند `docker run` با فلگ طولانی، یک YAML می‌نویسید.

---

## کلیدهای سطح بالا

| کلید | چه می‌کند | در دمو؟ |
|------|-----------|---------|
| `services` | نقشهٔ Serviceها (قلب فایل) | بله — `web`, `api` |
| `networks` | تعریف شبکه‌های نام‌دار | خیر — Compose یک شبکهٔ پیش‌فرض پروژه می‌سازد |
| `volumes` | Volumeهای نام‌دار مشترک | خیر در دموی فعلی |
| `configs` / `secrets` | تنظیمات/اسرار (بیشتر Swarm) | عمداً نیست |

اگر `networks:` ننویسید، همهٔ Serviceهای یک پروژه روی **یک user-defined bridge** مشترک می‌نشینند — برای دموی فرانت + API کافی است.

---

## زیر هر Service (زیر `services.<name>`)

| کلید | چه می‌کند | مثال دمو / نمونه | برای فرانت یعنی چه؟ |
|------|-----------|------------------|---------------------|
| `build` | Image را از Dockerfile بساز | `build.context` + `dockerfile` | فرانت و mock API هر کدام Dockerfile خودشان |
| `build.context` | پوشهٔ context بیلد | `.` | همان مفهوم `.` در `docker build` |
| `build.dockerfile` | مسیر Dockerfile | `Dockerfile.web` | وقتی چند Dockerfile در یک پوشه دارید |
| `image` | Image آماده (بدون build محلی) | `image: nginx:1.27-alpine` | در Swarm دمو می‌بینید؛ در Compose هم رایج است |
| `ports` | publish به میزبان: `HOST:CONTAINER` | `"8083:80"` روی `web` | مرورگر شما به `localhost:8083` می‌رسد |
| `expose` | پورت را فقط روی شبکهٔ داخلی علامت بزن | `"3000"` روی `api` | از بیرون لپ‌تاپ لازم نیست؛ `web` از داخل به `api:3000` می‌زند |
| `depends_on` | ترتیب استارت (نه ضمانت ready بودن) | `web` → `api` | API قبل از web استارت می‌شود؛ health کامل نیست |
| `environment` | env به سبک لیست یا نقشه | `PORT: "3000"` | مثل `-e` در `docker run` |
| `env_file` | خواندن از فایل `.env` | — | secret را به git نفرستید |
| `volumes` | bind mount یا named volume | `./src:/app` | hot-reload لوکال؛ در دموی فعلی نیست |
| `networks` | وصل به شبکهٔ نام‌دار | — | وقتی چند شبکه دارید |
| `command` | جایگزین `CMD` Image | `command: ["npm", "run", "dev"]` | برای dev server فرانت |
| `restart` | سیاست ری‌استارت روی یک host | `unless-stopped` | با `deploy.restart_policy` در Swarm فرق دارد |
| `profiles` | روشن‌کردن اختیاری Service | — | مثلاً فقط وقتی `debug` می‌خواهید |

### `ports` در برابر `expose`

| | از مرورگر روی لپ‌تاپ؟ | بین Containerها روی شبکهٔ Compose؟ |
|--|------------------------|-------------------------------------|
| `ports: "8083:80"` | بله (`localhost:8083`) | بله |
| `expose: "3000"` | خیر (مگر جداگانه publish کنید) | بله — و بیشتر مستندسازی + سازگاری ابزارها |

جزئیات شبکه: [networking.md](./networking.md).

---

## فایل دموی این دوره — خط‌به‌خط

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    ports:
      - "8083:80"
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    expose:
      - "3000"
```

| خط / بلوک | معنی |
|-----------|------|
| `services.web` | سرویس فرانت (nginx + HTML + proxy) |
| `build` روی `web`/`api` | به‌جای Image از پیش‌ساخته، همین‌جا build کن |
| `ports` فقط روی `web` | تنها ورودی عمومی دمو پورت `8083` است |
| `depends_on: [api]` | اول `api`، بعد `web` |
| `services.api` + `expose: 3000` | mock API داخل شبکه؛ hostname = `api` |

nginx در `web/default.conf` به `http://api:3000` پروکسی می‌زند — **نام سرویس = DNS**.

---

## دستورات روزمره (یادآوری)

```bash
cd docker/demo/compose
docker compose up --build
docker compose ps
docker compose logs -f api
docker compose down
```

لیست کامل‌تر: [commands.md](./commands.md).

---

## Compose در برابر Stack / Swarm

| موضوع | Compose معمولی | Stack (`docker stack deploy`) |
|--------|----------------|-------------------------------|
| هدف | dev / دمو روی یک ماشین | سرویس روی Swarm |
| کلید `deploy:` | معمولاً نادیده یا محدود | فعال (`replicas`, `restart_policy`, …) |
| دستور | `docker compose up` | `docker stack deploy -c …` |

آناتومی Stack: [stack-anatomy.md](./stack-anatomy.md).

---

## لینک‌های مرتبط

- جلسه: [session-01.md](./session-01.md)
- Dockerfile: [dockerfile-anatomy.md](./dockerfile-anatomy.md)
- شبکه: [networking.md](./networking.md)
- دمو: [demo/compose/](./demo/compose/)
