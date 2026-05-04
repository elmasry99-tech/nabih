import os
import glob

replacements = [
    ("#16a34a", "#2E7D32"),
    ("rgba(22, 163, 74,", "rgba(46, 125, 50,"),
    ("rgba(22,163,74,", "rgba(46,125,50,"),
    ("#0891b2", "#4FC3F7"),
    ("rgba(8, 145, 178,", "rgba(79, 195, 247,"),
    ("rgba(8,145,178,", "rgba(79,195,247,"),
    ("#1f2937", "#6D4C41"),
    ("rgba(31, 41, 55,", "rgba(109, 76, 65,"),
    ("rgba(31,41,55,", "rgba(109,76,65,"),
    ("#4b5563", "#6D4C41")
]

files_to_check = []
for ext in ["**/*.tsx", "**/*.css"]:
    files_to_check.extend(glob.glob("app/" + ext, recursive=True))
    files_to_check.extend(glob.glob("components/" + ext, recursive=True))

for filepath in files_to_check:
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old_str, new_str in replacements:
        new_content = new_content.replace(old_str, new_str)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

print("Theme applied successfully.")
