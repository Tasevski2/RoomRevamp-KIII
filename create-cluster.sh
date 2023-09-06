# without ingress
# k3d cluster create room-revamp -p "3000:3000@loadbalancer" -p "8000:8000@loadbalancer" -p "5432:5432@loadbalancer" -s 1 -a 1

# with ingress
k3d cluster create room-revamp -p "80:80@loadbalancer" -s 1 -a 1

kubectl create namespace room-revamp

kubectl config set-context k3d-room-revamp --namespace room-revamp