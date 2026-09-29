# چیت‌شیت دستورات پرکاربرد Docker — چپتر فرانت

مرجع قابل‌چاپ / قابل‌اشتراک بعد از جلسه. در ارائهٔ زنده فقط جدول‌های کوتاه داخل [session-01.md](./session-01.md) را نشان دهید؛ جزئیات اینجا بماند.

**پورت‌های دمو این دوره:** simple `8080` · semipro `8081` · advanced `8082` · compose `8083` · swarm `8084`

---

## Image و Container

| دستور | چه می‌کند | مثال (هم‌راستا با دمو) | نکته برای فرانت |
|--------|-----------|-------------------------|-----------------|
| `docker pull` | Image را از Registry می‌گیرد | `docker pull nginx:1.27-alpine` | قبل از جلسه برای کش کردن پایه مفید است |
| `docker build` | از Dockerfile یک Image می‌سازد | `docker build -t fe-docker-simple .` | `-t` نام/تگ Image است؛ `.` = context بیلد |
| `docker images` / `docker image ls` | لیست Imageهای محلی | `docker images` | بعد از build چک کنید Image ساخته شده |
| `docker run` | از Image یک Container روشن می‌کند | `docker run --rm -p 8080:80 fe-docker-simple` | بدون `-p` صفحه را روی لپ‌تاپ نمی‌بینید |
| `docker ps` | Containerهای در حال اجرا | `docker ps` | پورت `8080->80` و وضعیت `Up` را بخوانید |
| `docker ps -a` | همهٔ Containerها (حتی متوقف) | `docker ps -a` | برای پیدا کردن id بعد از stop |
| `docker stop` | Container را متوقف می‌کند | `docker stop <id>` | جایگزین Ctrl+C وقتی با `-d` اجرا کرده‌اید |
| `docker rm` | Container متوقف‌شده را پاک می‌کند | `docker rm <id>` | با `--rm` در `run` خودکار پاک می‌شود |
| `docker rmi` | Image را پاک می‌کند | `docker rmi fe-docker-simple` | اگر Container هنوز به آن وصل است، اول stop/rm |
| `docker logs` | لاگ stdout/stderr Container | `docker logs -f <id>` | برای فرانت پشت nginx یا API داخل Compose طلایی است |
| `docker exec -it` | داخل Container در حال اجرا شل باز می‌کند | `docker exec -it <id> sh` | روی alpine معمولاً `sh` نه `bash` |
| `docker inspect` | JSON جزئیات Image/Container | `docker inspect <id>` | برای دیباگ پورت، env، mount — مختصر نگه دارید |

### فلگ‌های پرکاربرد `docker run`

| فلگ | چه می‌کند | مثال | نکته برای فرانت |
|------|-----------|------|-----------------|
| `-p` | پورت میزبان:پورت داخل Container | `-p 8080:80` | چپ = لپ‌تاپ شما، راست = داخل Container |
| `-d` | اجرا در پس‌زمینه (detached) | `docker run -d -p 8080:80 …` | ترمینال آزاد می‌ماند؛ با `ps` / `logs` مدیریت کنید |
| `--rm` | بعد از stop، Container پاک شود | `docker run --rm -p 8080:80 …` | برای دموی کوتاه عالی است؛ state نمی‌ماند |
| `-v` | Volume / bind mount | `-v $(pwd)/dist:/usr/share/nginx/html:ro` | برای hot-serve لوکال؛ در production با احتیاط |
| `--name` | نام ثابت برای Container | `--name fe-simple` | به‌جای id تصادفی؛ برای `logs` / `stop` راحت‌تر |
| `-e` | متغیر محیطی | `-e NODE_ENV=production` | برای فرانتِ SSR یا API؛ secret را hardcode نکنید |

### الگوی کامل دموی simple

```bash
cd docker/demo/simple
docker build -t fe-docker-simple .
docker run --rm --name fe-simple -p 8080:80 fe-docker-simple
# مرورگر: http://localhost:8080
```

پورت‌های هم‌خانواده:

```bash
# semipro
docker run --rm -p 8081:80 fe-docker-semipro

# advanced (داخل Container پورت 8080 است)
docker run --rm -p 8082:8080 fe-docker-advanced
```

---

## Docker Compose

از پوشهٔ دارای `compose.yaml` (این دوره: `docker/demo/compose`).

| دستور | چه می‌کند | مثال | نکته برای فرانت |
|--------|-----------|------|-----------------|
| `docker compose up` | Serviceها را بالا می‌آورد | `docker compose up` | لاگ هر دو سرویس در foreground |
| `docker compose up -d` | همان، در پس‌زمینه | `docker compose up -d` | بعداً با `logs` / `ps` دنبال کنید |
| `docker compose up --build` | قبل از up دوباره build می‌کند | `docker compose up --build` | بعد از تغییر Dockerfile/سورس دمو |
| `docker compose ps` | وضعیت Serviceهای پروژه | `docker compose ps` | باید `web` و `api` Up باشند |
| `docker compose logs` | لاگ Serviceها | `docker compose logs -f api` | وقتی دکمهٔ API جواب نمی‌دهد اول اینجا |
| `docker compose down` | Serviceها را پایین می‌آورد | `docker compose down` | شبکهٔ پروژه را هم برمی‌دارد |
| `docker compose exec` | دستور داخل Service در حال اجرا | `docker compose exec web sh` | مثل `docker exec` ولی با نام Service |

### الگوی دموی Compose این جلسه

```bash
cd docker/demo/compose
docker compose up --build
# مرورگر: http://localhost:8083
docker compose ps
docker compose down
```

---

## Swarm (اختیاری — هم‌راستا با دمو)

| دستور | چه می‌کند | مثال | نکته برای فرانت |
|--------|-----------|------|-----------------|
| `docker swarm init` | این ماشین را Manager Swarm می‌کند | `docker swarm init` | یک‌بار کافی است؛ برای دموی تک‌ماشین |
| `docker stack deploy` | Stack را از فایل YAML دیپلوی می‌کند | `docker stack deploy -c stack.yaml fe-swarm` | پورت دمو: `8084` |
| `docker service ls` / `docker stack services` | لیست Serviceها | `docker stack services fe-swarm` | replicas مطلوب در برابر واقعی |
| `docker stack rm` | Stack را برمی‌دارد | `docker stack rm fe-swarm` | پاکسازی پایان دمو |

```bash
docker swarm init
cd docker/demo/swarm
docker stack deploy -c stack.yaml fe-swarm
docker stack services fe-swarm
# مرورگر: http://localhost:8084
docker stack rm fe-swarm
```

---

## ترتیب ذهنی سریع (برای مرور)

```text
pull / build  →  Image روی دیسک
run / compose up / stack deploy  →  Container(ها) روشن
ps / logs / exec  →  مشاهده و دیباگ
stop / rm / down / stack rm  →  پاکسازی
```

---

## لینک‌های مرتبط

- اسکریپت ارائه: [session-01.md](./session-01.md)
- کنداکتور: [00-conductor.md](./00-conductor.md)
- آناتومی Dockerfile: [dockerfile-anatomy.md](./dockerfile-anatomy.md)
- آناتومی Compose: [compose-anatomy.md](./compose-anatomy.md)
- آناتومی Stack: [stack-anatomy.md](./stack-anatomy.md)
- شبکه: [networking.md](./networking.md)
- تکلیف: [homework.md](./homework.md)
- دموها: [demo/](./demo/)
