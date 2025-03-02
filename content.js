console.log("✅ content.js is running!");

// Function to add Enter key listener
function addKeyListener() {
    console.log("🎯 Adding Enter key listener...");
    
    document.removeEventListener("keydown", handleEnterPress);
    document.addEventListener("keydown", handleEnterPress);
}

// Function to handle Enter key press
async function handleEnterPress(event) {
    console.log("Key pressed:", event.key);

    if (event.key === "Enter") {
        console.log("🚀 Enter key detected! Trying to save selected text...");

        try {
            // Ensure the document is focused
            if (!document.hasFocus()) {
                console.warn("❌ Document is not focused. Cannot access clipboard.");
                return;
            }

            // Simulate a copy action to extract selected text
            document.execCommand("copy");
            console.log("📋 Simulated copy action!");

            // Small delay to ensure clipboard updates
            setTimeout(async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    console.log("📋 Clipboard text read:", text);

                    if (text.trim()) {
                        // Save text to Chrome storage
                        chrome.storage.local.get({ savedSelections: [] }, (data) => {
                            let savedSelections = data.savedSelections;
                            savedSelections.push(text);
                            chrome.storage.local.set({ savedSelections }, () => {
                                console.log("💾 Saved text to storage:", text);
                            });
                        });
                    } else {
                        console.log("⚠️ No text copied from clipboard.");
                    }
                } catch (clipboardError) {
                    console.error("❌ Clipboard read failed:", clipboardError);
                }
            }, 100);
        } catch (err) {
            console.error("❌ Error saving selection:", err);
        }
    }
}

// Function to detect PDF reloads and re-attach listener
function observePageChanges() {
    console.log("🔍 Observing page changes...");
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === "childList") {
                console.log("♻️ PDF reloaded or content changed! Re-attaching Enter key listener...");
                addKeyListener();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initial setup
addKeyListener();
observePageChanges();
