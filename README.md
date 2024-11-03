# PatientInsight

![Banner Placeholder](assets/BannerImg.webp)

**PatientInsight** is an advanced AI-driven tool designed to provide patients with meaningful insights into their medical reports and prescriptions. By simplifying complex data, it enhances the user experience and helps doctors prioritize urgent cases efficiently.

## Overview

With the increasing complexity of medical information, patients often struggle to understand their reports and prescriptions. **PatientInsight** addresses this gap by leveraging machine learning and AI to provide easy-to-understand summaries and actionable insights.

Key features include:
- **Report Summarization**: Converts complex medical data into simple, patient-friendly language.
- **Urgency Detection**: Automatically identifies critical reports and notifies healthcare providers to prioritize urgent patients.
- **Prescription Insights**: Offers detailed explanations and guidance on prescriptions.
- **Custom Notifications**: Alerts patients and doctors about important findings and follow-up actions.

## Features

1. **Patient-Friendly Summaries**: Simplifies technical jargon in medical reports.
2. **AI-Powered Urgency Detection**: Alerts doctors about critical cases that require immediate attention.
3. **Prescription Explanations**: Breaks down medication information into understandable terms for patients.
4. **Interactive Dashboard**: Provides a visual representation of patient data and insights.
5. **Integration with EHR**: Seamless integration with existing electronic health records systems for doctors.

## Installation

To use PatientInsight, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/patient-insight.git
   cd patient-insight
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Airflow:
   ```bash
   export AIRFLOW_HOME=$(pwd)/airflow
   airflow db init
   airflow users create --username admin --password admin --firstname Admin --lastname User --role Admin --email admin@example.com
   ```

5. Start the Airflow webserver and scheduler:
   ```bash
   airflow webserver --port 8080
   airflow scheduler
   ```

6. Access the Airflow web interface at `http://localhost:8080` and enable the `patient_insight_pipeline` DAG.

7. Run the application:
   ```bash
   streamlit run app.py
   ```

## Usage

Once the application is running, simply upload your medical report or prescription document. The tool will automatically analyze the content and provide actionable insights in a user-friendly format.

## Data Pipeline

The data pipeline is orchestrated using Apache Airflow. Once the DAG is enabled, it will run automatically according to the schedule defined in the DAG file.

To run the pipeline manually:

1. Go to the Airflow web interface.
2. Navigate to the `patient_insight_pipeline` DAG.
3. Click on the "Trigger DAG" button.

## Project Structure

- `data/`: Contains raw and processed data files.
- `sripts_location/`: Source code for data processing and analysis.
- `tests/`: Unit tests for the project.
- `airflow/`: Airflow DAG definitions.
- `notebooks/`: Jupyter notebooks for exploratory analysis.

## Dataset

This tool leverages insights derived from the [PMC-Patients](https://huggingface.co/datasets/zhengyun21/PMC-Patients) dataset. The dataset includes patient summaries and relationships extracted from case reports, aiding in identifying patterns across medical reports and offering enhanced decision support for doctors.

## Data Versioning

This project uses DVC (Data Version Control) to manage and version the dataset. To get the latest version of the data, run:

```bash
dvc pull
```

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) to get started.

### Collaborators

- **Your Name** - [Your Contact Info]
- **Collaborator Placeholder**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
