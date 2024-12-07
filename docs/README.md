# PatientInsight: Cloud Deployment Architecture Report

## Video Submission Link: https://drive.google.com/drive/folders/19H8RAABVZ1dCw0p4YTw2ry5hKUAxjPj8?usp=sharing

## Executive Summary
PatientInsight is deployed as a cloud-native solution leveraging Amazon Web Services (AWS) as the primary cloud provider. This deployment strategy enables scalable, reliable, and secure delivery of our medical symptom analysis pipeline.

## Cloud Infrastructure Overview

### Deployment Environment: Cloud-Based Solution
PatientInsight is implemented as a cloud deployment, utilizing AWS's comprehensive suite of services to create a robust and scalable architecture.

### Cloud Provider: Amazon Web Services (AWS)

#### Core Services Utilized
1. **Storage and Data Management**
   - Amazon S3
     * Primary storage for datasets
     * DVC data repository
     * Artifact storage
   - Amazon RDS
     * Relational database management
     * Persistent data storage

2. **Machine Learning Infrastructure**
   - Amazon SageMaker
     * MLflow experiment tracking and model registry
     * Pre-trained LLM deployment
     * Inference endpoint management

3. **Containerization and Orchestration**
   - Amazon Elastic Container Registry (ECR)
     * Docker image repository
     * Container versioning
   - Amazon Elastic Kubernetes Service (EKS)
     * Kubernetes cluster management
     * Pod orchestration
     * Node scaling
     * Deployment management

4. **Serverless Computing**
   - AWS Lambda
     * Automated DAG triggers
     * Event-driven pipeline execution

5. **Compute Resources**
   - Amazon EC2
     * Compute instances
     * Application hosting

6. **Monitoring and Logging**
   - Amazon Managed Service for Prometheus
     * Deployment monitoring
     * Performance metrics
   - Amazon CloudWatch
     * Centralized logging
     * System monitoring

This cloud-based architecture provides the foundation for our healthcare analytics system, ensuring high availability, scalability, and robust security measures while maintaining operational efficiency.


## Kubernetes Infrastructure and Deployment Architecture

### Overview
The PatientInsight application is deployed on Amazon Elastic Kubernetes Service (EKS), implementing a robust and scalable microservices architecture. This section details our Kubernetes infrastructure configuration, highlighting the deployment strategy and architectural decisions that ensure high availability, scalability, and maintainable operations.

### Container Registry and Image Management

![ECR](Images/ECR.png)

Our containerization strategy leverages Amazon Elastic Container Registry (ECR) for secure and efficient image management. The application architecture is divided into two primary components, each maintained in dedicated repositories:
- A frontend repository housing the user interface components
- A backend repository containing the core application logic and API services

Both repositories are configured with AES-256 encryption, ensuring the security of our container images. The repositories support mutable tags, facilitating our continuous deployment pipeline and enabling rapid iterations of our application components.

### Kubernetes Cluster Architecture

![EKS](Images/EKS.png)
The production environment operates on a dedicated EKS cluster named `patient-insight-eks-cluster`. This cluster represents our commitment to container orchestration excellence, running on Kubernetes version 1.31. The cluster architecture is designed with both performance and cost-efficiency in mind, implementing a sophisticated node group configuration that balances resource availability with operational costs.

![Node Group](Images/NodeGroup.png)

Our node group configuration exemplifies this balance:
- We utilize c4.xlarge instances, providing robust computational resources for our containerized workloads
- The cluster maintains a baseline of two nodes while allowing elastic scaling up to four nodes based on demand
- Each node is provisioned with 50 GiB of storage, ensuring ample space for container images and ephemeral storage
- The AMI type (AL2_x86_64) was selected for its stability and comprehensive AWS integration capabilities

### Pod Distribution and Service Architecture

![Pods](Images/Pods.png)

The cluster currently orchestrates 14 pods, distributed strategically across two nodes. This distribution reflects our microservices architecture and includes several key components:

The pod architecture can be categorized into three main groups:

1. **Core Application Services**
   Our application pods are deployed with redundancy in mind, running multiple replicas of both frontend and backend services. This configuration ensures high availability and enables zero-downtime deployments.

2. **System and Infrastructure Services**
   The cluster maintains essential AWS integration services, including load balancer controllers and EBS CSI drivers, facilitating seamless integration with AWS infrastructure services.

3. **Monitoring and Observability Stack**
   We implement a comprehensive monitoring solution through CloudWatch agents, Fluent Bit for logging, and Grafana for metrics visualization, ensuring complete observability of our application stack.



### Service Architecture and Network Communication

![Services](Images/Services.png)

The application's networking layer is orchestrated through Kubernetes Services, providing stable networking interfaces for our components:

#### Service Configuration
Our Kubernetes deployment includes three essential services:
- `frontend-service`: A LoadBalancer service exposing the frontend to external traffic
  * External IP: k8s-default-frontend-83b9bf328b-4645da8feaa0ec6e.elb.us-east-2.amazonaws.com
  * Port: 80:30619/TCP
  * Type: LoadBalancer

- `backend-service`: A LoadBalancer service for backend API access
  * External IP: k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com
  * Port: 80:30587/TCP
  * Type: LoadBalancer

- `kubernetes`: The default ClusterIP service
  * Internal IP: 10.100.0.1
  * Port: 443/TCP
  * Type: ClusterIP

#### Inter-Service Communication
The frontend and backend services are configured to enable seamless communication within the cluster. The frontend service communicates with the backend through its internal cluster IP (10.100.246.222), while being accessible to external users through its load balancer endpoint. This architecture ensures:
- Secure internal communication between components
- External accessibility through managed load balancers
- Network isolation where appropriate
- High availability through AWS's elastic load balancing

This service configuration creates a robust networking layer that supports both internal application communication and external user access, while maintaining security and scalability of the overall system.

### Load Balancing Strategy

![Load Balancing](Images/LoadBalancer.png)

Our load balancing architecture implements a dual-layer approach using AWS Network Load Balancers:

The frontend load balancer (`k8s-default-frontend`) serves as the primary entry point for user traffic, configured as an internet-facing load balancer spanning three availability zones. This configuration ensures optimal distribution of incoming traffic and maintains high availability through zone redundancy.

The backend load balancer (`k8s-default-backends`) manages internal service communication, implementing sophisticated health checking mechanisms and cross-zone load balancing to maintain service reliability.

### Network Architecture and Security
The network architecture is built on AWS VPC infrastructure, implementing a multi-availability zone deployment strategy. This design ensures resilience against zone failures and optimal latency for end-users. The network configuration spans three availability zones, with dedicated subnets for different aspects of our application infrastructure.

### Scalability and Resource Management
Our infrastructure implements horizontal pod autoscaling and cluster autoscaling capabilities. The node group configuration allows for dynamic scaling between 2 and 4 nodes, with the following characteristics:
- Minimum node count: 2 (ensuring high availability)
- Maximum node count: 4 (allowing for traffic spikes)
- Desired capacity: 2 (optimizing for standard operation)

This configuration enables the cluster to automatically scale based on demand while maintaining cost efficiency during periods of lower utilization.

### Monitoring and Observability
The deployment includes a comprehensive monitoring stack:
- CloudWatch integration for metric collection and log aggregation
- Fluent Bit for efficient log forwarding
- Grafana dashboards for metric visualization
- Custom health checks and readiness probes for service monitoring

This robust monitoring setup ensures operational visibility and enables proactive issue resolution.

### Prometheus Implementation
![Prometheus](Images/Prometheus.png)

We utilize Amazon Managed Service for Prometheus for metrics collection and storage, configured through a dedicated workspace (ws-16414bce-3756-40fc-8f4f-218915a2a049). The service automatically scrapes metrics from our EKS cluster, including:
- Pod performance metrics
- Node resource utilization
- API endpoint response times
- Custom application metrics
- Model inference latencies

### Grafana Dashboards
Our Grafana implementation provides intuitive visualization of system metrics through custom dashboards:

1. **Kubernetes Cluster Overview**
   - Node resource utilization
   - Pod health status
   - Container metrics
   - Network performance

2. **Application Performance**
   - API response times
   - Request rates
   - Error rates
   - Service latencies

3. **Model Performance**
   - Inference times
   - Model throughput
   - Memory usage
   - GPU utilization

### Integration Points
The monitoring stack is fully integrated with our infrastructure:
- Direct metric collection from EKS cluster
- Custom metric endpoints for application monitoring
- Automated alerting based on defined thresholds
- Real-time visualization of system health

This comprehensive monitoring solution ensures complete visibility into our system's operational status while enabling quick identification and resolution of potential issues.

### Conclusion
Our Kubernetes infrastructure represents a well-architected solution that balances scalability, reliability, and operational efficiency. The combination of strategic pod distribution, sophisticated load balancing, and comprehensive monitoring creates a resilient platform capable of supporting our healthcare application's demanding requirements while maintaining security and performance standards.


## Automated Data Processing with AWS Lambda

### Overview
Our project implements an automated data processing pipeline using AWS Lambda, designed to streamline the handling of new medical datasets. This serverless solution automatically triggers our data processing workflows whenever new data is uploaded to our S3 storage bucket, ensuring continuous updates to our medical analysis system.

### Lambda Function Implementation
The core of our automation is a Lambda function that monitors our S3 bucket for new dataset uploads. When new medical data arrives, the function automatically initiates our Airflow DAG (Directed Acyclic Graph), which orchestrates the entire data processing pipeline. This event-driven approach eliminates the need for manual intervention in our data processing workflow, ensuring immediate handling of new information.

### Data Processing Workflow
Upon triggering, the Lambda function initiates a series of data processing steps through our Airflow pipeline. The workflow begins with comprehensive data preprocessing, where the raw medical data is cleaned, standardized, and validated. Following this, the pipeline generates statistical analyses and reports, providing insights into the new dataset's characteristics and quality metrics.

### Vector Database Integration

![Vector Database](Images/Pinecone.png)
The final stage of our automated pipeline involves generating embeddings for the processed medical data. These embeddings are crucial for our medical analysis system, as they enable efficient similarity searches and case comparisons. The Lambda function ensures that all new data is properly vectorized and stored in our Pinecone vector database, maintaining the system's ability to provide accurate medical insights.

### Security and Monitoring
Our Lambda implementation adheres to AWS security best practices, operating with minimal required permissions through a carefully configured IAM role. The function's activities are monitored through CloudWatch, providing detailed logs and metrics that help maintain system reliability. This monitoring ensures that any processing issues are quickly identified and addressed, maintaining the integrity of our medical data processing pipeline.

### Conclusion
The integration of AWS Lambda in our data processing pipeline represents an efficient, automated approach to handling medical data updates. This serverless architecture ensures that our medical analysis system remains current with minimal operational overhead, while maintaining high standards of data processing and security.

## Model Deployment and Serving with Amazon SageMaker

### Overview
Our project leverages Amazon SageMaker for model serving and experiment tracking, focusing on the deployment of our specialized medical interaction model (OpenBioLLM) and comprehensive MLflow integration. This infrastructure supports our medical analysis pipeline, where users can interact with generated doctor reports through a sophisticated question-answering system.

### Model Deployment Strategy
![Endpoint](Images/Endpoints.png)

We deploy OpenBioLLM, a Llama-based model fine-tuned on biomedical data(This is a pretrained model from hugging face and we are not finetuning it), through SageMaker's managed endpoints. The deployment process involves packaging the pre-trained model, configuring the endpoint for optimal performance, and establishing auto-scaling policies to handle varying loads. Our endpoint configuration utilizes ml.g4dn.xlarge instances with auto-scaling capabilities, ensuring cost-effective yet responsive model serving.

### Model Versioning and Tracking
![MLFlow](Images/MLFlow.png)

The system integrates with SageMaker's managed MLflow service for comprehensive experiment tracking and model versioning. Each model configuration and deployment is tracked through MLflow, with artifacts stored in S3 buckets. This integration enables version control of model configurations, monitoring of deployment performance, and systematic tracking of model interactions. The MLflow dashboard provides insights into model performance metrics, making it easier to maintain and optimize our deployment over time.

### Integration Architecture
The deployment integrates seamlessly with our larger pipeline, where doctor reports generated from our RAG system are stored and versioned in MLflow. Users can query these reports through the deployed OpenBioLLM endpoint, receiving medically-contextualized responses. This architecture ensures reliable model serving while maintaining comprehensive tracking of all model interactions and configurations.


## Deployemnt Automation through Continuous Integration and Deployment Pipeline

### Overview
Our project implements a sophisticated CI/CD pipeline using GitHub Actions, ensuring automated testing, building, and deployment of our healthcare application components. This automation pipeline is defined in two key workflow files: `.github/workflows/continuous_integration.yml` for testing and `.github/workflows/continuous_deployment.yml` for deployment, creating a seamless path from development to production.

### Continuous Integration Process
Our CI pipeline automatically triggers on pull requests to the staging branch, specifically monitoring changes in the backend directory. The pipeline executes comprehensive testing of both ML and data components:

The ML pipeline testing encompasses multiple critical areas:
- Retrieval validation ensuring accurate case matching
- Bias metric evaluation for fairness in medical responses
- Integrated pipeline testing for end-to-end functionality
- Environment variable validation for secure configuration

The data pipeline testing validates:
- Data download processes
- Preprocessing functionality
- Data quality checks

Each test execution is monitored, with automated email notifications sent to the team indicating success or failure, enabling quick response to any issues that arise during the integration process.

### Continuous Deployment Strategy
The deployment pipeline, triggered automatically on pushes to the main branch from the staging branch, handles the deployment of both frontend and backend components to our EKS cluster. The process includes:

1. **Container Image Building**
   - Automated building of Docker images for both frontend and backend
   - Push to Amazon ECR with versioning
   - Platform-specific builds (linux/amd64) for compatibility

2. **Kubernetes Deployment**
   - Automatic update of EKS cluster configuration
   - Rolling deployment to ensure zero-downtime updates
   - Service configuration and load balancer setup
   - Health check validation

3. **Notification System**
   - Automated email notifications for deployment status
   - Detailed reporting of success/failure for each component
   - Team-wide communication of deployment results

This automated pipeline ensures that our medical analysis system remains current and reliable, with minimal manual intervention required for updates and deployments. The process maintains high standards for testing and deployment while providing comprehensive monitoring and notification systems for the development team.


## Model and Data Drift Monitoring

### Overview
Our system implements targeted monitoring for data drift and model performance, specifically designed for our pre-trained model architecture. While we utilize pre-trained models (GPT and OpenBioLLM) that we can't retrain, we focus on monitoring embedding quality and data distribution changes to ensure system reliability.

### Data Drift Detection

#### Age Distribution Monitoring
We track changes in patient age distributions as a key demographic indicator:
- Continuous monitoring of age statistics in incoming data
- Comparison with baseline distribution
- Automated alerts for significant distribution shifts
- Integration with our Lambda-triggered embedding updates

Example threshold configuration:
```python
AGE_DRIFT_THRESHOLD = 0.15  # 15% deviation from baseline
ALERT_FREQUENCY = "daily"
```

### Model Performance Monitoring

#### RAG Retrieval Quality
We implement continuous monitoring of retrieval scores to ensure relevant case matching:
- Threshold-based monitoring (minimum score: 0.5)
- Automated alerts for low-similarity retrievals
- Tracking of retrieval score distributions
- Integration with MLflow for metric logging

#### Automated Embedding Updates
Our system already maintains freshness through automated processes:
- Lambda function triggers for new data processing
- Automatic embedding generation and storage
- Seamless integration with Pinecone vector database
- Real-time updates to the retrieval system

### Implementation Benefits
1. **Continuous Adaptation**
   - New medical cases automatically embedded
   - Vector database constantly updated
   - No manual retraining required

2. **Quality Assurance**
   - Regular monitoring of retrieval quality
   - Age distribution drift detection
   - Automated alert system

3. **System Reliability**
   - Pre-trained model stability
   - Fresh, relevant embeddings
   - Consistent performance tracking

This monitoring approach ensures system reliability while leveraging the strengths of our pre-trained models and automated embedding updates.


## Logging and Monitoring Infrastructure

![Cloud Watch](Images/CloudWatch.png)

### Overview
Our application implements comprehensive logging through Amazon CloudWatch, providing centralized log management and monitoring capabilities across all components of our healthcare system. The logging infrastructure captures detailed operational data from our EKS cluster, Lambda functions, and SageMaker endpoints, enabling real-time monitoring and troubleshooting of our medical analysis pipeline.

### CloudWatch Implementation
CloudWatch serves as our primary logging solution, collecting logs from multiple sources within our architecture. As shown in the CloudWatch console, we maintain distinct log groups for different components, including `/aws/eks/PatientInsightEKSCluster/cluster` for Kubernetes operations, `/aws/lambda/airflow_trigger` for our automated data processing, and `/aws/sagemaker/Endpoints/Llama3-OpenBioLLM-8B-patientInsight-endpoint` for model inference monitoring. This structured approach to log management ensures easy access to component-specific information while maintaining a comprehensive view of system operations.

### Log Management Strategy
Our logging strategy emphasizes automated collection and retention of operational data. CloudWatch agents deployed across our infrastructure automatically gather logs from application containers, system components, and AWS services. These logs are retained according to defined policies, with critical system logs kept for extended periods to support long-term analysis and compliance requirements. The logging system captures various operational aspects, including application performance metrics, error traces, and system health indicators.

### Monitoring and Alerting
The CloudWatch infrastructure not only collects logs but also enables proactive monitoring through custom metrics and alerts. We've configured automated notifications for critical events such as deployment failures, model performance degradation, or system errors. These alerts are integrated with our notification system, ensuring that the development team can respond quickly to any operational issues that arise in our medical analysis system.