# آموزش Kubernetes برای چپتر فرانت

مجموعه داکیومنت برای ارائهٔ زنده، همراه تکلیف عملی.

## مسیر پیشنهادی یادگیری

1. **اول Docker** — پوشهٔ [`docker/`](./docker/) (جلسهٔ حدود ۹۰ دقیقه‌ای: تاریخچه، VM در برابر Container، Dockerfile، Compose، Swarm)
2. **بعد Kubernetes** — فایل‌های ریشهٔ همین ریپو (جلسهٔ اول حدود ۶۰ دقیقه + اسکلت جلسات بعد)

بدون Docker، جلسهٔ Kubernetes فرض می‌کند مخاطب مفهوم Container / Image را می‌داند.

---

## دوره Docker (پیش‌نیاز)

برای ارائه‌دهنده:

1. [docker/00-conductor.md](./docker/00-conductor.md)
2. [docker/session-01.md](./docker/session-01.md)
3. [docker/homework.md](./docker/homework.md)
4. دموها: [docker/demo/](./docker/demo/)

جزئیات بیشتر: [docker/README.md](./docker/README.md)

---

## دوره Kubernetes

### برای ارائه‌دهنده — از کجا شروع کنید؟

1. [00-conductor.md](./00-conductor.md) را یک‌بار کامل بخوانید (پیش‌نیاز، تایم‌باکس، معیار ادامه).
2. جلسه را از روی [session-01.md](./session-01.md) جلو ببرید؛ همان فایل اسکریپت ارائه است.
3. پایان جلسه تکلیف را از [homework.md](./homework.md) اعلام کنید.
4. اگر نظرسنجی مثبت بود، اسکلت [session-02-outline.md](./session-02-outline.md) و بعد [session-03-outline.md](./session-03-outline.md) را به اسکریپت کامل تبدیل کنید.

### فهرست فایل‌ها

| فایل | نقش |
|------|------|
| [00-conductor.md](./00-conductor.md) | کنداکتور کل دوره، چک‌لیست آماده‌سازی، معیار برگزاری جلسه ۲ |
| [session-01.md](./session-01.md) | ارائه کامل جلسه ۱ با تایم‌باکس ۶۰ دقیقه + YAML و kubectl |
| [session-02-outline.md](./session-02-outline.md) | اسکلت جلسه ۲: Service، Ingress، ConfigMap/Secret |
| [session-03-outline.md](./session-03-outline.md) | اسکلت جلسه ۳: Scale، Health، Helm/الگوی واقعی |
| [homework.md](./homework.md) | تکالیف بین جلسات با معیار پذیرش |

### فرض‌های طراحی

- مخاطب: فرانت‌اند — تئوری کم، دمو و مدل ذهنی زیاد
- اصطلاحات رسمی انگلیسی (`Pod`, `Deployment`, …) حفظ می‌شوند؛ توضیح به فارسی است
- جلسه ۱ کوبرنتیز بعد از Docker نرم‌تر است؛ جلسات ۲ و ۳ وابسته به بازخورد جلسه‌اند

### محیط پیشنهادی دمو

**Docker:** Docker Desktop یا Engine + Compose (`docker version`).

**Kubernetes** — یکی از این‌ها کافی است:

- Docker Desktop با Kubernetes
- Minikube
- Kind

قبل از ارائهٔ K8s: `kubectl get nodes` باید Node با وضعیت `Ready` نشان دهد.

## مجوز استفاده در چپتر

این مطالب برای ارائه داخلی چپتر آماده شده‌اند؛ می‌توانید YAMLها را عیناً کپی و برای تمرین لوکال استفاده کنید. روی کلاستر production بدون هماهنگی اعمال نکنید.
