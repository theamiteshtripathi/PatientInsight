# Use Python 3.12 slim base image
FROM python:3.12-slim

# Set working directory
WORKDIR /backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set up Airflow directories
RUN mkdir -p /airflow/dags /airflow/logs /airflow/plugins

# Copy the backend directory
COPY . .

# Set environment variables
ENV PYTHONPATH=/backend

# Expose port 8000
EXPOSE 8000 8080

# Run the application
CMD ["bash", "-c", "python run.py & airflow standalone"]