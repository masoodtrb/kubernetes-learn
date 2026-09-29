# جلسه ۱ — Docker Zero to Hero برای فرانت‌اند

**مدت:** ۹۰ دقیقه  
**هدف جلسه:** از تاریخچه و تفاوت Container با VM شروع کنیم، Dockerfile ساده تا پیشرفته برای فرانت بنویسیم، Compose را برای چند سرویس ببینیم، و با Swarm یک پل ذهنی به ارکستراسیون (و بعداً Kubernetes) بسازیم.

**فایل‌های مرتبط:** [کنداکتور](./00-conductor.md) · [تکلیف](./homework.md) · [demo/](./demo/)

---

## راهنمای ارائه‌دهنده

- این فایل اسکریپت ارائه است: بخش‌های **بگو** را تقریباً همان‌طور بگویید؛ بلوک‌های کد را روی صفحه نشان دهید.
- اگر وقت کم آمد: اولویت حذف در [کنداکتور](./00-conductor.md) — اول Dockerfile پیشرفته، بعد دمو زندهٔ Swarm.
- اگر وقت زیاد آمد: یک لایهٔ cache اشتباه را با `docker history` با هم debug کنید.

---

## ۰–۵ دقیقه — خوش‌آمد و هدف

### اسلاید / بولت

- موضوع: Docker از صفر تا سطح قابل‌استفاده برای چپتر فرانت
- امروز: تاریخچه → VM در برابر Container → Dockerfile → Compose → Swarm
- بعد از این جلسه: آماده‌اید برای دورهٔ Kubernetes در ریشهٔ همین ریپو

### بگو

> هدف این نیست که DevOps شوید. هدف این است که Image بسازید، Container اجرا کنید، چند سرویس را با Compose بالا بیاورید، و وقتی می‌گوییم «روی Swarm / کلاستر رفت» مدل ذهنی داشته باشید.

### چک سریع اتاق

1. Docker Desktop یا Docker Engine روی ماشینتان نصب است؟
2. تا حالا `Dockerfile` نوشته‌اید؟

اگر اکثریت Docker ندارند: بگویید امروز با دمو روی ماشین ارائه‌دهنده جلو می‌رویم؛ تکلیف را بعداً روی ماشین خودشان انجام دهند.

### چک محیط (ارائه‌دهنده)

```bash
docker version
docker compose version
```

---

## ۵–۱۵ دقیقه — تاریخچهٔ کوتاه

### اسلاید: خط زمان فشرده

| roughly | چه شد؟ |
|---------|--------|
| قبل از ۲۰۱۳ | جداسازی بیشتر با VM؛ استقرار سنگین و کند |
| ۲۰۱۳ | Docker عمومی شد؛ بسته‌بندی اپ به‌صورت Image رایج شد |
| بعد از آن | اکوسیستم: Registry، Compose، Swarm، بعداً Kubernetes |
| امروز | Container زبان مشترک Dev / Ops / Frontend deploy |

### بگو

> ایدهٔ اصلی جدید نبود (جداسازی پروسس در لینوکس از قبل بود). کاری که Docker کرد: **DX** را ساده کرد — یک فایل، یک Image، یک دستور اجرا، تقریباً همه‌جا یکسان.

### برای فرانت یعنی چه؟

- `npm run build` + آپلود دستی فایل‌ها → Image قابل‌تکرار
- «روی سیستم من کار می‌کند» کمتر می‌شود
- همان آرتیفکت از لپ‌تاپ تا سرور (یا کلاستر)

### آنچه امروز عمداً عمیق نمی‌شویم

- جزئیات cgroup / namespace در کرنل
- مقایسهٔ کامل Podman / containerd
- Production hardening کامل

این‌ها را در پارکینگ سوالات بنویسید.

---

## ۱۵–۳۰ دقیقه — Docker در برابر سایر Virtualizationها

### دیاگرام ذهنی

```text
VM:
Hardware → Host OS → Hypervisor → Guest OS + App
                       (هر VM یک OS کامل)

Container:
Hardware → Host OS → Docker Engine → Container (App + libs)
                       (کرنل مشترک؛ ایزولهٔ سبک)
```

### جدول مقایسه

| | Virtual Machine | Container (Docker) |
|--|-----------------|---------------------|
| سیستم‌عامل مهمان | معمولاً بله (کامل) | خیر؛ کرنل میزبان مشترک |
| حجم / استارت | سنگین‌تر / کندتر | سبک‌تر / سریع‌تر |
| ایزولاسیون | قوی‌تر در سطح سخت‌افزار/هایپروایزر | قوی در سطح پروسس؛ مدل تهدید متفاوت |
| واحد بسته‌بندی | دیسک VM / template | **Image** → **Container** |
| مناسب برای | ایزولهٔ قوی، OS متفاوت | اپ و سرویس‌های پرتعداد |

### بگو

> اشتباه رایج: «Container همان VM سبک است.»  
> از نظر *احساس* شبیه است (یک باکس جدا)، از نظر *معماری* فرق دارد: بدون Guest OS کامل.

### تعاریف یک‌خطی

| مفهوم | یک خط |
|--------|--------|
| **Image** | قالب فقط‌خواندنی اپ (لایه‌لایه) |
| **Container** | instance در حال اجرای یک Image |
| **Dockerfile** | دستور پخت Image |
| **Registry** | انبار Imageها (مثلاً Docker Hub) |
| **Volume** | دادهٔ پایدار بیرون از لایهٔ قابل‌حذف Container |
| **Network** | چگونه Containerها همدیگر / بیرون را می‌بینند |

### تشبیه برای فرانت

- **Image** ≈ build آرتیفکت نسخه‌دار (`dist` داخل یک باکس)
- **Container** ≈ یک instance در حال اجرا از همان build
- **Tag** (`my-app:1.2.0`) ≈ شماره نسخهٔ قابل‌ارجاع

---

## ۳۰–۴۰ دقیقه — Dockerfile ساده + دمو

### هدف

یک صفحهٔ استاتیک را با `nginx` در Image بگذاریم و اجرا کنیم.

### فایل — `demo/simple/Dockerfile`

```dockerfile
FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

### `demo/simple/index.html`

صفحهٔ خیلی کوتاه با عنوان «Frontend Docker Demo».

### دستورات دمو

```bash
cd demo/simple
docker build -t frontend-simple:1 .
docker run --rm -p 8080:80 frontend-simple:1
```

مرورگر: `http://localhost:8080`

در ترمینال دیگر:

```bash
docker ps
docker images
```

### بگو

> `FROM` پایه را می‌آورد، `COPY` فایل شما را داخل Image می‌گذارد، `docker run` یک Container از آن Image می‌سازد. پورت `8080:80` یعنی روی لپ‌تاپ ۸۰۸۰ → داخل Container پورت ۸۰.

### برای فرانت یعنی چه؟

حتی بدون Node داخل Image نهایی، می‌توانید خروجی استاتیک را سرو کنید — الگوی رایج SPA.

---

## ۴۰–۵۰ دقیقه — Dockerfile نیمه‌حرفه‌ای (multi-stage)

### مشکل نسخهٔ ساده

اگر `node_modules` و toolchain داخل Image نهایی بمانند: Image بزرگ، سطح حمله بیشتر، deploy کندتر.

### ایدهٔ multi-stage

```text
Stage build (node):  npm ci → npm run build → پوشه dist
Stage run (nginx):   فقط dist را کپی کن → سرو کن
```

### فایل — `demo/semipro/Dockerfile`

```dockerfile
# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build

# --- run stage ---
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

> در دمو می‌توانید یک `package.json` خیلی کوچک با اسکریپت `build` که یک `dist/index.html` می‌سازد داشته باشید تا به اپ واقعی وابسته نباشید.

### بگو

> Image نهایی فقط nginx + فایل‌های استاتیک دارد. Node فقط در مرحلهٔ build بود و دور ریخته شد. این همان الگوی «ساخت یک‌بار، اجرای سبک» است.

### نکتهٔ cache

ترتیب را رعایت کنید: اول `package.json` / lock، بعد `npm install`، بعد بقیهٔ سورس — تا با تغییر یک خط UI کل dependency دوباره دانلود نشود.

---

## ۵۰–۵۵ دقیقه — Dockerfile پیشرفته (فشرده)

### اسلاید: چک‌لیست کوتاه

| موضوع | کار عملی |
|--------|-----------|
| `.dockerignore` | `node_modules`, `.git`, `.env` را بیرون بگذارید |
| کاربر غیر root | در Image نهایی `USER` غیر root (اگر پایه اجازه دهد) |
| پین کردن نسخه | `nginx:1.27-alpine` نه فقط `nginx:latest` |
| کم کردن لایهٔ مخفی | secrets را در `RUN` با ARG باقی نگذارید |
| Health | برای سرویس‌های واقعی بعداً healthcheck بگذارید |

### نمونهٔ پیشرفته‌تر — `demo/advanced/`

- `.dockerignore`
- multi-stage + `build.js`
- `USER nginx` و listen روی پورت `8080` (بدون root)
- `HEALTHCHECK`

```bash
cd demo/advanced
docker build -t frontend-advanced:1 .
docker run --rm -p 8082:8080 frontend-advanced:1
```

### بگو

> پیشرفته یعنی *قابل‌تکرار، کوچک‌تر، امن‌تر* — نه اینکه بیست ابزار قاطی Image کنید.

اگر وقت تمام شد، همین جدول کافی است و جزئیات را به تکلیف بسپارید.

---

## ۵۵–۷۰ دقیقه — Docker Compose

### چرا Compose؟

یک فرانت به‌تنهایی کافی نیست: اغلب API mock، reverse proxy، یا سرویس دوم دارید. به‌جای چند `docker run` طولانی → یک فایل YAML.

### مدل ذهنی

```text
compose.yaml
├── service: web      (frontend / nginx)
└── service: api      (مثلاً یک upstream ساده)
     شبکهٔ مشترک پیش‌فرض Compose
```

### فایل — `demo/compose/compose.yaml`

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    ports:
      - "8080:80"
    depends_on:
      - api
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    expose:
      - "3000"
```

nginx در `web` مسیر `/api/` را به سرویس `api` (mock Node روی پورت ۳۰۰۰) پروکسی می‌کند — نام سرویس = hostname داخل شبکهٔ Compose.

### دستورات دمو

```bash
cd demo/compose
docker compose up --build -d
docker compose ps
curl -s http://localhost:8080/api/hello
docker compose logs -f api
docker compose down
```

### بگو

> Compose برای **توسعه و دموی چندسرویسه روی یک ماشین** عالی است. برای چند Node و self-heal قوی‌تر سراغ ارکستراسیون می‌رویم.

### برای فرانت یعنی چه؟

- یک دستور برای بالا آوردن فرانت + BFF/mock
- نزدیک به تجربهٔ «لوکال مثل سرور» بدون Kubernetes

---

## ۷۰–۸۵ دقیقه — Docker Swarm (مقدماتی)

### جایگاه Swarm

```text
یک ماشین / Compose
        ↓
چند Node، اعلام وضعیت مطلوب، restart خودکار ≈ Swarm
        ↓
اکوسیستم بزرگ‌تر و استاندارد غالب کلاستر ≈ Kubernetes
```

### مفاهیم یک‌خطی Swarm

| مفهوم | یک خط |
|--------|--------|
| **Swarm** | کلاستر ساخته‌شده از یک یا چند Docker Node |
| **Service** | وضعیت مطلوب: N replica از این Image |
| **Stack** | مجموعه‌ای از Serviceها (معمولاً از یک compose-file) |
| **Manager / Worker** | مدیریت کلاستر در برابر اجرای Task |

### بگو

> Swarm را امروز کامل یاد نمی‌گیریم. هدف این است بفهمید **ارکستراسیون** یعنی اعلام «۳ کپی از این Image می‌خواهم» و موتور آن را نگه می‌دارد — همان ایده‌ای که در Kubernetes با Deployment می‌بینید.

### دمو حداقلی (اگر وقت و محیط اجازه داد)

```bash
docker swarm init
cd demo/swarm
docker stack deploy -c stack.yaml frontend-swarm
docker service ls
docker service ps frontend-swarm_web
docker stack rm frontend-swarm
```

### `demo/swarm/stack.yaml` (خلاصه)

```yaml
version: "3.8"
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
```

اگر `swarm init` روی ماشین ارائه‌دهنده دردسر دارد: YAML را روی صفحه بخوانید و بگویید معادل ذهنی‌اش در K8s، Deployment + Service است.

### برای فرانت یعنی چه؟

- `replicas: 2` ≈ دو instance از همان build
- مسیر بعدی چپتر: Kubernetes با کنترلرهای غنی‌تر و اکوسیستم گسترده‌تر

---

## ۸۵–۹۰ دقیقه — جمع‌بندی، تکلیف، نظرسنجی

### جمع‌بندی یک‌اسلایدی

1. Container ≠ VM؛ Image قالب است، Container اجراست  
2. Dockerfile: ساده → multi-stage → نکات امنیتی/اندازه  
3. Compose: چند سرویس روی یک ماشین  
4. Swarm: ارکستراسیون سبک؛ پل به Kubernetes  

### تکلیف

جزئیات: [homework.md](./homework.md)

خلاصه برای اعلام شفاهی:

- یک Dockerfile multi-stage برای یک صفحه/SPA خیلی کوچک
- یک `compose.yaml` با حداقل دو service
- اسکرین یا متن خروجی `docker compose ps`

### نظرسنجی ۳۰ ثانیه‌ای

1. آماده‌اید سراغ جلسهٔ Kubernetes بروید؟  
2. کدام بخش بیشتر وقت می‌خواست: Dockerfile، Compose، یا Swarm؟

### پاکسازی پیشنهادی

```bash
docker compose -f demo/compose/compose.yaml down
docker stack rm frontend-swarm 2>/dev/null || true
docker rm -f $(docker ps -aq) 2>/dev/null || true
```

فقط محیط دموی خودتان را پاک کنید؛ روی ماشین دیگران دستور جمعی ندهید.
