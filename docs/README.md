# Patient Insight: Cloud Infrastructure and Deployment Architecture Report

## Video Link: https://drive.google.com/drive/folders/19H8RAABVZ1dCw0p4YTw2ry5hKUAxjPj8?usp=sharing

## Executive Summary

Patient Insight implements a sophisticated cloud deployment architecture leveraging Amazon Web Services (AWS) as its primary cloud provider. The system utilizes a containerized microservices architecture orchestrated through Amazon Elastic Kubernetes Service (EKS), with automated deployment pipelines and comprehensive monitoring systems.

## Cloud Infrastructure Analysis

### Primary Cloud Provider: Amazon Web Services (AWS)

The project leverages multiple AWS services in a carefully orchestrated architecture:

1. **Container Orchestration (Amazon EKS)**
   - Deployment configuration shows 2 replicas for both frontend and backend services for high availability
   - Reference deployment configurations:
   ```yaml:frontend/deployment.yaml
   startLine: 1
   endLine: 25
   ```
   ```yaml:backend/deployment.yaml
   startLine: 1
   endLine: 28
   ```

2. **Container Registry (Amazon ECR)**
   - Stores Docker images at `167325058662.dkr.ecr.us-east-2.amazonaws.com`
   - Separate repositories for frontend and backend services
   - Implements automatic image tagging and versioning

3. **Load Balancing (AWS Network Load Balancer)**
   - Configured for both frontend and backend services
   - Health check implementation for high availability
   - Cross-zone load balancing enabled
   Reference configuration:
   ```yaml:frontend/service.yaml
   startLine: 1
   endLine: 25
   ```

4. **Machine Learning Infrastructure (Amazon SageMaker)**
   - Deploys the medical chat model using HuggingFace integration
   - Utilizes `ml.g5.2xlarge` instances for GPU acceleration
   - Implementation details:
   ```python:backend/ml_pipeline/patient_chat/model_manager.py
   startLine: 8
   endLine: 63
   ```

## Deployment Automation Analysis

### Continuous Integration/Continuous Deployment (CI/CD)

The project implements a sophisticated CI/CD pipeline using GitHub Actions:

1. **Deployment Workflow**
   ```yaml:.github/workflows/continuous_deployment.yml
   startLine: 1
   endLine: 124
   ```

Key features of the deployment automation:

1. **Frontend Deployment Process**
   - Automated Docker image building with platform-specific optimization
   - Direct deployment to EKS cluster
   - Rolling updates to prevent downtime
   - Health check implementation

2. **Backend Deployment Process**
   - Separate deployment pipeline for backend services
   - Environment variable management through Kubernetes secrets
   - Integration with MLflow for model tracking
   - Automated database migrations

3. **Model Deployment**
   The medical model deployment process is automated through SageMaker:
   ```python:backend/ml_pipeline/patient_chat/deploy_model.py
   startLine: 1
   endLine: 17
   ```

### Data Pipeline Integration

The deployment architecture includes a robust data pipeline: