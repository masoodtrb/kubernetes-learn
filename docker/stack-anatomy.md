# آناتومی Stack file — اجزای `stack.yaml` در Swarm

مرجع کوتاه برای دموی ارکستراسیون سبک. **Swarm مقدمه است، نه راهنمای production.**

**فایل دمو:** [demo/swarm/stack.yaml](./demo/swarm/stack.yaml)

نام فایل در عمل اغلب همان شکل Compose است (`stack.yaml` / `compose-stack.yaml`)؛ تفاوت اصلی در **نحوهٔ دیپلوی** و کلید **`deploy`** است.

---

## مدل ذهنی یک خطی

```text
stack.yaml  →  docker stack deploy  →  Swarm Service(ها)
replicas: N  →  N تا Task (معمولاً N Container)
```

شما **Desired State** می‌نویسید؛ Swarm سعی می‌کند همان را نگه دارد.

---

## شباهت با Compose

بسیاری از کلیدها آشنا هستند:

| کلید | نقش (مثل Compose) | در دمو Swarm |
|------|-------------------|--------------|
| `services` | تعریف واحدهای دیپلوی | `web` |
| `image` | کدام Image | `nginx:1.27-alpine` |
| `ports` | publish پورت | `"8084:80"` |
| `environment` / `volumes` / … | مثل Compose | در دموی مینیمال نیست |

تفاوت مهم:

| موضوع | `docker compose up` | `docker stack deploy` |
|--------|---------------------|------------------------|
| موتور | Compose روی Docker Engine | Swarm mode |
| `build:` در فایل | رایج و پشتیبانی‌شده | معمولاً Image از قبل build/push شده باشد |
| `deploy:` | اغلب اثر کامل ندارد | اینجا معنی دارد |

---

## کلیدهای Swarmمحور زیر `deploy`

| کلید | چه می‌کند | مثال دمو | برای فرانت یعنی چه؟ |
|------|-----------|----------|---------------------|
| `deploy.replicas` | چند نسخهٔ همزمان از Service | `replicas: 2` | دو instance پشت همان پورت منتشرشده |
| `deploy.restart_policy` | کی ری‌استارت شود | `condition: on-failure` | اگر Task بمیرد، Swarm جایش را پر می‌کند |
| `deploy.restart_policy.delay` / `max_attempts` | فاصله و سقف تلاش | — | در intro لازم نیست باز شود |
| `deploy.update_config` | رفتار rolling update | — | شبیه ایدهٔ RollingUpdate در K8s |
| `deploy.placement` | محدودیت Node | — | برای دموی تک‌ماشین لازم نیست |
| `deploy.resources` | حد CPU/RAM | — | پارکینگ |
| `deploy.labels` | برچسب روی Service | — | پارکینگ |

### `restart_policy.condition` — مقادیر رایج

| مقدار | معنی کوتاه |
|--------|------------|
| `none` | ری‌استارت خودکار نکن |
| `on-failure` | فقط اگر با خطا خارج شد |
| `any` | هر بار که متوقف شد |

---

## فایل دمو — خط‌به‌خط

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

| بلوک | معنی |
|------|------|
| `version: "3.8"` | فرمت فایل Compose/Stack قدیمی‌تر؛ برای stack deploy هنوز دیده می‌شود |
| `image:` (نه `build:`) | Image آماده از Registry/کش محلی |
| `ports: "8084:80"` | پورت دموی Swarm این دوره |
| `deploy.replicas: 2` | دو Task — ایدهٔ Desired State |
| `restart_policy` | خودترمیمی مقدماتی |

---

## اصطلاحات کنار فایل

| اصطلاح | یک خط |
|--------|--------|
| **Stack** | چند Service که با یک فایل دیپلوی می‌شوند |
| **Service** (Swarm) | تعریف مطلوب Image + replicas + … |
| **Task** | یک واحد زمان‌بندی‌شده (معمولاً یک Container) |
| **Node** | ماشین عضو Swarm |

> در Kubernetes کلمهٔ **Service** معنای شبکه‌ای دارد؛ اینجا Service بیشتر «واحد دیپلوی» است. اسم‌ها شبیه، یکی نیستند.

---

## دستورات دمو

```bash
docker swarm init
cd docker/demo/swarm
docker stack deploy -c stack.yaml fe-swarm
docker stack services fe-swarm
docker service ps fe-swarm_web
# مرورگر: http://localhost:8084
docker stack rm fe-swarm
```

---

## Overlay (فقط اشاره)

روی چند Node، Swarm معمولاً از **overlay network** برای ارتباط Serviceها استفاده می‌کند. در دموی تک‌ماشین لازم نیست عمیق شوید؛ برای فرانت همین کافی است بدانید: «کلاستر شبکهٔ خودش را بین Nodeها پهن می‌کند.» جزئیات بیشتر → دورهٔ Kubernetes / networking پیشرفته.

شبکهٔ روزمرهٔ Compose: [networking.md](./networking.md).

---

## لینک‌های مرتبط

- جلسه: [session-01.md](./session-01.md)
- Compose: [compose-anatomy.md](./compose-anatomy.md)
- Dockerfile: [dockerfile-anatomy.md](./dockerfile-anatomy.md)
- دمو: [demo/swarm/](./demo/swarm/)
