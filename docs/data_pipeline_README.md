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

Make sure airflow is installed in the system

```bash
airflow -info
```

If not installed follow the steps to install [airflow](https://airflow.apache.org/docs/apache-airflow/stable/installation/index.html).

Once you have airflow installed properly make some config changes for the airflow to pick the dags from the project dags folder. To do that open **airflow.cfg** file and replace the dags_folder_location

**dags_folder = /Project_Location/PatientInsight/airflow/dags**

