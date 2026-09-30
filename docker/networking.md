# شبکه در Docker — مدل ذهنی برای فرانت

هدف: بفهمید Container چطور به هم و به لپ‌تاپ شما وصل می‌شود — بدون غرق شدن در CNI و iptables.

**دموی اصلی:** [demo/compose/](./demo/compose/) — `web` → `http://api:3000`

---

## سه سؤال که باید جوابشان را بلد باشید

1. از **مرورگر من** چطور به Container برسم؟ → معمولاً `ports` / `-p`
2. از **یک Container** چطور به Container دیگر برسم؟ → شبکهٔ مشترک + **نام Service به‌عنوان hostname**
3. آیا `EXPOSE` پورت لپ‌تاپ را باز می‌کند؟ → **خیر**

---

## انواع شبکهٔ رایج (سطح جلسه)

| نوع | کی ساخته می‌شود | چه حسی دارد | برای فرانت |
|-----|-----------------|-------------|------------|
| **default bridge** | پیش‌فرض Engine (`bridge`) | Containerها روی یک bridge عمومی؛ DNS نام‌دار ضعیف‌تر/قدیمی‌تر | `docker run` تکی بدون `--network` |
| **user-defined bridge** | `docker network create` یا **خودکار توسط Compose** | DNS داخلی: نام Container/Service resolve می‌شود | الگوی درست برای چند سرویس |
| **host** | `--network host` | شبکهٔ Container = شبکهٔ میزبان | کمتر برای دموی فرانت؛ دیباگ خاص |
| **none** | `--network none` | بدون شبکه | تقریباً هرگز برای وب‌اپ |
| **overlay** | Swarm / چند host | شبکه روی چند Node | فقط اشاره در بخش Swarm |

برای این دوره روی **user-defined bridge (شبکهٔ پروژهٔ Compose)** تمرکز کنید.

---

## Compose: شبکهٔ پروژه و DNS

وقتی `docker compose up` می‌زنید:

```text
Project network (user-defined bridge)
 ├── web   (hostname: web)
 └── api   (hostname: api)   ← پورت داخلی 3000
```

- نام Service در `compose.yaml` → **hostname** داخل همان شبکه
- فرانت/nginx به `http://api:3000` حرف می‌زند، نه `localhost:3000`
- `localhost` داخل Container یعنی **همان Container**، نه لپ‌تاپ شما و نه سرویس کناری

### نگاشت به دمو

| از کجا | به کجا | آدرس |
|--------|--------|------|
| مرورگر روی لپ‌تاپ | nginx در `web` | `http://localhost:8083` (`ports: "8083:80"`) |
| nginx در `web` | Node در `api` | `http://api:3000` (DNS سرویس + `expose`) |

`depends_on` فقط ترتیب استارت را نزدیک می‌کند؛ جایگزین «API حتماً ready است» نیست.

---

## `ports` در برابر `expose` در برابر `EXPOSE`

| مکانیزم | کجا نوشته می‌شود | اثر |
|---------|------------------|-----|
| `EXPOSE` در Dockerfile | Image | مستندسازی؛ metadata |
| `expose:` در Compose | Service | پورت روی شبکهٔ داخلی؛ از میزبان publish نمی‌شود |
| `ports:` / `docker run -p` | Compose یا CLI | **publish** به پورت میزبان — مرورگر می‌بیند |

```text
مرورگر ──► localhost:8083 ──► (ports) ──► web:80
                                              │
                                              └── proxy ──► api:3000  (شبکهٔ Compose)
```

---

## `docker run` تکی بدون Compose

```bash
docker run --rm -p 8080:80 fe-docker-simple
```

- `-p 8080:80` = چپ میزبان، راست Container
- بدون user-defined network، وصل کردن دو Container با نام قشنگ سخت‌تر است → برای چند سرویس، Compose را ترجیح دهید

---

## host و none (اشارهٔ ۳۰ ثانیه‌ای)

- **host:** پورت Container مستقیماً روی میزبان است؛ mapping `-p` معنی معمول را از دست می‌دهد. برای معرفی فرانت لازم نیست دمو کنید.
- **none:** ایزولهٔ کامل شبکه؛ اپ وب معمولاً بدرد نمی‌خورد.

---

## Swarm / overlay (یک پاراگراف)

وقتی چند Node دارید، Swarm برای حرف زدن Serviceها روی ماشین‌های مختلف از **overlay** استفاده می‌کند. در دموی تک‌ماشین `stack.yaml` همان ایدهٔ `ports` و replica را می‌بینید؛ عمیق شدن در overlay را به بعد از شروع Kubernetes موکول کنید.

جزئیات فایل Stack: [stack-anatomy.md](./stack-anatomy.md).

---

## عیب‌یابی سریع شبکه (فرانت)

| علامت | احتمال | کار بعدی |
|--------|---------|----------|
| صفحه روی `localhost:8083` نمی‌آید | `ports` اشتباه / Container پایین | `docker compose ps` |
| UI هست ولی API خطا می‌دهد | proxy به hostname غلط | در conf باید `api` باشد نه `localhost` |
| از داخل `web` به API نمی‌رسد | شبکهٔ جدا / نام سرویس | هر دو باید در یک پروژه Compose باشند |
| گیج شدن با `localhost` | localhost داخل Container | از نام Service استفاده کنید |

---

## لینک‌های مرتبط

- آناتومی Compose: [compose-anatomy.md](./compose-anatomy.md)
- جلسه: [session-01.md](./session-01.md)
- دمو: [demo/compose/compose.yaml](./demo/compose/compose.yaml)
