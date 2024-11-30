#!/bin/bash
set -e

case "$1" in
  webserver)
    airflow db init
    airflow users create \
        --username admin \
        --firstname Admin \
        --lastname User \
        --role Admin \
        --email tripathi.am@northeasten.edu \
        --password admin
    exec airflow webserver
    ;;
  scheduler)
    exec airflow scheduler
    ;;
  *)
    exec "$@"
    ;;
esac 