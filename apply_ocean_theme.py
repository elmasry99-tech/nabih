import os
import glob

replacements = [
    ("#F4F6F5", "#FFFFFF"),
    ("rgba(244, 246, 245,", "rgba(255, 255, 255,"),
    
    ("#1C1F21", "#0B3A6E"),
    ("rgba(28,31,33,", "rgba(11, 58, 110,"),
    ("rgba(28, 31, 33,", "rgba(11, 58, 110,"),
    ("rgba(21, 59, 68,", "rgba(11, 58, 110,"),

    ("#1F7A63", "#2EC4B6"),
    ("rgba(31,122,99,", "rgba(46, 196, 182,"),
    ("rgba(31, 122, 99,", "rgba(46, 196, 182,"),
    
    ("#3FA7A3", "#6ED3CF"),
    ("rgba(63,167,163,", "rgba(110, 211, 207,"),
    ("rgba(63, 167, 163,", "rgba(110, 211, 207,"),

    ("#2ECC71", "#7ED957"),
    ("rgba(46,204,113,", "rgba(126, 217, 87,"),
    ("rgba(46, 204, 113,", "rgba(126, 217, 87,"),

    ("#6FBF8F", "#7ED957"),

    ("#f59e0b", "#F4C20D"),
    ("rgba(245,158,11,", "rgba(244, 194, 13,"),
    ("rgba(245, 158, 11,", "rgba(244, 194, 13,"),

    ("#64748b", "#1F5F9B"),
    ("rgba(100,116,139,", "rgba(31, 95, 155,"),
    ("rgba(100, 116, 139,", "rgba(31, 95, 155,"),

    # Catch old colors just in case
    ("#16a34a", "#2EC4B6"),
    ("rgba(22, 163, 74,", "rgba(46, 196, 182,"),
    ("rgba(22,163,74,", "rgba(46, 196, 182,"),
    ("#0891b2", "#6ED3CF"),
    ("rgba(8, 145, 178,", "rgba(110, 211, 207,"),
    ("rgba(8,145,178,", "rgba(110, 211, 207,"),
    ("#1f2937", "#0B3A6E"),
    ("rgba(31, 41, 55,", "rgba(11, 58, 110,"),
    ("rgba(31,41,55,", "rgba(11, 58, 110,"),
    ("#6D4C41", "#0B3A6E"),
    ("rgba(109,76,65,", "rgba(11, 58, 110,"),
    ("rgba(109, 76, 65,", "rgba(11, 58, 110,"),
    ("#4b5563", "#1F5F9B"),
    ("rgba(75, 85, 99,", "rgba(31, 95, 155,"),
    ("rgba(75,85,99,", "rgba(31, 95, 155,"),
    ("#4FC3F7", "#6ED3CF"),
    ("rgba(79,195,247,", "rgba(110, 211, 207,"),
    ("rgba(79, 195, 247,", "rgba(110, 211, 207,"),
    ("#2E7D32", "#2EC4B6"),
    ("rgba(46,125,50,", "rgba(46, 196, 182,"),
    ("rgba(46, 125, 50,", "rgba(46, 196, 182,")
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
        if old_str.startswith("#"):
            new_content = new_content.replace(old_str.lower(), new_str)
            
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

print("Ocean theme applied successfully.")
