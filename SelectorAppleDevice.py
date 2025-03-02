import keyboard
import pyperclip
import time
import platform

content_file = "content.txt"

def update_content(new_text):
    words = new_text.split()
    reversed_text = ' '.join(words[::-1]) if len(words) > 1 else new_text
    with open(content_file, "a", encoding="utf-8") as file:
        file.write(f" {reversed_text}")

def clear_and_copy_text():
    print("Current clipboard content before clear:", pyperclip.paste())
    pyperclip.copy('')  # Clear clipboard
    print("Clipboard cleared.")

    # Detect OS and use the correct copy shortcut
    if platform.system() == "Darwin":  # macOS
        keyboard.press_and_release("command+c")
    else:  # Windows/Linux
        keyboard.press_and_release("ctrl+c")

    time.sleep(1)  # Increase time for clipboard update
    new_clipboard = pyperclip.paste().strip()
    print("Clipboard content after copy attempt:", new_clipboard)
    
    if new_clipboard:
        print(f"Saved: {new_clipboard}")
        update_content(new_clipboard)
    else:
        print("No new text selected. Please select text and press Enter.")

keyboard.add_hotkey("enter", clear_and_copy_text)
print(f"Listening for Enter key... Press Enter to save text to {content_file} (Press Ctrl + C to stop)")
keyboard.wait()
