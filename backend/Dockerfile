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

# Copy the backend directory
COPY . .

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/backend
ENV PINECONE_API_KEY=pcsk_4Qwjp7_T8V3KY5Mx2nAaqcubgftSUHHSzfSP4JsL3mzXNQfiLSH3R5K7dooq3FBPgnmt2U
ENV PINECONE_ENVIRONMENT=us-east-1
ENV PINECONE_INDEX_NAME=patientinsight-rag
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_REGION=us-east-2

# Run the application
CMD ["python", "run.py"]