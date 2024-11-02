import os

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Created directory: {path}")
    else:
        print(f"Directory already exists: {path}")

def create_file(path, content=""):
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write(content)
        print(f"Created file: {path}")
    else:
        print(f"File already exists: {path}")

# Frontend structure
frontend_dirs = [
    "src/components/auth",
    "src/components/dashboard",
    "src/components/common",
    "src/pages",
    "src/services",
    "src/utils",
    "src/context",
    "src/hooks",
    "src/styles/components",
    "public"
]

for dir in frontend_dirs:
    create_directory(dir)

# Backend structure
backend_dirs = [
    "server",
    "data/raw",
    "data/processed",
    "src/data",
    "src/models",
    "tests",
    "airflow/dags",
    "notebooks"
]

for dir in backend_dirs:
    create_directory(dir)

# Create important files
files_to_create = [
    ("src/App.js", ""),
    ("src/index.js", ""),
    ("public/index.html", ""),
    ("src/pages/LoginPage.js", ""),
    ("src/pages/RegisterPage.js", ""),
    ("src/pages/DashboardPage.js", ""),
    ("server/server.js", ""),
    ("src/data/download.py", ""),
    ("src/data/preprocess.py", ""),
    ("tests/test_data_download.py", ""),
    ("tests/test_data_preprocess.py", ""),
    ("airflow/dags/patient_insight_dag.py", ""),
    (".gitignore", "node_modules\n*.pyc\n__pycache__\n.env\n"),
    ("README.md", "# PatientInsight\n\nThis is the README for the PatientInsight project.")
]

for file_path, content in files_to_create:
    create_file(file_path, content)

print("Project structure setup complete!")