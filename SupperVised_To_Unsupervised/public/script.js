const serverURL = "http://localhost:3001";


async function getKnowledge(input) {
    try {
        console.log(`Fetching knowledge for: ${input}`); // Debugging log
        const response = await fetch(`http://localhost:3001/knowledge?input=${encodeURIComponent(input)}`);
        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        
        const data = await response.json();
        console.log("Server response:", data); // Log response to debug
        return data;
    } catch (error) {
        console.error("Error fetching knowledge:", error);
        return { response: "Error retrieving data", type: "error" };
    }
}

// Function to send AI training data to the server
async function sendToServer(input, response, method = "supervised", rating = null) {
    try {
        await fetch(`${serverURL}/learn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input, response, method, rating })
        });
    } catch (error) {
        console.error("Error sending to server:", error);
    }
}

// Function to request an unsupervised response
async function getUnsupervisedResponse(input) {
    try {
        const response = await fetch(`${serverURL}/unsupervised?input=${encodeURIComponent(input)}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching unsupervised response:", error);
        return { response: "I tried, but I am unsure.", type: "unsupervised" };
    }
}
async function trainModel() {
    let input = document.getElementById("userInput").value.trim();
    let outputArea = document.getElementById("output");

    if (!input) {
        outputArea.innerHTML = `
            <p>Waiting for input...</p>
            <div id="correctionBox">
                <p>Not quite right? Provide a better response:</p>
                <textarea id="correctionInput" placeholder="Type the correct meaning..."></textarea>
                <button onclick="submitCorrection()">Submit Correction</button>
            </div>
        `;
        return;
    }

    let responseData = await getKnowledge(input);

    let aiGuess = responseData.response !== "I don't know this yet."
        ? `AI's Guess: ${responseData.response} (${responseData.type === "supervised" ? "Supervised Learning ✅" : "Unsupervised Learning 🤖"})`
        : `AI's Guess: I don't know this yet. (Unsupervised Learning 🤖)`;

    outputArea.innerHTML = `
        <div id="aiResponseBox">
            <p>${aiGuess}</p>
        </div>
        <div id="correctionBox">
            <p>Not quite right? Provide a better response:</p>
            <textarea id="correctionInput" placeholder="Type the correct meaning..."></textarea>
            <button onclick="submitCorrection('${input}')">Submit Correction</button>
        </div>
    `;
}

async function submitRating(input, response) {
    let ratingElement = document.querySelector('input[name="rating"]:checked');

    if (!ratingElement) {
        alert("Please select a rating from 1 to 10.");
        return;
    }

    let rating = parseInt(ratingElement.value);
    let correctionBox = document.getElementById("correctionBox");

    if (rating < 10) {
        // If rating is less than 10, ask for a better response
        correctionBox.innerHTML = `
            <p>Provide a better response:</p>
            <textarea id="correctionInput" placeholder="Type the correct meaning..."></textarea>
            <button onclick="submitCorrection('${input}', '${response}')">Submit Correction</button>
        `;
    } else {
        // If rated 10, save as is
        await sendToServer(input, response, "unsupervised", rating);
        document.getElementById("output").innerHTML = `<p>AI Learned: ${response} (Unsupervised Learning ✅ with rating ${rating})</p>`;
    }
}
// Function to submit a user-provided response (always supervised)
async function submitCorrection(input, oldResponse) {
    let newResponse = document.getElementById("correctionInput").value.trim();

    if (!newResponse) {
        alert("Please provide a valid response.");
        return;
    }

    let outputArea = document.getElementById("output");

    // Save the user-corrected response as supervised learning
    await sendToServer(input, newResponse, "supervised");

    outputArea.innerHTML = `<p>AI Learned: "${newResponse}" (Supervised Learning ✅, replacing: "${oldResponse}")</p>`;
}
