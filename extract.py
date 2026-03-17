import fitz
import re
import json

def extract_questions_to_ts(pdf_path, ts_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        # get text blocks sorted by reading order
        blocks = page.get_text("blocks")
        # sort blocks by y-coordinate then x-coordinate for columns? 
        # Actually PyMuPDF reading order is usually columns
        for b in blocks:
            full_text += b[4] + "\n"

    # print a sample of the full text to debug if needed
    
    questions = []
    # Regex to capture Question number, text, options, and correct answer
    # This is a basic state machine parser
    lines = full_text.split('\n')
    
    current_q = None
    current_options = []
    current_option_label = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Match Question: "1. What is..."
        q_match = re.match(r'^(\d+)\.\s+(.*)', line)
        ans_match = re.match(r'^Correct Answer:\s*(.*)', line)
        opt_match = re.match(r'^([A-Z])\)\s+(.*)', line)
        
        if q_match:
            if current_q:
                questions.append(current_q)
            current_q = {
                'id': int(q_match.group(1)),
                'text': q_match.group(2),
                'options': [],
                'correctAnswers': [],
                'type': 'single' # Will update based on answers
            }
            current_option_label = None
            continue
            
        if ans_match and current_q:
            ans_str = ans_match.group(1).strip()
            # Parse 'C', 'A and B', 'A, C, and D'
            # Find all capital letters
            answers = re.findall(r'[A-Z]', ans_str)
            # Map 'A' -> 0, 'B' -> 1
            ans_indices = [ord(a) - ord('A') for a in answers]
            current_q['correctAnswers'] = ans_indices
            if len(ans_indices) > 1:
                current_q['type'] = 'multiple'
            # End of question basically
            questions.append(current_q)
            current_q = None
            continue
            
        if opt_match and current_q:
            opt_label = opt_match.group(1)
            opt_text = opt_match.group(2)
            current_q['options'].append(opt_text)
            current_option_label = opt_label
            continue
            
        # Continuation of text
        if current_q and current_option_label:
            current_q['options'][-1] += " " + line
        elif current_q and not current_option_label:
            current_q['text'] += " " + line

    if current_q:
        questions.append(current_q)
        
    # Deduplicate by id if needed
    unique_qs = {}
    for q in questions:
        if q['id'] not in unique_qs:
            unique_qs[q['id']] = q
            
    final_questions = list(unique_qs.values())
    
    # Write to TS
    ts_content = "import { Question } from '../models/question.model';\n\n"
    ts_content += "export const EXAM_QUESTIONS: Question[] = [\n"
    for q in final_questions:
        ts_content += f"  {json.dumps(q)},\n"
    ts_content += "];\n"
    
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print(f"Extracted {len(final_questions)} questions to {ts_path}")

if __name__ == '__main__':
    extract_questions_to_ts('public/docs/examquestions.pdf', 'questions_temp.ts')
