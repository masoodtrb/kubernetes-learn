# جلسه ۲ — اسکلت: Service، Ingress، ConfigMap / Secret

**وضعیت:** Outline — جزئیات کامل بعد از بازخورد جلسه ۱ نهایی شود.  
**مدت پیشنهادی:** ۶۰ دقیقه  
**پیش‌نیاز:** جلسه ۱ + تکلیف A (حداقل تلاش برای کلاستر لوکال)

---

## هدف یادگیری

تا پایان جلسه شرکت‌کننده بتواند:

1. تفاوت `ClusterIP` / `NodePort` / `LoadBalancer` را توضیح دهد
2. نقش Ingress را برای فرانت (HTTP routing) بفهمد
3. یک مقدار تنظیمات را با ConfigMap به Pod بدهد
4. بداند Secret برای چه چیزهایی است (و چه چیزهایی نیست)

---

## تایم‌باکس پیشنهادی

| بازه | موضوع |
|------|--------|
| ۰–۵ | Review تکلیف A و سوالات پرتکرار |
| ۵–۲۰ | Service عمیق‌تر: انواع + Endpoints + DNS داخلی |
| ۲۰–۳۵ | Ingress: مسیر `/` به سرویس فرانت؛ ایده host/path |
| ۳۵–۵۰ | ConfigMap + Secret: env و volume؛ دمو کوتاه |
| ۵۰–۵۵ | antipatternها (Secret در git، Config داخل Image) |
| ۵۵–۶۰ | تکلیف B + پیش‌نمایش جلسه ۳ |

---

## مفاهیم کلیدی (برای گسترش به اسکریپت کامل)

### Service

- Service ترافیک را با **selector** به Podها می‌رساند
- DNS داخلی معمولاً شبیه: `frontend-demo.default.svc.cluster.local`
- برای فرانت داخل کلاستر: اغلب ClusterIP + Ingress کافی است

### Ingress

- لایه HTTP(S) روی چند Service
- نیاز به Ingress Controller در کلاستر (Minikube addon، nginx ingress، …)
- مثال ذهنی: `app.example.com/` → Service فرانت

### ConfigMap / Secret

| | ConfigMap | Secret |
|---|-----------|--------|
| کاربرد | تنظیمات غیرحساس | داده حساس |
| مثال | `FEATURE_FLAG`, زبان پیش‌فرض | توکن API، پسورد |
| نکته | باز هم دسترسی RBAC مهم است | به‌صورت پیش‌فرض رمزنگاری «جادویی» کامل فرض نکنید |

---

## دموهای پیشنهادی

1. نشان دادن `kubectl get endpoints` وقتی label را عمداً خراب می‌کنید (و بعد درست می‌کنید)
2. نصب/فعال‌سازی یک Ingress Controller ساده در محیط لوکال و یک Ingress resource مینیمال
3. ConfigMap → `env` روی یک container که مقدار را echo/print می‌کند

### YAML مینیمال — Ingress (نمونه)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-demo
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-demo
                port:
                  number: 80
```

> Controller و annotationها وابسته به محیط‌اند؛ در نسخه نهایی جلسه ۲ برای Minikube/Kind یکی را قفل کنید.

### YAML مینیمال — ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
data:
  APP_MESSAGE: "hello-from-config"
```

---

## پیام‌های «برای فرانت یعنی چه؟»

- Build فرانت را برای هر محیط از نو با hardcode کردن API URL نسازید؛ config را بیرونی کنید
- مسیرهای SPA (`/app`, `/dashboard`) را در Ingress با path درست و fallback به `index.html` در نظر بگیرید (جزئیات در دمو یا پارکینگ)
- Secret را در ریپو و اسکرین‌شات عمومی نگذارید

---

## خروج‌های جلسه

- چک‌لیست ذهنی انتخاب Service type
- یک Ingress کارگر در لوکال **یا** مستند «چرا در محیط ما Ingress نداریم و از port-forward استفاده کردیم»
- معرفی [تکلیف B](./homework.md)

---

## تصمیم‌هایی که قبل از نهایی‌سازی جلسه ۲ باید گرفته شود

- محیط مرجع دمو: Minikube یا Kind یا Docker Desktop؟
- آیا Ingress Controller از قبل در راهنمای نصب هست؟
- برای دمو Config: همان nginx یا یک Image تک‌فایل Node؟

این تصمیم‌ها را بر اساس نظرسنجی جلسه ۱ بگیرید.
