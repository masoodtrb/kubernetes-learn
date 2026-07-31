# تکالیف عملی — دوره Kubernetes چپتر فرانت

هدف تکالیف: تمرین کوتاه بین جلسات تا در جلسه بعد review سریع داشته باشیم، نه پروژه سنگین.

**قانون کلی:** هر تکلیف اجباری باید در **کمتر از ۹۰ دقیقه** قابل انجام باشد.

---

## تکلیف A — بعد از جلسه ۱ (قبل از جلسه ۲)

### هدف

همان دمو جلسه را روی کلاستر لوکال خودتان اجرا کنید و ثابت کنید Podها Running هستند و Service Endpoint دارد.

### پیش‌نیاز

یکی از این محیط‌ها:

| محیط | مناسب وقتی که… |
|------|----------------|
| Docker Desktop → Kubernetes | از قبل Docker Desktop دارید |
| Minikube | می‌خواهید کلاستر جدا و ساده |
| Kind | با Docker راحتید و کلاستر سبک می‌خواهید |

نصب دقیق ابزارها وابسته به OS شماست؛ اگر گیر کردید در کانال چپتر بپرسید (Helper جلسه می‌تواند کمک کند).

### مراحل اجباری

1. مطمئن شوید کلاستر آماده است:

```bash
kubectl get nodes
```

حداقل یک Node با `Ready`.

2. دو فایل YAML جلسه ۱ را بسازید (`frontend-deployment.yaml` و `frontend-service.yaml`) — می‌توانید عیناً از [session-01.md](./session-01.md) کپی کنید.

3. اعمال کنید:

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

4. وضعیت را بگیرید:

```bash
kubectl get all -l app=frontend-demo
kubectl get endpoints frontend-demo
```

5. با port-forward صفحه را باز کنید:

```bash
kubectl port-forward svc/frontend-demo 8080:80
```

مرورگر: `http://localhost:8080`

### معیار پذیرش (Definition of Done)

تکلیف قبول است اگر **همه** موارد زیر را داشته باشید:

- [ ] خروجی `kubectl get nodes` (حداقل یک Ready)
- [ ] خروجی `kubectl get all -l app=frontend-demo` که Deployment، ReplicaSet/Podها و Service را نشان دهد
- [ ] حداقل ۲ Pod در وضعیت `Running` (اگر replicas=2 گذاشته‌اید)
- [ ] خروجی `kubectl get endpoints frontend-demo` خالی نباشد
- [ ] یک اسکرین‌شات یا توضیح یک‌خطی که port-forward کار کرده (صفحه nginx دیده شده)

خروجی‌ها را در کانال تکلیف / PR / پیام به presenter بفرستید — هر روشی که چپتر توافق کرده.

### چالش اختیاری (پیشنهادی)

حداقل یکی را انجام دهید:

1. **Scale:** replicas را به ۳ برسانید (`kubectl scale` یا تغییر YAML + apply) و خروجی `get pods` را بفرستید.
2. **خودترمیمی:** یک Pod را delete کنید و نشان دهید Pod جدید ساخته می‌شود.
3. **Label اضافه:** یک label مثل `tier=frontend` به template اضافه کنید؛ Service را نشکنید (selector اصلی `app=frontend-demo` بماند).

### اگر محیط ندارید

تا جلسه ۲:

- حداقل YAMLها را در یک gist/فایل آماده کنید
- در نظرسنجی بگویید «محیط ندارم» تا Helper برای نصب گروهی وقت بگذارد

---

## تکلیف B — بعد از جلسه ۲ (قبل از جلسه ۳)

> این تکلیف بعد از برگزاری جلسه ۲ معنی کامل دارد. اگر جلسه ۲ برگزار نشد، انجام ندهید.

### هدف

اپ را از بیرون (یا شبیه بیرون) در دسترس کنید و یک تنظیم را با ConfigMap تزریق کنید.

### مراحل پیشنهادی

1. همان `frontend-demo` را نگه دارید یا دوباره apply کنید.
2. یک `ConfigMap` بسازید که مثلاً مقدار `APP_MESSAGE=hello-from-config` داشته باشد.
3. Deployment را طوری عوض کنید که این مقدار به عنوان env به container برسد (برای nginx ساده: می‌توانید یک container sidecar یا Image سفارشی استفاده کنید؛ اگر فقط nginx خالص دارید، کافی است ConfigMap را بسازید و در جلسه ۳ روش mount را review کنید).

**مسیر ساده‌تر پیشنهادی برای فرانت‌کارها:**

- یک Image خیلی ساده Node/nginx که یک env را در پاسخ نشان دهد، یا
- طبق نمونه جلسه ۲ (وقتی نهایی شد) پیش بروید.

4. یک `Ingress` یا در محیط لوکال `minikube service` / `LoadBalancer` / port-forward مستندشده برای دسترسی.

### معیار پذیرش

- [ ] ConfigMap در کلاستر وجود دارد (`kubectl get configmap`)
- [ ] Deployment به ConfigMap وصل است (env یا volume) — در `describe deployment` یا YAML مشخص است
- [ ] راه دسترسی HTTP مستند شده (Ingress آدرس / یا دستور port-forward)
- [ ] توضیح ۳–۵ خطی: تفاوت Secret و ConfigMap از نظر خودتان

### چالش اختیاری

- یک Secret برای مقدار جعلی API key بسازید و به env وصل کنید (مقدار واقعی production نگذارید).

---

## تکلیف C — جمع‌بندی بعد از جلسه ۳ (اختیاری دوره)

### هدف

یک سناریوی نزدیک به واقعی برای فرانت:

1. Deployment با `readinessProbe` و `livenessProbe` ساده
2. Scale دستی به ۲ یا ۳
3. (اختیاری) یک Helm chart خیلی کوچک یا کپی از chart نمونه جلسه

### معیار پذیرش

- [ ] Probeها در YAML هستند و Podها Ready می‌شوند
- [ ] توضیح کوتاه: اگر readiness رد شود برای Service چه می‌شود؟
- [ ] لینک یا فایل نهایی YAML/chart

---

## قالب گزارش تکلیف (کپی کنید)

```text
نام:
جلسه مربوطه: ۱ / ۲ / ۳
محیط: Docker Desktop / Minikube / Kind / سایر
دستورات کلیدی که زدم:
خروجی‌ها (paste یا اسکرین):
مشکل‌هایی که خوردم:
چالش اختیاری: زدم / نزدم — شرح:
سوال برای جلسه بعد:
```

---

## نکات ایمنی و دامنه

- روی کلاستر production شرکت بدون هماهنگی چیزی apply نکنید؛ فقط لوکال یا namespace تمرینی.
- Secret واقعی (توکن، پسورد) را در چت عمومی نگذارید.
- Imageهای عمومی (`nginx`) برای تمرین کافی‌اند؛ اجبار به build فرانت خودتان نیست مگر بخواهید.
