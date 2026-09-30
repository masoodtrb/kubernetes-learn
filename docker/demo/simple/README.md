# دمو ساده — nginx + static HTML

```bash
cd docker/demo/simple
docker build -t fe-docker-simple .
docker run --rm -p 8080:80 fe-docker-simple
```

مرورگر: http://localhost:8080
