# PatientInsight - Data Pipeline

This project, **Patient Insight**, aims to build a modular and reusable data pipeline to clean, transform, and perform feature engineering on healthcare data, specifically targeting patient symptom data. The preprocessing pipeline is designed for flexibility and easy adjustment to ensure scalability.

## Folder structure
- `data/`: Contains raw and processed data files.
- `sripts_location/`: Source code for data processing and analysis.
- `tests/`: Unit tests for the project.
- `airflow/`: Airflow DAG definitions.

## Dataset

This tool leverages insights derived from the [PMC-Patients](https://huggingface.co/datasets/zhengyun21/PMC-Patients) dataset. The dataset includes patient summaries and relationships extracted from case reports, aiding in identifying patterns across medical reports and offering enhanced decision support for doctors.

## Pre requisites
## Setting up DAG's

Make sure airflow is installed in your system.

```bash
airflow -info
```

If not installed follow the steps to install [airflow](https://airflow.apache.org/docs/apache-airflow/stable/installation/index.html).

Once you have airflow installed properly make some config changes for the airflow to pick the dags from the project dags folder. To do that open `airflow.cfg` file and replace the dags_folder_location.

```
dags_folder = /Project_Location/PatientInsight/airflow/dags
```

Whenever we make changes to config file we should make sure to run the `airflow scheduler`.
Use the below command to update the config and run airflow.

```bash
airflow scheduler &
airflow webserver -p 8080
```

You should be seeing your DAG `patient_insight_dag` in the UI.

## Download data
Once you start the DAG, the first task is to download the dataset. 
The task is named `download_data`.
After the task run is completed successfully, you should be seeing the dataset in the folder `data/raw/`.

    ├──data
        ├──raw
            ├──PMC-Patients.csv

## Preprocess
In the DAG, the second task is to prepocess the dataset.
The task is named `preprocess`.
After the task run is completed successfully, you should be seeing the preprocessed dataset in the folder `data/processed/`.

    ├──data
        ├──processed
            ├──PMC-Patients_preprocessed.csv

## Testing
We are using unittest modules in python to test if datasets are downloaded and processed as per requirements.
The files can be found under folder `tests`.

You can run the python file to test if all the unittest are working properly.
For `test_data_download.py`

```bash
python test_data_download.py
```

and for `test_data_preprocess` it's

```bash
python test_data_preprocess.py
```

## Tracking and logging
All the logs are maintaned by airflow.
All the task logs are available under `AIRFLOW_HOME` location under `logs/"dagname"`.

All the print statements are available under logs, we are not using any external logging as airflow does the job for us.

## Anomaly detection and alerts
If there are any issues in DAG tasks, alerts are sent through email when all the task have completed successfully as well as if there are any failures.

### Setting up alerts using mail
We need make few changes in `airflow.cfg` file.
These changes are required to setup SMTP mail address.
The changes are as follows

```
[smtp]
smtp_host = smtp.your_email_provider.com  # Correct SMTP host
smtp_port = 587                            # Common port for TLS
smtp_starttls = True                       # Enable TLS (set to True if required)
smtp_ssl = False                           # Set to False if TLS is True
smtp_user = your_email@domain.com          # Your email username
smtp_password = your_password              # Your email password
smtp_mail_from = airflow@your_domain.com   # Sender email address
```

We used a new gmail account to setup mail alerts, and all the mails are directed using this email id `mlopsgroup11@gmail.com <mlopsgroup11@gmail.com>`.
