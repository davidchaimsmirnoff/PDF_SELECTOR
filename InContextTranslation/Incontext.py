import re

# Hebrew dictionary for root detection and translation mapping
hebrew_dictionary = {
    "דעת": {"root": "ידע", "pos": "Noun", "translation": "Knowledge"},
    "ותבונה": {"root": "בין", "pos": "Noun", "translation": "Understanding"},
    "פתיחה": {"root": "פתח", "pos": "Noun", "translation": "Opening"},
    "ראשונה": {"root": "ראש", "pos": "Adjective", "translation": "First"},
    "ישמע": {"root": "שמע", "pos": "Verb (Future)", "translation": "Will hear"},
    "השומע": {"root": "שמע", "pos": "Noun", "translation": "The one who hears"},
    "ויבין": {"root": "בין", "pos": "Verb (Future)", "translation": "Will understand"},
    "המשכיל": {"root": "שכל", "pos": "Noun", "translation": "The wise person"},
    "את": {"root": None, "pos": "Preposition", "translation": "(direct object marker)"},
    "אשר": {"root": None, "pos": "Conjunction", "translation": "That, Which"},
    "חכמים": {"root": "חכם", "pos": "Noun (Plural)", "translation": "Wise people"},
    "הגידו": {"root": "נגד", "pos": "Verb (Past)", "translation": "They told"},
}

# Hebrew prefixes and suffixes
prefixes = ["ו", "ה", "ל", "מ", "ב", "כ", "ש"]
suffixes = ["ים", "ות", "ה", "ן", "י"]

def strip_affixes(word):
    """Remove common Hebrew prefixes and suffixes to find the base form."""
    original_word = word

    # Remove prefixes
    for pre in prefixes:
        if word.startswith(pre) and len(word) > 2:
            word = word[1:]

    # Remove suffixes
    for suf in suffixes:
        if word.endswith(suf) and len(word) > 2:
            word = word[:-len(suf)]

    return word if word != original_word else word  # Return stripped root

def analyze_sentence(sentence):
    """Break sentence into words, analyze each, and apply translation rules."""
    words = re.findall(r'\b[\u0590-\u05FF]+\b', sentence)  # Extract only Hebrew words
    translated_sentence = []
    
    for word in words:
        base_word = strip_affixes(word)  # Strip prefixes/suffixes
        analysis = hebrew_dictionary.get(base_word, None)  # Look up word in dictionary

        if analysis:
            translated_sentence.append(analysis["translation"])
        else:
            translated_sentence.append(f"[{word}]")  # Unknown words stay unchanged

    return " ".join(translated_sentence)

# Example sentence
hebrew_text = "דעת ותבונה פתיחה ראשונה ישמע השומע ויבין המשכיל את אשר חכמים הגידו"
translated_output = analyze_sentence(hebrew_text)
print("Translated Sentence:", translated_output)
