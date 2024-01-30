chmod +x ./apply-manifests.sh
chmod +x ./load-images.sh

docker context use default

minikube start

minikube addons enable ingress

echo "-----"

./apply-manifests.sh

echo "-----"

./load-images.sh

minikube tunnel
# --bind-address "172.23.246.168"

