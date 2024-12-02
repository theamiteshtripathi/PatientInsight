from backend.ml_pipeline.HealthcareLLMChat.model.chat_pipeline import ChatPipeline
from backend.ml_pipeline.RAG.main import main as rag_main
from backend.config.config import Config
from backend.ml_pipeline.HealthcareLLMChat.utils.prompt_templates import SYSTEM_PROMPT, INITIAL_PROMPT, FOLLOW_UP_PROMPT
from backend.ml_pipeline.HealthcareLLMChat.model.symptom_analyzer import SymptomAnalyzer
from backend.ml_pipeline.RAG.generator import Generator
from fpdf import FPDF
from datetime import datetime
import os

class ChatIntegration:
    def __init__(self, api_key: str = None):
        self.chat_pipeline = ChatPipeline(api_key)

    def _get_summary_prompt(self):
        analyzer = SymptomAnalyzer(api_key="")
        return analyzer.summary_prompt
    
    def _get_doctor_report_prompt(self):
        return Generator.DOCTOR_REPORT_PROMPT
    
    def generate_pdf(self, summary, medical_analysis):
        pdf = FPDF()
        pdf.add_page()
        
        # Use standard Arial font
        pdf.set_font("Arial", size=12)
        
        # Clean text by replacing problematic characters
        def clean_text(text):
            replacements = {
                '\u2013': '-',  # em dash
                '\u2014': '-',  # en dash
                '\u2018': "'",  # curly single quotes
                '\u2019': "'",
                '\u201c': '"',  # curly double quotes
                '\u201d': '"',
                '\u2022': '*',  # bullet points
                '\u2026': '...',  # ellipsis
                '\u2010': '-',  # hyphen
                '\u2012': '-',  # figure dash
            }
            for old, new in replacements.items():
                text = text.replace(old, new)
            return text
        
        # Title
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(0, 10, "Medical Analysis Report", ln=True, align='C')
        pdf.ln(10)
        
        # Add timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 10, f"Generated on: {timestamp}", ln=True)
        pdf.ln(10)
        
        # Clean and add content
        medical_analysis = clean_text(medical_analysis)
        
        # Analysis section
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 10, medical_analysis)
        
        # Save in backend/ml_pipeline/reports directory
        backend_dir = os.path.dirname(__file__)  # Get ml_pipeline directory path
        reports_dir = os.path.join(backend_dir, 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        filename = os.path.join(reports_dir, f"medical_report_{timestamp.replace(':', '-').replace(' ', '_')}.pdf")
        pdf.output(filename)
        return filename
        
    def run_conversation_and_analysis(self):
        print("Assistant:", self.chat_pipeline.start_conversation())
        
        while True:
            user_input = input("\nUser: ")
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                summary = self.chat_pipeline.generate_summary()
                medical_analysis_response = rag_main(summary)
                medical_analysis = medical_analysis_response['content']
                
                pdf_file = self.generate_pdf(summary, medical_analysis)
                
                print("\nSYMPTOM SUMMARY:")
                print(summary)
                print("\nMEDICAL ANALYSIS:")
                print(medical_analysis)
                print(f"\nPDF report generated: {pdf_file}")
                break
            
            response = self.chat_pipeline.get_response(user_input)
            print("Assistant:", response)

if __name__ == "__main__":
    Config.validate_env_vars()
    pipeline = ChatIntegration(Config.OPENAI_API_KEY)
    pipeline.run_conversation_and_analysis()