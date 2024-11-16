# Models

This directory contains the core machine learning and AI components of the PatientInsight project, featuring an integrated healthcare conversation system with RAG (Retrieval-Augmented Generation) capabilities.

## Architecture Overview

The system consists of two main components that work together:
1. Healthcare LLM Chat System
2. RAG (Retrieval-Augmented Generation) System

These components are integrated through the IntegratedPipeline class, which orchestrates the entire workflow.

## Components

### 1. Healthcare LLM Chat System

#### Chat Pipeline
The ChatPipeline manages the conversation flow and includes:
- Conversation management
- Emergency detection
- Symptom analysis
- Integration with OpenAI's GPT models

Key features:
- Empathetic conversation handling
- Single question approach (like a real nurse)
- Emergency symptom detection
- Structured symptom analysis

Reference implementation:
```bash
python:backend/models/HealthcareLLMChat/src/tests/chat_pipeline.py
```


#### Emergency Detector
Monitors conversations for critical medical symptoms that require immediate attention

#### Symptom Analyzer
Processes conversation history to generate structured medical summaries

### 2. RAG System
The RAG system enhances responses with relevant medical knowledge

#### Embeddings Handler
Manages document embeddings using SentenceTransformer and Pinecone

#### Retriever
Handles similarity search in the vector database

#### Generator
Generates medical analysis based on retrieved similar cases

### 3. Integrated Pipeline

The IntegratedPipeline combines both systems for a complete healthcare conversation and analysis solution

## Workflow

1. **Conversation Initiation**
   - System starts with a warm greeting
   - Uses empathetic, nurse-like communication

2. **Interactive Conversation**
   - One question at a time approach
   - Real-time emergency detection
   - Structured symptom gathering

3. **Analysis Phase**
   - Generates symptom summary
   - Queries RAG system for similar cases
   - Produces medical analysis

4. **Final Output**
   - Structured symptom summary
   - Evidence-based medical analysis
   - Treatment recommendations based on similar cases

## Testing

The system includes comprehensive tests for all components:

1. Chat Pipeline Testing:
```bash
python:backend/models/HealthcareLLMChat/src/tests/test_chat_pipeline.py
```

2. Symptom Analyzer Testing:
```bash
python:backend/models/HealthcareLLMChat/src/tests/test_symptom_analyzer.py
```

## Getting Started

1. Set up environment variables:
   - OPENAI_API_KEY
   - PINECONE_API_KEY
   - PINECONE_ENVIRONMENT

2. Initialize the RAG system:
   ```bash
   python -m backend.models.RAG.src.setup_embeddings
   ```

3. Run the integrated pipeline:
   ```bash
   python -m backend.models.integrated_pipeline
   ```

## Configuration

Key configurations are managed through the Config class, including:
- API keys
- Model parameters
- Database settings
- Embedding configurations


