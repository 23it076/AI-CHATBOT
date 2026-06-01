import pdfplumber
import json
import re

pdf_path = "round-2-degree-engineering-closure-branch-wise1723275242 (1).pdf"

# Common Gujarat districts to extract from strings
KNOWN_DISTRICTS = [
    "AHMEDABAD", "SURAT", "VADODARA", "RAJKOT", "BHAVNAGAR", "JAMNAGAR",
    "GANDHINAGAR", "JUNAGADH", "ANAND", "NAVSARI", "MORBI", "NADIAD", "SURENDRANAGAR",
    "BHARUCH", "VAPI", "VALSAD", "BHUJ", "KUTCH", "AMRELI", "MEHSANA", "PATAN",
    "PALANPUR", "GODHRA", "PORBANDAR", "BOTAD", "MODASA", "VISNAGAR", "BARDOLI", "KHERVA", "CHANGA", "KARAMSAD", "VASAD"
]

def get_district(college_name):
    # Try to find from known districts
    name_upper = college_name.upper()
    
    # Check the last word or common words
    # Sometimes it is ", SURAT" or "AHMEDABAD" at the end
    last_word = re.split(r'[\s,]+', name_upper)[-1]
    
    if last_word in KNOWN_DISTRICTS:
        return last_word
        
    for d in KNOWN_DISTRICTS:
        if d in name_upper:
            return d
            
    # Default fallback
    return "UNKNOWN"

results = []
seen = set()

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                if not row or not row[0]: continue
                
                # Header row
                if row[0].strip() == "Course_name":
                    continue
                    
                # Clean up newlines in all columns
                cleaned_row = [" ".join(str(cell).split()) if cell else "" for cell in row]
                
                if len(cleaned_row) < 7:
                    continue
                    
                course_name = cleaned_row[0]
                college_name = cleaned_row[1]
                category = cleaned_row[2]
                quota = cleaned_row[3]
                institute_type = cleaned_row[4]
                
                try:
                    opening_rank = float(cleaned_row[5])
                except ValueError:
                    opening_rank = 0.0
                    
                try:
                    closing_rank = float(cleaned_row[6])
                except ValueError:
                    closing_rank = 0.0
                    
                district = get_district(college_name)
                
                entry = {
                    "courseName": course_name,
                    "collegeName": college_name,
                    "category": category,
                    "quota": quota,
                    "instituteType": institute_type,
                    "openingRank": opening_rank,
                    "closingRank": closing_rank,
                    "district": district
                }
                
                # Check for duplicates
                dict_tuple = (course_name, college_name, category, quota, institute_type, opening_rank, closing_rank)
                if dict_tuple not in seen:
                    seen.add(dict_tuple)
                    results.append(entry)

with open("cutoffs.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print(f"Extracted {len(results)} unique cutoffs.")
