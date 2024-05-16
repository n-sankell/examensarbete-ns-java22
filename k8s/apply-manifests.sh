#!/bin/bash

kubectl apply -f secrets.yaml
kubectl apply -f postgres-config.yaml
kubectl apply -f user-db.yaml
kubectl apply -f meta-db.yaml
kubectl apply -f blob-db.yaml
kubectl apply -f react-app.yaml
kubectl apply -f user-service.yaml
kubectl apply -f midi-manager.yaml
#kubectl apply -f secret-tls.yaml
#kubectl apply -f ingress.yaml
#kubectl apply -f default-http-backend.yaml
