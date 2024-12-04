#!/bin/bash
set -e  # Exit on error

CLUSTER_NAME=patient-insight-eks-cluster
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
OIDC_PROVIDER=$(aws eks describe-cluster --name $CLUSTER_NAME --query "cluster.identity.oidc.issuer" --output text | sed -e "s/^https:\/\///")

PROM_SERVICE_ACCOUNT_NAMESPACE=prometheus
GRAFANA_SERVICE_ACCOUNT_NAMESPACE=grafana
SERVICE_ACCOUNT_NAME=iamproxy-service-account
SERVICE_ACCOUNT_IAM_ROLE=EKS-AMP-ServiceAccount-Role
SERVICE_ACCOUNT_IAM_POLICY=AWSManagedPrometheusWriteAccessPolicy

# Create trust policy
cat <<EOF > TrustPolicy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:sub": "system:serviceaccount:${GRAFANA_SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${AWS_ACCOUNT_ID}:oidc-provider/${OIDC_PROVIDER}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "${OIDC_PROVIDER}:sub": "system:serviceaccount:${PROM_SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}"
        }
      }
    }
  ]
}
EOF

# Create permission policy
cat <<EOF > PermissionPolicy.json
{
   "Version":"2012-10-17",
   "Statement":[
      {
         "Effect":"Allow",
         "Action":[
            "aps:RemoteWrite",
            "aps:QueryMetrics",
            "aps:GetSeries",
            "aps:GetLabels",
            "aps:GetMetricMetadata"
         ],
         "Resource":"*"
      }
   ]
}
EOF

# Create the IAM policy if it doesn't exist
if ! aws iam get-policy --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${SERVICE_ACCOUNT_IAM_POLICY} 2>/dev/null; then
    echo "Creating new IAM policy ${SERVICE_ACCOUNT_IAM_POLICY}"
    aws iam create-policy \
        --policy-name ${SERVICE_ACCOUNT_IAM_POLICY} \
        --policy-document file://PermissionPolicy.json
fi

# Create the IAM role if it doesn't exist
if ! aws iam get-role --role-name ${SERVICE_ACCOUNT_IAM_ROLE} 2>/dev/null; then
    echo "Creating new IAM role ${SERVICE_ACCOUNT_IAM_ROLE}"
    aws iam create-role \
        --role-name ${SERVICE_ACCOUNT_IAM_ROLE} \
        --assume-role-policy-document file://TrustPolicy.json

    # Attach the policy to the role
    aws iam attach-role-policy \
        --role-name ${SERVICE_ACCOUNT_IAM_ROLE} \
        --policy-arn arn:aws:iam::${AWS_ACCOUNT_ID}:policy/${SERVICE_ACCOUNT_IAM_POLICY}
fi

# Associate OIDC provider with the cluster
eksctl utils associate-iam-oidc-provider --cluster ${CLUSTER_NAME} --approve

echo "Setup completed successfully!"