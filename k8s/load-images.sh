#!/bin/bash

echo "minikube image load ex-user-service:k8s"
minikube image load ex-user-service:1.0
echo "DONE"
echo "minikube image load ex-midi-manager:k8s"
minikube image load ex-midi-manager:1.0
echo "DONE"
echo "minikube image load ex-react-app:k8s"
minikube image load ex-react-app:1.0
echo "ALL DONE"
