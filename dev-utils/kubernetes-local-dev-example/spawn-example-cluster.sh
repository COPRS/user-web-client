#! /bin/sh

# Delete Kind Cluster
kind delete cluster --name kind-rs-user-client

# Create Kind Cluster
kind create cluster --name kind-rs-user-client --config cluster.yaml

# Install NGINX ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

sleep 20

# Wait for ingress to be active
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s

# Load docker image
kind load docker-image --name kind-rs-user-client rs-user-client:dev

# Spawn rs-user-client in kubernetes
helm install --debug web-client ./rs-user-client-chart