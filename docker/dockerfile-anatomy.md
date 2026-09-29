# آناتومی Dockerfile — اجزا و معنی هر دستور

مرجع pedagogیک برای چپتر فرانت. در جلسه فقط دستورات مربوط به دمو را باز کنید؛ بقیه را بعداً مرور کنید.

**دموهای مرتبط:** [simple](./demo/simple/) · [semipro](./demo/semipro/) · [advanced](./demo/advanced/) · [compose](./demo/compose/)

**اصطلاح رسمی انگلیسی می‌ماند؛ توضیح فارسی است.**

---

## مدل ذهنی یک خطی

```text
Dockerfile  →  docker build  →  Image (لایه‌لایه)
Image       →  docker run    →  Container
```

هر دستور معمولاً یک **layer** می‌سازد. ترتیب مهم است: لایه‌های پایدار بالا، چیزهای پرتغییر پایین‌تر → cache بهتر.

---

## دستورات پایه (تقریباً در هر Dockerfile فرانت)

| دستور | چه می‌کند | مثال | برای فرانت یعنی چه؟ |
|--------|-----------|------|---------------------|
| `FROM` | Image پایه را مشخص می‌کند | `FROM nginx:1.27-alpine` | نقطهٔ شروع: nginx برای استاتیک، یا `node` برای build |
| `WORKDIR` | پوشهٔ کاری داخل Image | `WORKDIR /app` | مثل `cd` دائمی؛ مسیرهای بعدی نسبی‌اند |
| `COPY` | فایل از **context بیلد** → داخل Image | `COPY index.html /usr/share/nginx/html/` | سورس / `dist` / `package.json` را داخل Image می‌گذارید |
| `ADD` | مثل `COPY` + قابلیت‌های اضافه (URL، auto-extract tar) | معمولاً پرهیز کنید | برای فرانت معمولاً `COPY` کافی و واضح‌تر است |
| `RUN` | فرمان را **هنگام build** اجرا می‌کند | `RUN npm install --omit=dev` | `npm ci` / build / chown — نتیجه داخل لایه می‌ماند |
| `ENV` | متغیر محیطی در Image/Container | `ENV PORT=3000` | پورت، `NODE_ENV`، تنظیمات غیرsecret |
| `EXPOSE` | مستندسازی پورت داخل Container | `EXPOSE 80` | به‌تنهایی پورت لپ‌تاپ را باز نمی‌کند؛ `-p` یا `ports:` در Compose این کار را می‌کند |
| `USER` | کاربر فرایند بعدی | `USER nginx` / `USER node` | non-root عادت خوب قبل از K8s |
| `CMD` | فرمان پیش‌فرض **شروع Container** | `CMD ["node", "mock-api.js"]` | اگر Container بدون دستور اضافه روشن شود، این اجرا می‌شود |
| `ENTRYPOINT` | نقطهٔ ورود ثابت‌تر Container | `ENTRYPOINT ["nginx", "-g", "daemon off;"]` | با `CMD` ترکیب می‌شود؛ جزئیات را در پارکینگ بگذارید مگر سوال بیاید |

### `CMD` در برابر `ENTRYPOINT` (یک جمله)

- **`CMD`**: پیش‌فرض قابل‌جایگزینی در `docker run … <command>`
- **`ENTRYPOINT`**: «همیشه این باینری را اجرا کن»؛ آرگومان‌های `run` معمولاً به آن اضافه می‌شوند
- برای دموهای این دوره: nginx Image پایه خودش ENTRYPOINT/CMD دارد؛ در `Dockerfile.api` فقط `CMD` صریح می‌بینید

---

## Multi-stage و انتقال آرتیفکت

| دستور / الگو | چه می‌کند | مثال در دمو | برای فرانت یعنی چه؟ |
|---------------|-----------|-------------|---------------------|
| `FROM … AS name` | stage را نام‌گذاری می‌کند | `FROM node:22-alpine AS build` در semipro/advanced | کارخانهٔ build جدا از ویترین runtime |
| `COPY --from=name` | از stage دیگر (یا Image دیگر) کپی می‌کند | `COPY --from=build /app/dist …` | فقط `dist` به nginx می‌رود؛ Node و `node_modules` در Image نهایی نیستند |

```text
Stage build (node):   install → build → /app/dist
Stage final (nginx):  COPY --from=build  →  فقط فایل‌های استاتیک
```

نام stage در semipro/advanced این دوره: **`build`** (نه `builder`). در اسلاید هر نامی بگذارید؛ مهم این است که `--from=` همان نام باشد.

---

## دستورات سطح بالاتر (دمو advanced و API)

| دستور | چه می‌کند | کجا در دموها | نکته |
|--------|-----------|--------------|------|
| `ARG` | متغیر **فقط زمان build** | در دموهای فعلی عمداً نیست | برای `NODE_VERSION` یا فلگ CI؛ با `ENV` اشتباه نشود |
| `HEALTHCHECK` | Docker به‌صورت دوره‌ای سلامت را چک می‌کند | [advanced/Dockerfile](./demo/advanced/Dockerfile) | Swarm/Compose می‌توانند روی آن تکیه کنند؛ جایگزین monitoring کامل نیست |
| `.dockerignore` | فایل‌هایی که وارد **build context** نمی‌شوند | semipro + advanced | مثل `.gitignore`؛ جلوی کپی `node_modules` / `.git` را می‌گیرد |

### `ARG` در برابر `ENV` (یک خط)

| | زمان حیات | دیده می‌شود در Container در حال اجرا؟ |
|--|-----------|----------------------------------------|
| `ARG` | فقط build | مگر به `ENV` پاس بدهید |
| `ENV` | Image + runtime | بله |

---

## نگاشت به دموهای این دوره

### simple — حداقل ممکن

```dockerfile
FROM nginx:1.27-alpine
COPY index.html /usr/share/nginx/html/index.html
EXPOSE 80
```

دستورات درگیر: `FROM`, `COPY`, `EXPOSE`.

### semipro — multi-stage

دستورات درگیر: `FROM … AS build`, `WORKDIR`, `COPY`, `RUN`, `COPY --from=build`, `EXPOSE`.

### advanced — امنیت و سلامت

علاوه بر multi-stage: `RUN` برای chown، `USER nginx`, `EXPOSE 8080`, `HEALTHCHECK`, به‌علاوه `.dockerignore`.

### compose — `Dockerfile.api`

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY mock-api.js ./
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "mock-api.js"]
```

اینجا `ENV` + `USER` + `CMD` را زنده می‌بینید.

---

## ترتیب پیشنهادی لایه‌ها (فرانت SPA)

1. `FROM` پایهٔ builder
2. `WORKDIR`
3. `COPY` فقط `package.json` (+ lockfile اگر دارید)
4. `RUN npm install` / `npm ci`
5. `COPY` سورس
6. `RUN` build
7. `FROM` پایهٔ runner
8. `COPY --from=…` آرتیفکت
9. `USER` / `EXPOSE` / `HEALTHCHECK` / `CMD` در صورت نیاز

---

## لینک‌های مرتبط

- اسکریپت جلسه: [session-01.md](./session-01.md)
- Compose: [compose-anatomy.md](./compose-anatomy.md)
- شبکه: [networking.md](./networking.md)
- چیت‌شیت CLI: [commands.md](./commands.md)
