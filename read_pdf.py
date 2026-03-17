import pdfplumber

def extract_text(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text += t + "\n"
    return text

if __name__ == '__main__':
    text = extract_text('public/docs/examquestions.pdf')
    print(text[:2000])
