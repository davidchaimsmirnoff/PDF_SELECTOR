import json
import re

# Example JSON with full text
data = {
    "book": "Genesis",
    "chapter": 1,
    "hebrewHtml": "בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים ... {פ}<br>וַיֹּ֣אמֶר ...",
    "englishHtml": "1 In the beginning of God's creation ... 2 Now the earth ..."
}

# Automatically split at verse numbers in English
english_verses = re.split(r'(\d+ )', data["englishHtml"])[1:]
english_verses = ["".join(english_verses[i:i+2]) for i in range(0, len(english_verses), 2)]

# Automatically split Hebrew at <br> (or any marker)
hebrew_verses = data["hebrewHtml"].split("<br>")

# Pair Hebrew & English together
paired_verses = [{"hebrew": h, "english": e} for h, e in zip(hebrew_verses, english_verses)]

# New JSON format
new_data = {
    "book": data["book"],
    "chapter": data["chapter"],
    "verses": paired_verses
}

# Save or use the formatted JSON
with open("formatted.json", "w", encoding="utf-8") as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print("Formatted JSON saved!")
