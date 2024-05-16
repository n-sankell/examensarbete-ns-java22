#!/bin/bash

echo "minikube image load e-user-service:k8s"
minikube image load e-user-service:1.0
echo "DONE"
echo "minikube image load e-midi-manager:k8s"
minikube image load e-midi-manager:1.0
echo "DONE"
echo "minikube image load e-react-app:k8s"
minikube image load e-react-app:1.0
echo "ALL DONE"
