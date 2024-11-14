from setuptools import setup, find_packages

setup(
    name="patient_insight",
    version="0.1",
    packages=find_packages(),
    package_dir={'': 'backend'},
    install_requires=[
        'pandas',
        'numpy',
        'tensorflow',
        'apache-airflow',
        'ydata-profiling',
        'requests',
        'datasets',
        'python-dotenv',
        'psycopg2-binary'
    ]
)