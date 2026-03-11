import os
import logging
from typing import List, Dict, Any
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
import datetime

class PDFGenerator:
    """
    Template Engine that maps structured JSON data into a professional PDF.
    Uses Jinja2 for HTML rendering and xhtml2pdf for PDF generation.
    """
    def __init__(self, output_dir: str = "generated_rfps", template_dir: str = None):
        # Determine the base directory (backend/)
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        if output_dir == "generated_rfps":
            self.output_dir = os.path.join(base_dir, "generated_rfps")
        else:
            self.output_dir = output_dir
            
        if template_dir is None:
            self.template_dir = os.path.join(base_dir, "src", "templates")
        else:
            self.template_dir = template_dir
            
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Initialize Jinja2 environment
        self.env = Environment(loader=FileSystemLoader(self.template_dir))
        self.template_name = "rfp_template.html"

    def generate_rfp_pdf(self, rfp_id: int, title: str, sections: List[Dict[str, Any]], organization: str = "Institutional Banking", submission_deadline: str = "As per Schedule") -> str:
        """
        Renders the RFP using a Jinja2 template and converts it to PDF.
        """
        file_path = os.path.join(self.output_dir, f"rfp_{rfp_id}.pdf")
        
        try:
            # 1. Prepare Data for Template
            issue_date = datetime.datetime.now().strftime("%d %B %Y")
            
            template_data = {
                "rfp_id": rfp_id,
                "title": title,
                "organization": organization,
                "issue_date": issue_date,
                "submission_deadline": submission_deadline,
                "sections": sections
            }
            
            # 2. Render HTML via Jinja2
            template = self.env.get_template(self.template_name)
            html_content = template.render(template_data)
            
            # 3. Convert HTML to PDF via xhtml2pdf
            with open(file_path, "w+b") as result_file:
                pisa_status = pisa.CreatePDF(
                    html_content,
                    dest=result_file
                )
                
            if pisa_status.err:
                logging.error(f"PDF Generation Error for RFP {rfp_id}: {pisa_status.err}")
            else:
                logging.info(f"Professional Jinja2-based PDF generated: {file_path}")
                
            return file_path
            
        except Exception as e:
            logging.error(f"Error in Jinja2-PDF Pipeline: {e}")
            return f"Error: {str(e)}"
