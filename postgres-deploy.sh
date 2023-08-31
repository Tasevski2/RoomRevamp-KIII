kubectl apply -f postgres-configMap.yml

kubectl apply -f postgres-secret.yml

kubectl apply -f postgres-storage-class.yml

kubectl apply -f postgres-pv.yml

kubectl apply -f postgres-pvc.yml

kubectl apply -f postgres-statefulset.yml

kubectl apply -f postgres-service.yml