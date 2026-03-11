import logging
import asyncio
import functools
import re
from typing import Dict, Any, List
from src.rag.answer_generation_engine import AnswerGenerationEngine

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

        prompt = f"""You are a senior banking procurement officer. An RFP has been updated. 
Generate a formal 'Corrigendum Notice' that clearly communicates these changes to all vendors.

ORIGINAL RFP CONTEXT (Sample):
{safe_original}...

SPECIFIC CHANGES MADE:
{safe_changes}

The notice must include:
1. Official Corrigendum Number
2. Date of Issuance
3. Section-wise comparison: 'Original Provision' vs 'Revised Provision'
4. Impact on submission deadlines (if any)
5. A concluding statement that all other terms remain unchanged.

Write in a formal, professional, and transparent tone.
"""

        if self.decision_engine.use_mistral:
            try:
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
