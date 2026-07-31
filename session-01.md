# جلسه ۱ — Kubernetes از صفر برای فرانت‌اند

**مدت:** ۶۰ دقیقه  
**هدف جلسه:** بفهمیم چرا Kubernetes وجود دارد، مدل ذهنی Cluster / Pod / Deployment / Service را یاد بگیریم، و یک اپ ساده را با YAML روی کلاستر اجرا کنیم.

**فایل‌های مرتبط:** [کنداکتور](./00-conductor.md) · [تکلیف](./homework.md)

---

## راهنمای ارائه‌دهنده

- این فایل اسکریپت ارائه است: بخش‌های **بگو** را تقریباً همان‌طور بگویید؛ بلوک‌های کد را روی صفحه نشان دهید.
- اگر وقت کم آمد: بخش «خواندن YAML» را کوتاه کنید و روی دمو بمانید.
- اگر وقت زیاد آمد: از شرکت‌کنندگان بخواهید `replicas` را با هم عوض کنند.

---

## ۰–۵ دقیقه — خوش‌آمد و هدف

### اسلاید / بولت

- موضوع: Kubernetes برای چپتر فرانت
- امروز یاد نمی‌گیریم «کل K8s» را؛ یاد می‌گیریم **مدل ذهنی درست** + **اولین دیپلوی**
- پیش‌نیاز مفهومی: Container = اپ پک‌شده؛ Image = قالب آن اپ

### بگو

> هدف این جلسه این نیست که DevOps شوید. هدف این است که وقتی می‌گوییم «فرانت روی کلاستر رفت»، دقیقاً بدانید چه اتفاقی افتاده، فایل YAML را بخوانید، و با `kubectl` وضعیت را ببینید.

### چک سریع اتاق

از شرکت‌کنندگان بپرسید (دست بالا):

1. Docker را حداقل یک‌بار اجرا کرده‌اید؟
2. تا حالا `kubectl` دیده‌اید؟

اگر اکثریت Docker ندیده‌اند: ۳۰ ثانیه بگویید «Image مثل کلاس است، Container مثل instance».

---

## ۵–۱۵ دقیقه — مشکل واقعی و نقش Kubernetes

### اسلاید: بدون ارکستراتور چه دردسرهایی داریم؟

فرض کنید فرانت (یا BFF) را با Docker روی یک سرور اجرا کرده‌اید:

| نیاز | بدون K8s معمولاً چه می‌شود؟ |
|------|------------------------------|
| اگر پروسه کرش کند | باید دستی یا با اسکریپت ری‌استارت کنید |
| ترافیک بیشتر شد | دستی instance جدید می‌آورید و لودبالانس می‌کنید |
| نسخه جدید | downtime یا اسکریپت deploy پیچیده |
| چند محیط / چند سرویس | هر ماشین تنظیمات جدا، سخت برای یکسان‌سازی |

### بگو

> Kubernetes یک **سیستم ارکستراسیون کانتینر** است: شما وضعیت مطلوب را اعلام می‌کنید (مثلاً ۳ کپی از این اپ)، او تلاش می‌کند آن وضعیت را نگه دارد.

### برای فرانت یعنی چه؟

- دیپلوی نسخه جدید فرانت بدون SSH دستی به سرور
- چند replica پشت یک آدرس واحد
- جدا کردن config از Image (در جلسات بعد)
- زبان مشترک با Backend / DevOps

### آنچه امروز عمداً پوشش نمی‌دهیم

- جزئیات etcd، scheduler، CNI
- مقایسه عمیق با Nomad / ECS
- Production hardening و security پیشرفته

این‌ها را در پارکینگ سوالات بنویسید.

---

## ۱۵–۲۵ دقیقه — معماری ساده

### دیاگرام ذهنی

```text
Cluster
└── Node(s)          ← ماشین‌های worker (VM یا فیزیکی)
    └── Pod          ← کوچک‌ترین واحد اجرا (۱ یا چند container)
         └── Container (مثلاً nginx یا اپ Vue/React build شده)
```

و لایه کنترل:

```text
Deployment  --مدیریت می‌کند-->  ReplicaSet  --می‌سازد-->  Pod(s)
Service     --آدرس پایدار می‌دهد به-->  Pod(s)  (با label)
```

### تعاریف یک‌خطی (حفظ کنید)

| مفهوم | یک خط |
|--------|--------|
| **Cluster** | مجموعه Nodeها + control plane که با هم یک سیستم‌اند |
| **Node** | یک ماشین که Podها روی آن اجرا می‌شوند |
| **Pod** | کوچک‌ترین واحد قابل زمان‌بندی؛ معمولاً یک container |
| **Deployment** | اعلام می‌کند «N تا Pod از این Image می‌خواهم» و آپدیت/ری‌استارت را مدیریت می‌کند |
| **Service** | یک IP/DNS پایدار داخل کلاستر برای رسیدن به Podها |
| **kubectl** | CLI شما برای حرف زدن با API کلاستر |

### بگو

> اشتباه رایج: فکر کنیم Deployment همان Container است.  
> Deployment یک **کنترلر** است. چیزی که واقعاً درخواست را سرو می‌کند Pod است.

### تشبیه برای فرانت

- **Image** ≈ build آرتیفکت (`dist` داخل nginx image)
- **Pod** ≈ یک instance در حال اجرا
- **Deployment** ≈ «همیشه ۳ instance از این build داشته باش»
- **Service** ≈ reverse proxy / VIP داخلی که به instanceهای سالم می‌زند

---

## ۲۵–۴۵ دقیقه — دمو: Deployment + Service

### هدف دمو

یک سرور استاتیک ساده (`nginx`) را با Deployment بالا بیاوریم، با Service در معرض بگذاریم، وضعیت را با `kubectl` ببینیم.

> می‌توانید به‌جای nginx، Image فرانت خودتان را بگذارید؛ برای جلسه اول nginx کم‌ریسک‌تر است.

### پیش‌فرض محیط

```bash
kubectl get nodes
kubectl config current-context
```

خروجی باید Node با وضعیت `Ready` نشان دهد.

### فایل ۱ — `frontend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-demo
  labels:
    app: frontend-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend-demo
  template:
    metadata:
      labels:
        app: frontend-demo
    spec:
      containers:
        - name: web
          image: nginx:1.27-alpine
          ports:
            - containerPort: 80
```

### بگو (روی YAML)

> - `replicas: 2` یعنی دو Pod می‌خواهیم  
> - `selector.matchLabels` باید با `template.metadata.labels` جور باشد؛ وگرنه Deployment Podها را «مال خودش» نمی‌داند  
> - `containerPort` فقط مستندسازی/اطلاع است؛ به‌تنهایی ترافیک بیرون را باز نمی‌کند

### اعمال Deployment

```bash
kubectl apply -f frontend-deployment.yaml
kubectl get deployments
kubectl get pods -l app=frontend-demo -w
```

با `-w` صبر کنید تا هر دو Pod `Running` شوند، بعد `Ctrl+C`.

اگر CrashLoop یا ImagePull: سریع `kubectl describe pod <name>` و `kubectl logs <name>`.

### فایل ۲ — `frontend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-demo
spec:
  selector:
    app: frontend-demo
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: ClusterIP
```

### اعمال Service و مشاهده

```bash
kubectl apply -f frontend-service.yaml
kubectl get svc frontend-demo
kubectl get endpoints frontend-demo
```

### بگو

> `ClusterIP` یعنی آدرس پایدار **داخل** کلاستر. از لپ‌تاپتان مستقیم باز نمی‌شود مگر port-forward یا Ingress/LoadBalancer.

### دسترسی موقت از ماشین خودتان

```bash
kubectl port-forward svc/frontend-demo 8080:80
```

مرورگر: `http://localhost:8080` → صفحه پیش‌فرض nginx.

در دمو این را نشان دهید، بعد port-forward را ببندید.

### دستورات مشاهده مفید (۲–۳ تا کافی است)

```bash
kubectl get all -l app=frontend-demo
kubectl describe deployment frontend-demo
kubectl delete pod -l app=frontend-demo --field-selector=status.phase=Running
```

بعد از حذف یک Pod: Deployment خودکار Pod جدید می‌سازد. **این لحظه کلیدی جلسه است.**

### بگو

> شما Pod را کشتید؛ Kubernetes وضعیت مطلوب (`replicas: 2`) را برگرداند. این همان «اعلام وضعیت مطلوب» است.

### پاکسازی (اگر لازم شد)

```bash
kubectl delete -f frontend-service.yaml -f frontend-deployment.yaml
```

---

## ۴۵–۵۵ دقیقه — خواندن YAML؛ سه مفهوم کلیدی

### ۱) `replicas`

```yaml
spec:
  replicas: 3
```

```bash
kubectl scale deployment frontend-demo --replicas=3
kubectl get pods -l app=frontend-demo
```

برای فرانت: ظرفیت بیشتر / تحمل از دست رفتن یک Pod.

### ۲) Labels و Selectors

```text
Pod labels:        app=frontend-demo
Deployment selector: app=frontend-demo
Service selector:    app=frontend-demo
```

اگر label اشتباه باشد:

- Deployment تعداد Pod درست را «نمی‌بیند»
- Service به هیچ Endpointی وصل نمی‌شود (`Endpoints` خالی)

### ۳) Ports

| فیلد | معنی |
|------|------|
| `containerPort` | پورتی که اپ داخل container گوش می‌دهد |
| `Service.port` | پورتی که داخل کلاستر به Service می‌زنید |
| `targetPort` | پورتی روی Pod که ترافیک به آن forward می‌شود |

### مینی‌تمرین زنده (اگر وقت بود — ۳ دقیقه)

از یک داوطلب بخواهید:

1. `replicas` را از ۲ به ۱ تغییر دهد و `kubectl apply` کند
2. بگوید چند Pod باقی ماند و چرا

---

## ۵۵–۶۰ دقیقه — جمع‌بندی، تکلیف، نظرسنجی

### سه جمله جمع‌بندی

1. Kubernetes وضعیت مطلوب را نگه می‌دارد (خودترمیمی Pod).
2. Deployment تعداد و آپدیت Podها را مدیریت می‌کند؛ Service آدرس پایدار می‌دهد.
3. Labels چسب بین Deployment، Pod و Service هستند.

### تکلیف تا جلسه بعد

جزئیات کامل در [homework.md](./homework.md) — خلاصه برای گفتن در جلسه:

> روی Minikube یا Kind یا Docker Desktop، همین Deployment + Service را اعمال کنید و خروجی `kubectl get all -l app=frontend-demo` را بیاورید.  
> چالش اختیاری: replicas را ۳ کنید و یک label اضافه اضافه کنید.

### نظرسنجی (در چت یا فرم)

1. مفید بودن جلسه از ۱ تا ۵
2. جلسه ۲ را می‌خواهید؟ بله / شاید / خیر
3. سخت‌ترین بخش: مفهومی / YAML / kubectl / دمو
4. محیط تکلیف: Minikube / Kind / Docker Desktop / هنوز ندارم

### بستن

> جلسه بعد (در صورت ادامه): از بیرون کلاستر چطور برسیم (Ingress)، و چطور env/config را بدون rebuild عوض کنیم (ConfigMap / Secret).

---

## پارکینگ سوالات (برای پایان یا جلسه بعد)

- تفاوت Pod با Container دقیقاً چیست؟
- NodePort در برابر LoadBalancer در برابر Ingress؟
- چطور Image فرانت خودمان را از registry خصوصی بکشیم؟
- Namespace چیست و چرا چند تا می‌سازند؟

---

## ضمیمه — چیت‌شیت `kubectl` جلسه ۱

```bash
kubectl get nodes
kubectl get pods
kubectl get deploy,svc
kubectl apply -f <file>.yaml
kubectl delete -f <file>.yaml
kubectl describe pod <name>
kubectl logs <pod-name>
kubectl port-forward svc/<name> 8080:80
kubectl scale deployment <name> --replicas=N
```

## ضمیمه — عیب‌یابی سریع دمو

| علامت | احتمال | کار بعدی |
|--------|---------|----------|
| `ImagePullBackOff` | نام Image / شبکه / registry | `describe pod` |
| `CrashLoopBackOff` | اپ داخل container می‌میرد | `logs` |
| Service بدون Endpoint | mismatch لیبل | `get pods --show-labels` و مقایسه با selector |
| port-forward وصل نمی‌شود | Service/Pod آماده نیست | `get pods`, `get svc` |
