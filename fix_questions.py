import ast
import json
import re

def fix():
    with open('src/app/data/questions.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the JSON array
    json_str_match = re.search(r'export const EXAM_QUESTIONS: Question\[\] = (\[.*?\]);', content, re.DOTALL)
    if not json_str_match:
        print("Could not find json array")
        return
        
    array_str = json_str_match.group(1)
    # Remove trailing commas
    array_str = re.sub(r',\s*\]', ']', array_str)
    
    questions = json.loads(array_str)
    
    for q in questions:
        if len(q['options']) == 0:
            text = q['text']
            # Regex to find ' A. ', ' B. ', etc. Needs carefully matching because it might be ' A. ', ' B. ' or just 'A. '
            match = re.search(r'(.*?)( A\..*)', text)
            if match:
                q['text'] = match.group(1).strip()
                options_str = match.group(2).strip() # "A. Something B. Else"
                
                # We can split using ' (?=[A-E]\. )' or similar
                # Just use A\., B\., etc.
                opts = re.split(r'\s+(?=[A-E]\.\s)', " " + options_str)
                options = []
                for o in opts:
                    o = o.strip()
                    if o:
                        # Strip the 'A. ' prefix
                        o_clean = re.sub(r'^[A-E]\.\s*', '', o)
                        options.append(o_clean)
                
                if options:
                    q['options'] = options
                else:
                    print(f"Failed to parse options for q {q['id']}")
            else:
                print(f"No match for A. in Q {q['id']}: {text[:50]}")
                
    # Write back
    out = "import { Question } from '../models/question.model';\n\n"
    out += "export const EXAM_QUESTIONS: Question[] = [\n"
    for q in questions:
        out += f"  {json.dumps(q)},\n"
    out += "];\n"
    
    with open('src/app/data/questions.ts', 'w', encoding='utf-8') as f:
        f.write(out)

if __name__ == '__main__':
    fix()
