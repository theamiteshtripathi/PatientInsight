#!/bin/bash

# Kill any process using port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9 2>/dev/null

# Get the project root directory (one level up from backend)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Add the project root to PYTHONPATH
export PYTHONPATH="${PROJECT_ROOT}:${PYTHONPATH}"

# Start the Flask app
cd "${PROJECT_ROOT}"
python -m backend.run

