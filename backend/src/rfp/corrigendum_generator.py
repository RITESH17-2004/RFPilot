import logging
import asyncio
import functools
import re
import datetime
from typing import Dict, Any, List
from src.rag.answer_generation_engine import AnswerGenerationEngine
from config import Config

def sanitize_text(text: str) -> str:
    """Removes non-ASCII characters that cause encoding issues in some environments."""
    if not text: return ""
    return re.sub(r'[^\x00-\x7F]+', ' ', text)

class CorrigendumGenerator:
    """
    Identifies changes in RFPs and generates official corrigendum notices.
    """
    def __init__(self, decision_engine: AnswerGenerationEngine):
        self.decision_engine = decision_engine

    async def generate_notice(self, original_content: str, updated_content: str, changes: str) -> str:
        """
        Uses LLM to generate a formal corrigendum notice based on specific changes.
        """
        logging.info("Generating corrigendum notice.")
        
        # Sanitize inputs to prevent encoding crashes
        safe_original = sanitize_text(original_content[:1000])
        safe_changes = sanitize_text(changes)
        
        # 1. Automate Issuance Date
        current_date = datetime.datetime.now().strftime("%d %B %Y")
        
        # 2. Retrieve Centralized Institutional Details
        bank_name = Config.BANK_NAME
        division = Config.BANK_DIVISION
        officer = Config.OFFICER_NAME
        contact = f"Email: {Config.OFFICER_CONTACT} | Tel: {Config.OFFICER_PHONE}"
        location = Config.HEADQUARTERS

        prompt = f"""You are a senior banking procurement officer at {bank_name}. 
Generate a formal 'Corrigendum Notice' that clearly communicates RFP updates to all participating vendors.

ORIGINAL RFP CONTEXT (Sample):
{safe_original}...

SPECIFIC CHANGES MADE:
{safe_changes}

MANDATORY FORMATTING INSTRUCTIONS:
1. Use a professional, institutional structure.
2. HEADER: '{bank_name} - {division}'.
3. INCLUDE: A unique 'Corrigendum Identification Number' (e.g., IB/CORR/2026/00X).
4. DATE OF ISSUANCE: {current_date} (MANDATORY).
5. COMPARISON TABLE: Present changes in a clear, text-based table format:
   - SECTION / CLAUSE REFERENCE
   - ORIGINAL PROVISION (Briefly summarized)
   - REVISED PROVISION (The new official language)
6. DEADLINES: Explicitly state if the 'Bid Submission Deadline' has changed.
7. ISSUING AUTHORITY:
   - Name: {officer}
   - Contact: {contact}
   - Location: {location}
8. CLOSING: A standard legal disclaimer stating all other terms and conditions remain unchanged.
9. TONE: Formal, precise, and authoritative. 
10. DO NOT use markdown symbols like '**' or '###'. Use plain text capitalization for headings.
11. DO NOT use placeholders like '[Insert Date]'. 
"""

        if self.decision_engine.use_mistral:
            try:
                # Add delay to avoid Mistral Free Tier Rate Limits (1 RPS limit)
                logging.info("Sleeping for 2.5 seconds to respect Mistral free-tier rate limits...")
                await asyncio.sleep(2.5)
                
                messages = [
                    {"role": "system", "content": "You are a senior banking procurement officer expert in contract modifications."},
                    {"role": "user", "content": prompt}
                ]
                
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    self.decision_engine.executor,
                    functools.partial(
                        self.decision_engine.client.chat.complete,
                        model="mistral-small-latest",
                        messages=messages,
                        temperature=0.3, 
                        max_tokens=1500
                    )
                )
                
                notice_content = response.choices[0].message.content.strip()
                logging.info("Corrigendum notice generated successfully.")
                return notice_content
                
            except Exception as e:
                logging.error(f"Error generating corrigendum with Mistral: {e}")
                return f"Error generating corrigendum notice: {str(e)}"
        else:
            return "Mistral API is not configured. Corrigendum generation requires an active LLM API."

    async def apply_intelligent_update(self, original_json_str: str, change_description: str) -> str:
        """
        Uses LLM to take an existing RFP (JSON string) and apply natural language changes.
        Forces the AI to return the ENTIRE document to ensure no data loss.
        """
        logging.info("Applying intelligent update to RFP.")
        
        # Sanitize inputs to prevent encoding crashes
        safe_json = sanitize_text(original_json_str)
        safe_desc = sanitize_text(change_description)

        prompt = f"""You are a professional RFP editor for a major bank. 
CRITICAL TASK: Take the existing RFP JSON and APPLY the specific changes described below.

EXISTING RFP (JSON):
{safe_json}

CHANGES TO APPLY:
{safe_desc}

MANDATORY INSTRUCTIONS:
1. Return the ENTIRE RFP JSON object. Do not omit any sections, clauses, or tables, even if they haven't changed.
2. Maintain the EXACT SAME JSON schema and structure.
3. Surgical Edits: Only modify the specific values (dates, amounts, requirements) mentioned in the 'CHANGES TO APPLY'.
4. Ensure all dates are consistent across the entire document if a deadline change is requested.
5. Return ONLY valid JSON. No preamble, no explanation, no markdown blocks.
"""

        if self.decision_engine.use_mistral:
            try:
                messages = [
                    {"role": "system", "content": "You are a professional JSON editor for banking procurement. You always return the complete, valid JSON object requested."},
                    {"role": "user", "content": prompt}
                ]
                
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    self.decision_engine.executor,
                    functools.partial(
                        self.decision_engine.client.chat.complete,
                        model="mistral-small-latest",
                        messages=messages,
                        temperature=0.1, # Extremely low for exactness
                        response_format={"type": "json_object"}
                    )
                )
                
                updated_json_str = response.choices[0].message.content.strip()
                
                # Basic validation: ensure it looks like a JSON array of sections
                if not (updated_json_str.startswith('[') or updated_json_str.startswith('{')):
                    raise Exception("AI returned malformed JSON.")
                    
                logging.info("Intelligent update applied successfully. Full JSON retrieved.")
                return updated_json_str
                
            except Exception as e:
                logging.error(f"Error applying intelligent update with Mistral: {e}")
                raise Exception(f"Failed to apply intelligent update: {str(e)}")
        else:
            raise Exception("Mistral API is not configured.")
