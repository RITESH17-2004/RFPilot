import logging
import asyncio
import functools
import re
import datetime
from typing import Dict, Any, List
from src.rag.answer_generation_engine import AnswerGenerationEngine
from config import Config

try:
    from mistralai import Mistral
except ImportError:
    Mistral = None

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
        self.secondary_client = None
        if getattr(Config, 'MISTRAL_API_KEY_2', None) and Mistral:
            self.secondary_client = Mistral(api_key=Config.MISTRAL_API_KEY_2)
            logging.info("Secondary Mistral Client active! Load balancing enabled.")

    async def generate_notice(self, original_content: str, updated_content: str, changes: str) -> str:
        """
        Uses LLM to generate a formal corrigendum notice based on specific changes.
        Includes exponential backoff to handle free-tier rate limits.
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
            max_retries = 5
            base_delay = 5 # Seconds
            
            for attempt in range(max_retries):
                try:
                    # Determine which API Key/Client to use
                    client_to_use = self.secondary_client if self.secondary_client else self.decision_engine.client
                    
                    if attempt > 0:
                        delay = base_delay * (2 ** attempt)
                        logging.warning(f"Rate limit hit. Retrying in {delay} seconds... (Attempt {attempt+1}/{max_retries})")
                        await asyncio.sleep(delay)
                    else:
                        # Even on first attempt, if no secondary key, sleep a bit as we just did an update
                        if not self.secondary_client:
                            await asyncio.sleep(3)
                        else:
                            logging.info("Using Key #2 for Corrigendum Notice.")

                    messages = [
                        {"role": "system", "content": "You are a senior banking procurement officer expert in contract modifications."},
                        {"role": "user", "content": prompt}
                    ]
                    
                    loop = asyncio.get_event_loop()
                    response = await loop.run_in_executor(
                        self.decision_engine.executor,
                        functools.partial(
                            client_to_use.chat.complete,
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
                    if "429" in str(e) and attempt < max_retries - 1:
                        continue
                    logging.error(f"Error generating corrigendum with Mistral: {e}")
                    return f"Error generating corrigendum notice: {str(e)}"
            
            return "Failed to generate corrigendum after multiple retries due to rate limits."
        else:
            return "Mistral API is not configured. Corrigendum generation requires an active LLM API."

    async def apply_intelligent_update(self, original_json_str: str, change_description: str) -> str:
        """
        Uses LLM to take an existing RFP (JSON string) and apply natural language changes.
        Uses a SURGICAL update approach to avoid context limits and data loss.
        """
        logging.info("Applying intelligent surgical update to RFP.")
        
        safe_json = sanitize_text(original_json_str)
        safe_desc = sanitize_text(change_description)

        prompt = f"""You are a precise JSON Patch engine for a banking RFP.
CRITICAL TASK: Based on the `CHANGES TO APPLY`, identify WHICH specific sections from the `EXISTING RFP` need modification.
Output ONLY the sections that require changes. Do not output sections that remain untouched.

CHANGES TO APPLY:
{safe_desc}

EXISTING RFP (JSON):
{safe_json}

MANDATORY INSTRUCTIONS:
1. Output a JSON dictionary where the keys are the exact numeric `section_id` strings (e.g., "3", "5", "10") that need updates.
2. The value for each key must be the fully rewritten, updated JSON object for that specific section.
3. Keep the exact same section schema. ONLY modify the specific dates, amounts, or clauses requested.
4. If the changes affect deadlines, ensure you update the schedule in the relevant sections.

EXAMPLE FORMAT:
{{
  "2": {{ "section_id": 2, "title": "TENDER SCHEDULE", "executive_summary": "...", "clauses": [...] }},
  "8": {{ "section_id": 8, "title": "BID EVALUATION", "executive_summary": "...", "clauses": [...] }}
}}
"""

        if self.decision_engine.use_mistral:
            max_retries = 3
            base_delay = 5
            
            for attempt in range(max_retries):
                try:
                    if attempt > 0:
                        delay = base_delay * (2 ** attempt)
                        logging.warning(f"Retrying update due to rate limit... {delay}s wait.")
                        await asyncio.sleep(delay)

                    messages = [
                        {"role": "system", "content": "You are a professional JSON editor for banking procurement. You output only valid JSON."},
                        {"role": "user", "content": prompt}
                    ]
                    
                    loop = asyncio.get_event_loop()
                    response = await loop.run_in_executor(
                        self.decision_engine.executor,
                        functools.partial(
                            self.decision_engine.client.chat.complete,
                            model="mistral-small-latest",
                            messages=messages,
                            temperature=0.1, 
                            response_format={"type": "json_object"}
                        )
                    )
                    
                    updated_parts_str = response.choices[0].message.content.strip()
                    import json
                    
                    try:
                        updated_nodes = json.loads(updated_parts_str)
                    except json.JSONDecodeError:
                        raise Exception("Mistral truncated the JSON patch output! Retrying...")

                    # Surgically merge the updated nodes back into the original document!
                    original_sections = json.loads(original_json_str)
                    
                    for i, sec in enumerate(original_sections):
                        sec_id = str(sec.get("section_id", sec.get("num", "")))
                        if sec_id in updated_nodes:
                            original_sections[i] = updated_nodes[sec_id]
                            logging.info(f"Surgically applied updates to Section {sec_id}")

                    final_merged_json = json.dumps(original_sections)
                    logging.info("Intelligent surgical update completed without data loss.")
                    return final_merged_json
                    
                except Exception as e:
                    if "429" in str(e) and attempt < max_retries - 1:
                        continue
                    logging.error(f"Error applying intelligent update with Mistral: {e}")
                    raise Exception(f"Failed to apply intelligent update: {str(e)}")
            raise Exception("Mistral rate limits prevented the update.")
        else:
            raise Exception("Mistral API is not configured.")
