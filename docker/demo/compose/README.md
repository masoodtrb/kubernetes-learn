# دمو Compose — web (nginx) + mock API

```bash
cd docker/demo/compose
docker compose up --build -d
docker compose ps
curl -s http://localhost:8080/api/hello
docker compose down
```

مرورگر: http://localhost:8080 — لینک `/api/hello` را هم بزنید.
