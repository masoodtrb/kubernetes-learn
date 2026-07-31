# جلسه ۳ — اسکلت: Scale، Health، مقدمات Helm / الگوی واقعی

**وضعیت:** Outline — بعد از جلسه ۲ و بازخورد شرکت‌کنندگان نهایی شود.  
**مدت پیشنهادی:** ۶۰ دقیقه  
**پیش‌نیاز:** جلسات ۱ و ۲ + آشنایی با YAMLهای Deployment/Service

---

## هدف یادگیری

تا پایان جلسه شرکت‌کننده بتواند:

1. تفاوت scale دستی و ایده autoscaling را بگوید (بدون غرق شدن در HPA پیشرفته)
2. `readinessProbe` و `livenessProbe` را در YAML بخواند و بداند هر کدام چه اثری دارد
3. بداند Helm چه مشکلی را حل می‌کند (تمپلیت و نسخه برای چند محیط)
4. یک الگوی واقعی دیپلوی فرانت روی K8s را گام‌به‌گام شرح دهد

---

## تایم‌باکس پیشنهادی

| بازه | موضوع |
|------|--------|
| ۰–۵ | Review تکلیف B |
| ۵–۲۰ | Scale، Rolling Update، اختلال کنترل‌شده |
| ۲۰–۳۵ | Health probes: readiness در برابر liveness |
| ۳۵–۵۰ | Helm مقدماتی یا Kustomize (یکی را انتخاب کنید) |
| ۵۰–۵۵ | الگوی واقعی CI → Image → Deploy فرانت |
| ۵۵–۶۰ | جمع‌بندی دوره، منابع بعدی، تکلیف C اختیاری |

---

## مفاهیم کلیدی (برای گسترش)

### Scale و آپدیت

```bash
kubectl scale deployment frontend-demo --replicas=3
kubectl set image deployment/frontend-demo web=nginx:1.27-alpine
kubectl rollout status deployment/frontend-demo
kubectl rollout undo deployment/frontend-demo
```

- Rolling update: Podهای جدید کم‌کم جای قدیم را می‌گیرند
- برای فرانت: مراقب cache و سازگاری با API بک‌اند باشید (موضوع محصول، نه فقط K8s)

### Probes

| Probe | سوالی که می‌پرسد | اگر fail شود |
|-------|-------------------|--------------|
| **readiness** | آماده‌ای ترافیک بگیری؟ | از Service جدا می‌شود |
| **liveness** | زنده‌ای یا باید ری‌استارت شوی؟ | container ری‌استارت می‌شود |
| **startup** (اشاره کوتاه) | هنوز در حال بالا آمدن؟ | فرصت بیشتر قبل از liveness |

نمونه ذهنی برای nginx:

```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 2
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 10
```

### Helm در یک دقیقه

- Chart = بسته‌ای از تمپلیت‌های YAML
- `values.yaml` = تفاوت dev/stage/prod بدون کپی پیست کل مانifest
- برای فرانت: Image tag، replicaCount، Ingress host معمولاً در values می‌آیند

اگر تیم شما Kustomize استفاده می‌کند، به‌جای Helm همان را در این بلوک ۴۵–۵۰ دقیقه بگذارید — **یکی کافی است.**

---

## دموهای پیشنهادی

1. Scale بالا/پایین و مشاهده Endpoints
2. readiness را عمداً به path غلط ببرید → Pod Running می‌ماند ولی Ready نمی‌شود و از Service خارج می‌شود
3. `helm create` خیلی کوچک یا نمایش یک chart آماده فرانت و `helm install` روی لوکال

---

## الگوی واقعی برای چپتر فرانت (اسلاید پایانی)

```text
کد فرانت
  → CI: lint/test/build
  → Build Image (nginx یا node serve)
  → Push به Registry
  → Deploy به Cluster (Helm/Kustomize/kubectl)
  → Ingress به کاربران
```

نقش فرانت‌اند در این مسیر:

- درست بودن build و envهای runtime
- فهم probe و سلامت اپ
- همکاری روی مقادیر Ingress و API URL
- خواندن لاگ Pod وقتی صفحه سفید شد ولی «روی ماشین من کار می‌کرد»

---

## خروج‌های جلسه / پایان دوره

- چیت‌شیت rollout و probe
- نقشه راه مطالعه بعدی (رسمی): اسناد kubernetes.io، tutorial رسمی، بازی Killercoda / مشابه
- [تکلیف C اختیاری](./homework.md)

---

## تصمیم‌ها قبل از نهایی‌سازی جلسه ۳

- Helm یا Kustomize مطابق استک تیم؟
- آیا نمونه chart داخلی شرکت وجود دارد که نشان دهیم؟
- آیا جلسه ۳ آخرین جلسه است یا Q&A چهارم اضافه شود؟
