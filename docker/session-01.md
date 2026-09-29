# جلسه Docker — از صفر تا قابل‌استفاده (چپتر فرانت)

**مدت:** ۹۰ دقیقه  
**هدف جلسه:** بفهمیم Docker چرا آمد، تفاوتش با VM چیست، Dockerfile ساده تا نسبتاً حرفه‌ای برای فرانت بنویسیم، چند سرویس را با Compose بالا بیاوریم، و Swarm را به‌عنوان مقدمهٔ ارکستراسیون (پل به Kubernetes) بشناسیم.

**فایل‌های مرتبط:** [کنداکتور](./00-conductor.md) · [تکلیف](./homework.md) · [چیت‌شیت دستورات](./commands.md) · [دموها](./demo/)

---

## راهنمای ارائه‌دهنده

- این فایل اسکریپت ارائه است: بخش‌های **بگو** را تقریباً همان‌طور بگویید؛ بلوک‌های کد را روی صفحه نشان دهید.
- اگر وقت کم آمد (اولویت حذف از [کنداکتور](./00-conductor.md)):
  1. بخش پیشرفته Dockerfile → ۳ دقیقه بولت
  2. دمو Swarm زنده نکنید؛ YAML را روی صفحه بخوانید
  3. تاریخچه را به ۳ دقیقه فشرده کنید
  4. جیب «دستورات پرکاربرد» → فقط جدول را نشان دهید و رد شوید (لیست کامل در [commands.md](./commands.md))
- اگر وقت زیاد آمد: یک `COPY` اشتباه را با `docker history` debug کنید، یا سرویس دوم به Compose اضافه کنید.

---

## ۰–۵ دقیقه — خوش‌آمد و هدف

### اسلاید / بولت

- موضوع: Docker برای چپتر فرانت (قبل از Kubernetes)
- امروز یاد نمی‌گیریم «کل Docker ecosystem» را؛ یاد می‌گیریم **مدل ذهنی درست** + **اولین Image فرانت** + **Compose** + **نگاه به Swarm**
- خروجی جلسه: بتوانید بگویید Image ≠ Container، یک Dockerfile multi-stage بخوانید، و دو سرویس را با Compose بالا بیاورید

### بگو

> هدف این جلسه این نیست که DevOps شوید. هدف این است که وقتی می‌گوییم «فرانت داخل Container رفت»، دقیقاً بدانید Image چیست، Container چیست، Dockerfile چه کار می‌کند، و چرا بعداً سراغ Kubernetes می‌رویم.

### چک سریع اتاق

از شرکت‌کنندگان بپرسید (دست بالا):

1. تا حالا `docker run` زده‌اید؟
2. Dockerfile نوشته‌اید؟
3. Docker Compose دیده‌اید؟

اگر اکثریت هیچ‌کدام را نزده‌اند: ۱ دقیقه بگویید «Image مثل کلاس است، Container مثل instance در حال اجرا».

### چک محیط (ارائه‌دهنده)

```bash
docker version
docker compose version
```

اگر روی ماشین دمو کار نکرد: پلن B (اسکرین/خروجی ازپیش‌گرفته) را آماده کنید.

---

## ۵–۱۵ دقیقه — تاریخچهٔ کوتاه

### اسلاید / بولت — خط زمان ذهنی

| دوره | ایده | دردسر رایج |
|------|------|-------------|
| قبل از Container | اپ روی سرور یا VM نصب می‌شود | «روی سیستم من کار می‌کند» |
| Linux containers (cgroups / namespaces) | ایزوله‌سازی سبک فرایندها | ابزار استاندارد برای همه نبود |
| ۲۰۱۳ — Docker | بسته‌بندی Image + UX ساده برای developer | Container برای همه قابل‌لمس شد |
| بعد از Docker | Compose، Registry، ارکستراسیون (Swarm، بعد Kubernetes) | «چطور صدها Container را مدیریت کنیم؟» |

### بگو

> Docker اختراع‌کنندهٔ مفهوم Container در لینوکس نبود؛ کاری که کرد این بود که **ساخت، اشتراک و اجرای** Container را برای برنامه‌نویس ساده کرد. برای همین در تیم‌های فرانت هم فراگیر شد: یک Dockerfile، یک Image، همه همان خروجی را می‌گیرند.

### برای فرانت یعنی چه؟

- `npm run build` + nginx داخل Image → همان آرتیفکت روی لپ‌تاپ، CI و سرور
- وابستگی به «نسخه Node روی ماشین همکار» کمتر می‌شود
- زبان مشترک با Backend / DevOps برای دیپلوی

### آنچه امروز عمداً عمیق نمی‌شویم

- جزئیات kernel (cgroups / namespaces) مگر سوال بیاید
- تاریخچهٔ کامل LXC / rkt / Podman
- مقایسهٔ تجاری Docker Inc با جایگزین‌ها

این‌ها را در پارکینگ سوالات بنویسید.

---

## ۱۵–۳۰ دقیقه — Docker در برابر سایر Virtualizationها

### اسلاید: VM در برابر Container

```text
VM:
  Hypervisor
  └── Guest OS کامل
      └── اپ شما

Container:
  Host OS (یک kernel مشترک)
  └── Container (ایزوله‌سازی فرایند + فایل‌سیستم خود)
      └── اپ شما
```

### جدول مقایسهٔ سریع

| موضوع | VM | Container (Docker) |
|--------|----|---------------------|
| سیستم‌عامل مهمان | معمولاً کامل | معمولاً ندارد؛ از kernel میزبان استفاده می‌کند |
| حجم / سرعت استارت | سنگین‌تر، کندتر | سبک‌تر، معمولاً ثانیه‌ای |
| ایزوله‌سازی | قوی‌تر در سطح سخت‌افزار/هایپروایزر | قوی در سطح فرایند؛ مدل تهدید فرق دارد |
| مناسب برای | چند OS مختلف روی یک سخت‌افزار | بسته‌بندی و اجرای یکسان اپ |
| واحد کار | ماشین مجازی | Image → Container |

### بگو

> اشتباه رایج: «Container همان VM سبک است.» از نظر تجربهٔ developer شبیه هم به نظر می‌رسند، ولی مدل فنی فرق دارد: Container یک **فرایند ایزوله** روی kernel مشترک است، نه یک ماشین کامل با OS جدا.

### تشبیه برای فرانت

- **VM** ≈ یک لپ‌تاپ کامل مجازی با ویندوز/لینوکس خودش
- **Image** ≈ zip ساخته‌شده از `dist` + runtime لازم (مثل nginx)
- **Container** ≈ یک instance در حال اجرای آن zip
- **Registry** ≈ جایی که Image را publish/pull می‌کنید (مثل npm registry، اما برای Image)

### اسلاید / بولت — اصطلاحات رسمی که باید بمانند

| اصطلاح | یک خط |
|--------|--------|
| **Image** | قالب فقط‌خواندنی اپ (لایه‌لایه) |
| **Container** | instance در حال اجرا از یک Image |
| **Dockerfile** | دستورالعمل ساخت Image |
| **Registry** | انبار Imageها (مثلاً Docker Hub) |
| **Volume** | دادهٔ پایدار بیرون از لایه‌های Container |
| **Network** | شبکهٔ مجازی بین Containerها |

### برای فرانت یعنی چه؟

- دیپلوی فرانت = ساخت Image از build استاتیک، نه SSH و کپی دستی `dist`
- محیط staging و production از یک Dockerfile (یا نزدیک به آن) می‌آیند
- وقتی Backend می‌گوید «پورت داخل Container»، یعنی پورت اپ داخل آن باکس — نه لزوماً پورت لپ‌تاپ شما

### مینی‌چک فهم (۱ دقیقه)

از اتاق بپرسید:

> اگر Image را پاک کنیم ولی Container در حال اجرا باشد، معمولاً چه می‌شود؟  
> (پاسخ کوتاه: Container در حال اجرا از لایه‌های Image استفاده می‌کند؛ حذف Image ممکن است تا بعد از stop محدود شود — مهم این است که **منبع حقیقت برای ساخت دوباره Dockerfile/Image است**.)

اگر بحث طول کشید، به پارکینگ ببرید و جلو بروید.

---

## ۳۰–۴۰ دقیقه — Dockerfile ساده + دمو

### اسلاید / بولت

- Dockerfile = دستورات ساخت Image از بالا به پایین
- هر دستور معمولاً یک **لایه (layer)** می‌سازد
- برای فرانت سطح صفر: فایل استاتیک + Image پایهٔ `nginx`

### فایل دمو — `demo/simple/Dockerfile`

```dockerfile
FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

### بگو (روی Dockerfile)

> - `FROM` یعنی از کدام Image پایه شروع می‌کنیم  
> - `COPY` فایل‌های ماشین شما را داخل Image می‌گذارد  
> - `EXPOSE` بیشتر مستندسازی است؛ به‌تنهایی پورت لپ‌تاپ را باز نمی‌کند — `-p` در `docker run` این کار را می‌کند

### دمو زنده

```bash
cd docker/demo/simple
docker build -t fe-docker-simple .
docker run --rm -p 8080:80 fe-docker-simple
```

مرورگر: `http://localhost:8080`

در ترمینال دیگر:

```bash
docker ps
docker images
```

از اتاق بخواهید خروجی `docker ps` را با هم بخوانند: نام Image، پورت `8080->80`، وضعیت `Up`.

### بگو

> `docker build` Image می‌سازد. `docker run` از آن Image یک Container روشن می‌کند. این همان تفاوت کلاس و instance است.

### برای فرانت یعنی چه؟

- حتی بدون Node داخل Image نهایی، می‌توانید `index.html` یا خروجی Vite/Webpack را با nginx سرو کنید
- پورت `8080` روی لپ‌تاپ شماست؛ داخل Container هنوز `80` است

### پاکسازی سریع

```bash
# Ctrl+C روی container foreground، یا:
docker stop <container_id>
```

### جیب دستورات پرکاربرد (۲–۳ دقیقه)

> اگر وقت کم است: همین جدول را روی صفحه بگذارید، یک «بگو» بگویید، و بروید سراغ multi-stage. لیست کامل + Compose/Swarm در [commands.md](./commands.md) است.

| دستور | چه می‌کند | مثال کوتاه |
|--------|-----------|------------|
| `docker pull` | Image از Registry | `docker pull nginx:1.27-alpine` |
| `docker build -t …` | ساخت Image | `docker build -t fe-docker-simple .` |
| `docker images` | لیست Imageها | `docker images` |
| `docker run` | روشن کردن Container | `docker run --rm -p 8080:80 fe-docker-simple` |
| `docker ps` / `ps -a` | لیست در حال اجرا / همه | `docker ps` |
| `docker stop` / `rm` / `rmi` | توقف / پاک Container / پاک Image | `docker stop <id>` |
| `docker logs` | لاگ Container | `docker logs -f <id>` |
| `docker exec -it` | شل داخل Container | `docker exec -it <id> sh` |
| `docker inspect` | جزئیات JSON (مختصر) | `docker inspect <id>` |

فلگ‌های روزمرهٔ `run`: `-p` پورت · `-d` پس‌زمینه · `--rm` پاک بعد از stop · `-v` volume · `--name` نام · `-e` env

### بگو

> این‌ها دستوراتی‌اند که هر روز بهشان برمی‌خورید. امروز در دمو زنده چندتایشان را زدید؛ بقیه را بعداً از چیت‌شیت دوره مرور کنید — لازم نیست الان همه را حفظ کنید.

### برای فرانت یعنی چه؟

- `build` / `run` / `ps` / `logs` چرخهٔ روزانهٔ دیباگ Image فرانت است
- `-p 8080:80` یعنی «روی لپ‌تاپ ۸۰۸۰، داخل Container هنوز ۸۰» — در semipro هم `8081`، advanced `8082`

---

## ۴۰–۵۰ دقیقه — Dockerfile نیمه‌حرفه‌ای (multi-stage)

### اسلاید / بولت — مشکل

اگر Node و `node_modules` و سورس را داخل Image نهایی بگذارید:

- Image بزرگ می‌شود
- سطح حمله بیشتر می‌شود
- چیزهایی که فقط برای build لازم‌اند، در runtime می‌مانند

### راه‌حل: multi-stage build

```text
Stage builder (node):  npm install → npm run build → dist/
Stage runner (nginx):  فقط dist را کپی کن و سرو کن
```

### فایل دمو — `demo/semipro/Dockerfile` (خلاصه روی صفحه)

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY build.js ./
RUN npm run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### بگو

> Stage اول کارخانهٔ build است. Stage دوم ویترین فروشگاه است. مشتری (کاربر نهایی) فقط ویترین را می‌بیند؛ ابزارهای کارخانه داخل Image نهایی نمی‌مانند.

### دمو

```bash
cd docker/demo/semipro
docker build -t fe-docker-semipro .
docker run --rm -p 8081:80 fe-docker-semipro
```

اختیاری اگر وقت بود:

```bash
docker images fe-docker-simple fe-docker-semipro
```

### برای فرانت یعنی چه؟

- الگوی رایج SPA/SSR build: `node` برای build، `nginx` (یا مشابه) برای استاتیک
- در CI همان Dockerfile را می‌زنید؛ «روی سیستم من build شد» کمتر می‌شود
- `COPY --from=builder` یعنی از stage قبلی آرتیفکت بردار، نه از ماشین host

---

## ۵۰–۵۵ دقیقه — Dockerfile پیشرفته (فشرده)

### اسلاید / بولت — سه نکتهٔ طلایی برای فرانت

1. **`.dockerignore`** — مثل `.gitignore` برای context بیلد (`node_modules`, `.git`, …)
2. **ترتیب لایه برای cache** — اول `package.json` / lockfile، بعد سورس؛ تا تغییر کد همیشه `npm install` را نشکند
3. **non-root** — فرایند داخل Container با user غیر root؛ پورت غیرprivileged (مثلاً 8080)

### اشاره به دمو — `demo/advanced/`

روی صفحه نشان دهید (لازم نیست همه خطوط را بخوانید):

- وجود `.dockerignore`
- `USER nginx` و `EXPOSE 8080`
- `HEALTHCHECK` اختیاری

```bash
cd docker/demo/advanced
docker build -t fe-docker-advanced .
docker run --rm -p 8082:8080 fe-docker-advanced
```

### بگو

> اگر وقت کم دارید همین سه بولت کافی است. جزئیات security production (scanning، distroless، cap drop، …) را به پارکینگ و جلسهٔ بعد/DevOps بسپارید.

### برای فرانت یعنی چه؟

- `.dockerignore` اشتباه = بیلد کند و Image چاق (مثلاً کپی شدن `node_modules` میزبان)
- cache خوب = در CI وقتی فقط یک کامپوننت عوض شده، `npm install` دوباره آتش نمی‌گیرد
- non-root = عادت خوب قبل از Kubernetes (آنجا هم securityContext می‌بینید)

---

## ۵۵–۷۰ دقیقه — Docker Compose

### اسلاید / بولت — چرا Compose؟

یک فرانت به‌تنهایی کافی نیست؛ معمولاً:

- API mock یا BFF
- گاهی reverse proxy
- چند Container که باید با هم شبکه داشته باشند

به‌جای چند `docker run` با فلگ‌های طولانی → یک فایل `compose.yaml` (یا `docker-compose.yml`).

### اصطلاحات

| اصطلاح | معنی |
|--------|------|
| **Compose file** | تعریف چند Service در YAML |
| **Service** (در Compose) | یک واحد قابل build/run (معمولاً یک Container از یک Image) |
| **Project** | مجموع Serviceهایی که با هم `up` می‌شوند |

### فایل دمو — `demo/compose/compose.yaml`

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

### بگو

> نام سرویس `api` در شبکهٔ Compose مثل hostname عمل می‌کند. nginx فرانت به `http://api:3000` پروکسی می‌زند؛ شما از مرورگر فقط `localhost:8083` را می‌بینید.

### دمو زنده

```bash
cd docker/demo/compose
docker compose up --build
```

مرورگر: `http://localhost:8083` → دکمهٔ فراخوانی API را بزنید.

در ترمینال دیگر:

```bash
docker compose ps
```

### بگو

> Compose برای **توسعه و دموی چندسرویسه روی یک ماشین** عالی است. برای کلاستر production بزرگ، معمولاً به ارکستراسیون (Swarm یا Kubernetes) می‌روید — ولی مدل ذهنی Service و شبکه همین‌جا شکل می‌گیرد.

### برای فرانت یعنی چه؟

- می‌توانید فرانت + mock API را بدون نصب جداگانهٔ Node API روی میزبان بالا بیاورید
- قرارداد پورت/مسیر (`/api/...`) را مثل محیط واقعی تمرین می‌کنید
- `depends_on` ترتیب استارت را می‌گوید؛ جایگزین health واقعی کامل نیست (در advanced بعداً)

### توقف

```bash
docker compose down
```

دستورات بیشتر Compose (`up -d`, `logs`, `exec`, …): [commands.md](./commands.md).

---

## ۷۰–۸۵ دقیقه — Docker Swarm (مقدمهٔ ارکستراسیون)

### اسلاید / بولت — مشکل بعدی

Compose روی یک ماشین عالی است. وقتی چند ماشین، چند replica، آپدیت بدون downtime و خودترمیمی می‌خواهید → **Container Orchestration**.

```text
Compose  → چند Container روی یک host (عمدتاً)
Swarm    → ارکستراسیون توکار Docker (Cluster سبک)
Kubernetes → ارکستراسیون غالب صنعت (دورهٔ بعدی چپتر)
```

### بگو

> Swarm را امروز به‌عنوان **پل مفهومی به Kubernetes** می‌بینیم، نه به‌عنوان انتخاب نهایی production تیم. مهم این است که بفهمید: شما وضعیت مطلوب را اعلام می‌کنید (مثلاً ۲ replica)، ارکستراتور نگهش می‌دارد.

### اصطلاحات Swarm در حد جلسه

| اصطلاح | یک خط |
|--------|--------|
| **Swarm** | کلاستر Docker در حالت swarm mode |
| **Node** | یک ماشین عضو Swarm |
| **Service** (Swarm) | تعریف مطلوب: کدام Image، چند replica، چه پورت |
| **Task** | یک Container واقعی که برای Service زمان‌بندی شده |
| **Stack** | چند Service تعریف‌شده در یک Compose-like file |

### فایل دمو — `demo/swarm/stack.yaml`

```yaml
version: "3.8"

services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "8084:80"
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure
```

### دمو (اگر وقت و محیط آماده است)

```bash
docker swarm init
cd docker/demo/swarm
docker stack deploy -c stack.yaml fe-swarm
docker stack services fe-swarm
docker service ps fe-swarm_web
```

مرورگر: `http://localhost:8084`

اگر دمو زنده ریسک دارد: YAML را روی صفحه بخوانید و بگویید خروجی مورد انتظار چیست.

### بگو

> `replicas: 2` را در Swarm ببینید؛ در Kubernetes همین ایده را با Deployment می‌بینید. `Service` در K8s معنای شبکه‌ای دارد؛ اینجا Service بیشتر «واحد دیپلوی» است. اسم‌ها شباهت دارند، یکی نیستند — در دورهٔ K8s دقیق می‌شویم.

### برای فرانت یعنی چه؟

- دیپلوی فرانت روی چند instance پشت یک پورت منتشرشده
- اگر یک Task بمیرد، Swarm سعی می‌کند جایش را پر کند (خودترمیمی مقدماتی)
- آمادگی ذهنی برای جلسهٔ Kubernetes: Desired State، replica، Image

### پاکسازی

```bash
docker stack rm fe-swarm
```

---

## ۸۵–۹۰ دقیقه — جمع‌بندی، تکلیف، نظرسنجی

### پنج جمله جمع‌بندی

1. Docker بسته‌بندی و اجرای یکسان اپ را ساده کرد؛ Image قالب است، Container اجراست.
2. Container با VM فرق دارد: سبک‌تر، kernel مشترک، مدل ایزولهٔ متفاوت.
3. Dockerfile ساده → multi-stage → نکات cache/امنیت، مسیر رشد طبیعی برای فرانت است.
4. Compose چند Service را روی یک ماشین با یک فایل بالا می‌آورد.
5. Swarm مقدمهٔ ارکستراسیون است؛ مسیر بعدی چپتر: Kubernetes.

### تکلیف تا بعد از جلسه

جزئیات کامل در [homework.md](./homework.md) — خلاصه برای گفتن:

> از `demo/semipro` یک Image بسازید و اجرا کنید؛ بعد با Compose در `demo/compose` فرانت + API را بالا بیاورید و اسکرین/خروجی بیاورید.  
> چالش اختیاری: یک تغییر کوچک در advanced (مثلاً متن صفحه) + rebuild با توضیح اینکه کدام لایه cache خورد.  
> چیت‌شیت دستورات: [commands.md](./commands.md)

### نظرسنجی (در چت یا فرم)

1. مفید بودن جلسه از ۱ تا ۵
2. آمادگی برای شروع Kubernetes؟ بله / شاید / خیر
3. سخت‌ترین بخش: تاریخچه / VM در برابر Container / Dockerfile / Compose / Swarm
4. محیط: Docker Desktop / Engine لینوکس / هنوز ندارم

### بستن

> جلسهٔ بعد در مسیر چپتر: Kubernetes — همان مدل Desired State را با Pod و Deployment می‌بینید. اگر Docker را امروز قورت داده باشید، آن جلسه خیلی نرم‌تر است.

---

## پارکینگ سوالات

- تفاوت دقیق Image layer با cache mount در BuildKit؟
- Podman / nerdctl به‌جای Docker؟
- چرا بعضی تیم‌ها مستقیم از Compose به Kubernetes می‌روند و Swarm را رد می‌کنند؟
- چطور Image فرانت را به registry خصوصی push کنیم؟
- Distroless و Chainguard برای فرانت؟

---

## ضمیمه — چیت‌شیت Docker این جلسه

مرجع کامل قابل‌چاپ: **[commands.md](./commands.md)** (Image/Container، فلگ‌ها، Compose، Swarm کوتاه).

```bash
docker version
docker pull <image>
docker build -t <name> .
docker images
docker run --rm -d --name <n> -p HOST:CONTAINER -e KEY=val -v … <image>
docker ps
docker ps -a
docker logs <container>
docker exec -it <container> sh
docker inspect <container>
docker stop <container>
docker rm <container>
docker rmi <image>

docker compose up --build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose exec <service> sh
docker compose down

docker swarm init
docker stack deploy -c stack.yaml <name>
docker stack services <name>
docker service ls
docker service ps <stack>_<service>
docker stack rm <name>
```

## ضمیمه — عیب‌یابی سریع دمو

| علامت | احتمال | کار بعدی |
|--------|---------|----------|
| `docker: command not found` | Engine/Desktop نصب نیست یا PATH | نصب / باز کردن Docker Desktop |
| build کند / context بزرگ | نبود `.dockerignore` | فایل ignore را چک کنید |
| `npm` در build fail | شبکه یا package.json | لاگ build را بخوانید |
| صفحه سفید روی پورت | mapping پورت اشتباه | `docker ps` و `-p` را چک کنید |
| Compose: API از فرانت نمی‌آید | نام سرویس / proxy | `default.conf` و نام `api` |
| Swarm: سرویس 0/2 | swarm init نشده / پورت اشغال | `docker info`, `service ps` |
