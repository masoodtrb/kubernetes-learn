# دمو Swarm (مقدماتی) — ارکستراسیون سبک روی Docker

```bash
# یک‌بار روی ماشین دمو
docker swarm init

# دیپلوی Stack
cd docker/demo/swarm
docker stack deploy -c stack.yaml fe-swarm

# مشاهده
docker stack services fe-swarm
docker service ls
docker service ps fe-swarm_web

# پاکسازی
docker stack rm fe-swarm
# اختیاری: docker swarm leave --force
```

مرورگر (بعد از Ready شدن Taskها): http://localhost:8084
