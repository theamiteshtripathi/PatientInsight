#!/bin/bash

# Environment variables
AWS_REGION="us-east-2"
ECR_REGISTRY="167325058662.dkr.ecr.us-east-2.amazonaws.com"
EKS_CLUSTER_NAME="patient-insight-eks-cluster"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status messages
print_status() {
    echo -e "${GREEN}=== $1 ===${NC}"
}

# Function to handle errors
handle_error() {
    echo -e "${RED}Error: $1${NC}"
    exit 1
}

# Configure AWS credentials and login to ECR
print_status "Configuring AWS credentials and logging into ECR"
aws configure get aws_access_key_id || handle_error "AWS credentials not configured"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY || handle_error "ECR login failed"

# Update kubeconfig
print_status "Updating kubeconfig"
aws eks update-kubeconfig --name $EKS_CLUSTER_NAME --region $AWS_REGION || handle_error "Failed to update kubeconfig"

# Function to build and deploy a component
deploy_component() {
    local component=$1
    
    print_status "Building and deploying $component"
    
    # Navigate to component directory
    cd ./$component || handle_error "Cannot find $component directory"
    
    # Build and push Docker image
    print_status "Building $component Docker image"
    docker buildx build --platform linux/amd64 -t $ECR_REGISTRY/$component:latest . || handle_error "$component docker build failed"
    
    print_status "Pushing $component image to ECR"
    docker push $ECR_REGISTRY/$component:latest || handle_error "$component image push failed"
    
    # Deploy to Kubernetes
    print_status "Deploying $component to Kubernetes"
    kubectl apply -f deployment.yaml || handle_error "$component deployment failed"
    kubectl apply -f service.yaml || handle_error "$component service failed"
    kubectl rollout restart deployment $component -n default || handle_error "$component rollout failed"
    
    # Return to root directory
    cd ..
}

# Main deployment process
print_status "Starting deployment process"

# Deploy frontend
deploy_component "frontend"

# Deploy backend
deploy_component "backend"

print_status "Deployment completed successfully!"

# Verify deployments
print_status "Verifying deployments"
kubectl get deployments
kubectl get services

export FRONTEND_URL=$(kubectl get svc frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
export BACKEND_URL=$(kubectl get svc backend-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Frontend URL: http://$FRONTEND_URL"
echo "Backend URL: http://$BACKEND_URL"