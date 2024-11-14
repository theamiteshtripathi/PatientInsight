from opensearchpy import OpenSearch

class OpenSearchHandler:
    def __init__(self):
        self.client = OpenSearch(
            hosts=[{'host': opensearch_endpoint, 'port': 443}],
            http_auth=aws_auth,
            use_ssl=True
        )
    
    def index_pdf_content(self, patient_id, pdf_content):
        self.client.index(
            index='patient-documents',
            body={'content': pdf_content, 'patient_id': patient_id}
        ) 