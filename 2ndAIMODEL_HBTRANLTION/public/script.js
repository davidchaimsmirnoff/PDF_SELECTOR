async function translateHebrew() {
    let text = document.getElementById("userInput").value.trim();
    
    try {
        let response = await fetch(`http://localhost:3001/translate?input=${encodeURIComponent(text)}`);
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        let data = await response.json();
        document.getElementById("output").innerHTML = `AI's Guess: ${data.response}`;
    } catch (error) {
        console.error("Translation error:", error);
        document.getElementById("output").innerHTML = "Error connecting to AI.";
    }
}

async function trainAI(input) {
    let correction = document.getElementById("correctionInput").value.trim();
    if (!correction) {
        alert("Please provide a valid response.");
        return;
    }

    await fetch("http://localhost:3001/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, response: correction })
    });

    alert("AI learned successfully!");
    document.getElementById("output").innerHTML = `<p>AI Learned: "${correction}"</p>`;
}
