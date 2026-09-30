# دمو پیشرفته — non-root + .dockerignore + cache layers

```bash
cd docker/demo/advanced
docker build -t fe-docker-advanced .
docker run --rm -p 8082:8080 fe-docker-advanced
```

مرورگر: http://localhost:8082

نکات برای گفتن در جلسه:
- `.dockerignore` مثل `.gitignore` برای context بیلد است
- ترتیب `COPY package.json` قبل از سورس = cache بهتر برای `npm install`
- `USER nginx` + پورت 8080 = بدون root در runtime
