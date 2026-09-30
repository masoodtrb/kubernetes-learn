# دمو نیمه‌حرفه‌ای — multi-stage Node → nginx

```bash
cd docker/demo/semipro
docker build -t fe-docker-semipro .
docker run --rm -p 8081:80 fe-docker-semipro
```

مرورگر: http://localhost:8081

Image نهایی فقط stage دوم را دارد؛ Node و سورس داخل runtime نمی‌مانند.
