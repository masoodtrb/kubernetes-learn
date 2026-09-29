# دمو Swarm — Stack حداقلی

```bash
docker swarm init   # اگر هنوز Swarm نیست
cd docker/demo/swarm
docker stack deploy -c stack.yaml frontend-swarm
docker service ls
docker service ps frontend-swarm_web
docker stack rm frontend-swarm
```

مرورگر بعد از deploy: http://localhost:8080  
`replicas: 2` را در `docker service ps` نشان دهید.
