#!/bin/bash

echo "minikube image load tf-mysql:k8s"
minikube image load tf-mysql:v1.0
echo "DONE"
echo "minikube image load tf-react-app:k8s"
minikube image load tf-react-app:v1.0
echo "DONE"
echo "minikube image load tf-spring-boot-app:k8s"
minikube image load tf-spring-boot-app:v1.0
echo "ALL DONE"
