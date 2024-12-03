from backend.ml_pipeline.HealthcareLLMChat.model.chat_pipeline import ChatPipeline
from backend.ml_pipeline.RAG.main import main as rag_main
from backend.config.config import Config
from backend.ml_pipeline.HealthcareLLMChat.utils.prompt_templates import SYSTEM_PROMPT, INITIAL_PROMPT, FOLLOW_UP_PROMPT
from backend.ml_pipeline.HealthcareLLMChat.model.symptom_analyzer import SymptomAnalyzer
from backend.ml_pipeline.RAG.generator import Generator
from fpdf import FPDF
from datetime import datetime
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from io import BytesIO

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

def generate_pdf_report(chat_history, user_id):
    try:
        # Create a BytesIO buffer instead of a file
        buffer = BytesIO()
        
        # Create the PDF document
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )

        # Create the story for the PDF
        Story = []
        styles = getSampleStyleSheet()
        
        # Add title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30
        )
        title = Paragraph("Chat Conversation Summary", title_style)
        Story.append(title)
        
        # Add timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        timestamp_text = Paragraph(f"Generated on: {timestamp}", styles["Normal"])
        Story.append(timestamp_text)
        Story.append(Spacer(1, 12))
        
        # Add chat messages
        for message in chat_history:
            # Format each message
            role = message.get('role', 'unknown').capitalize()
            content = message.get('content', '')
            
            # Style for the role (who's speaking)
            role_style = ParagraphStyle(
                'Role',
                parent=styles['Normal'],
                textColor=colors.blue,
                fontSize=12,
                fontWeight='bold'
            )
            role_text = Paragraph(f"{role}:", role_style)
            Story.append(role_text)
            
            # Style for the message content
            message_style = ParagraphStyle(
                'Message',
                parent=styles['Normal'],
                fontSize=11,
                leftIndent=20
            )
            message_text = Paragraph(content, message_style)
            Story.append(message_text)
            Story.append(Spacer(1, 12))

        # Build the PDF
        doc.build(Story)
        
        # Get the value from the buffer
        pdf_data = buffer.getvalue()
        buffer.close()

        # Connect to database and store the PDF
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Insert into database
        insert_query = """
        INSERT INTO patient_reports 
        (user_id, report_name, report_data, report_type, description)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """
        
        report_name = f"Chat Summary - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
        cur.execute(insert_query, (
            user_id,
            report_name,
            pdf_data,
            'chat_summary',
            'AI Chat Conversation Summary'
        ))

        report_id = cur.fetchone()['id']
        conn.commit()
        cur.close()
        conn.close()

        return {
            "success": True,
            "report_id": report_id,
            "message": "Report generated and saved to database"
        }

    except Exception as e:
        print(f"Error generating PDF report: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    Config.validate_env_vars()
    pipeline = ChatIntegration(Config.OPENAI_API_KEY)
    pipeline.run_conversation_and_analysis()