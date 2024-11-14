#!/bin/bash
airflow db init

airflow users create \
    --username admin \
    --firstname Admin \
    --lastname User \
    --role Admin \
    --email tripathi.am@northeasten.edu \
    --password admin

airflow connections add 'aws_default' \
    --conn-type 'aws' \
    --conn-login "${AWS_ACCESS_KEY_ID}" \
    --conn-password "${AWS_SECRET_ACCESS_KEY}" \
    --conn-extra "{\"region_name\": \"${AWS_DEFAULT_REGION}\"}"

airflow connections add 'postgres_default' \
    --conn-type 'postgres' \
    --conn-host 'db' \
    --conn-login 'airflow' \
    --conn-password 'airflow' \
    --conn-port 5432 \
    --conn-schema 'airflow'
