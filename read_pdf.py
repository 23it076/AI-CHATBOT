import pdfplumber
import json

pdf_path = "round-2-degree-engineering-closure-branch-wise1723275242 (1).pdf"
with pdfplumber.open(pdf_path) as pdf:
    first_page = pdf.pages[0]
    tables = first_page.extract_tables()
    text = first_page.extract_text()

with open("scratch_pdf.txt", "w", encoding="utf-8") as f:
    f.write("TEXT:\n")
    f.write(text or "")
    f.write("\n\nTABLES:\n")
    f.write(json.dumps(tables, indent=2, ensure_ascii=False))

print("Done")
