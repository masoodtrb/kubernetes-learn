# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is

This repository is **documentation only** — a Kubernetes training course (in Persian, "چپتر فرانت" / the frontend chapter). See `README.md`. There is **no application code, package manager, build system, or test suite**. The files are Markdown:

- `00-conductor.md`, `session-01.md`, `session-02-outline.md`, `session-03-outline.md`, `homework.md`, `README.md`

There is nothing to compile or `npm install`. "Running the environment" means standing up a **local Kubernetes cluster** and executing the hands-on demo from `session-01.md` / `homework.md` (deploy an nginx `Deployment` + `Service`, verify pods, self-healing, and `port-forward`).

### Cluster tooling: use k3s-on-host (NOT Kind/minikube/k3d)

`README.md` suggests Docker Desktop / Minikube / Kind. **Those do not work in the Cursor Cloud VM.** This VM is a nested container on cgroup v2 with a locked-down cgroup namespace:

- The `memory` controller cannot be delegated (`echo +memory > .../cgroup.subtree_control` → `Operation not supported`), so **systemd-based node images (Kind, minikube kicbase) fail** with `Failed to allocate manager object` / `init.scope: Structure needs cleaning`.
- runc/containerd cannot create per-container cgroups under the namespace root (`cannot enter cgroupv2 ".../k8s.io" with domain controllers -- it is in an invalid state`).

The working path is **k3s running directly on the host** with per-QoS cgroups disabled and containerd's `disable_cgroup = true`. `kubectl`, `k3s`, `docker`, and the containerd config template below are baked into the VM snapshot. (Docker is installed but **not required** for the k3s-on-host cluster; it was used only for the nginx sanity check.)

### Start the local cluster

The containerd template lives at `/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl` (persisted in the snapshot). If it is missing (e.g. `/var/lib/rancher` was wiped), recreate it first:

```bash
sudo mkdir -p /var/lib/rancher/k3s/agent/etc/containerd
sudo tee /var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl >/dev/null <<'EOF'
version = 2

[plugins."io.containerd.internal.v1.opt"]
  path = "/var/lib/rancher/k3s/agent/containerd"
[plugins."io.containerd.grpc.v1.cri"]
  stream_server_address = "127.0.0.1"
  stream_server_port = "10010"
  enable_selinux = false
  enable_unprivileged_ports = true
  enable_unprivileged_icmp = true
  device_ownership_from_security_context = false
  sandbox_image = "rancher/mirrored-pause:3.6"
  disable_cgroup = true

[plugins."io.containerd.grpc.v1.cri".containerd]
  snapshotter = "fuse-overlayfs"
  disable_snapshot_annotations = true

[plugins."io.containerd.grpc.v1.cri".cni]
  bin_dir = "/var/lib/rancher/k3s/data/cni"
  conf_dir = "/var/lib/rancher/k3s/agent/etc/cni/net.d"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  runtime_type = "io.containerd.runc.v2"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
  SystemdCgroup = false

[plugins."io.containerd.grpc.v1.cri".registry]
  config_path = "/var/lib/rancher/k3s/agent/etc/containerd/certs.d"
EOF
```

Start the server (long-running — use tmux; do NOT put this in the update script):

```bash
sudo /usr/local/bin/k3s server \
  --snapshotter=fuse-overlayfs \
  --flannel-backend=host-gw \
  --write-kubeconfig /home/ubuntu/.kube/k3s.yaml --write-kubeconfig-mode 644 \
  --disable traefik --disable servicelb --disable metrics-server \
  --kubelet-arg=cgroups-per-qos=false \
  --kubelet-arg=enforce-node-allocatable= \
  --kubelet-arg=cgroup-driver=cgroupfs \
  --kubelet-arg=fail-swap-on=false
```

Why each non-obvious flag matters:
- `--snapshotter=fuse-overlayfs` — the kernel's overlayfs can't be used nested here (`overlayfs cannot be enabled ... invalid argument`).
- `--flannel-backend=host-gw` — the default VXLAN backend fails (`failed to register flannel network: operation not supported`); `host-gw` works for a single node.
- `--kubelet-arg=cgroups-per-qos=false` + `enforce-node-allocatable=` — stop kubelet creating the `kubepods` cgroup hierarchy the environment forbids.
- `disable_cgroup = true` (template) — stop containerd/runc creating per-container cgroups.

Then point kubectl at the cluster and wait for readiness:

```bash
export KUBECONFIG=/home/ubuntu/.kube/k3s.yaml   # add to your shell for the session
kubectl get nodes                # wait ~30-45s until node "cursor" is Ready
kubectl get pods -A              # coredns + local-path-provisioner should be Running
```

### Run the course demo (session-01 / homework Task A)

Copy the two manifests out of `session-01.md` into a scratch dir (do not add them to the repo) and apply:

```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl rollout status deployment/frontend-demo
kubectl get all -l app=frontend-demo
kubectl get endpoints frontend-demo          # should list both pod IPs
kubectl port-forward svc/frontend-demo 8080:80   # http://localhost:8080 -> nginx page
```

`ClusterIP` is not routable from the host — use `port-forward` to reach the Service.

### Gotchas

- Kubeconfig is at `/home/ubuntu/.kube/k3s.yaml`; export `KUBECONFIG` or copy it to `~/.kube/config`.
- k3s must keep running for the cluster to exist; run it in a persistent tmux session, not a one-shot background job.
- k3s clusters (and Docker containers) are runtime state and are **not** guaranteed to survive VM restarts even though the binaries/config are in the snapshot — expect to re-run the `k3s server` command per session.
