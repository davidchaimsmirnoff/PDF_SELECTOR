const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const stringSimilarity = require("string-similarity");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Load or create knowledge file
const knowledgeFile = "knowledge.json";
if (!fs.existsSync(knowledgeFile)) {
    fs.writeFileSync(knowledgeFile, JSON.stringify({ knowledge: {}, history: [] }, null, 2));
}

let knowledgeData = JSON.parse(fs.readFileSync(knowledgeFile, "utf8"));

// Save knowledge persistently
function saveKnowledge() {
    fs.writeFileSync(knowledgeFile, JSON.stringify(knowledgeData, null, 2));
}
function findClosestMatch(input) {
    let storedInputs = Object.keys(knowledgeData.knowledge);

    // 1️⃣ **Check for exact match first**
    if (knowledgeData.knowledge[input]) {
        return { response: knowledgeData.knowledge[input], confidence: 1.0 };
    }

    // 2️⃣ **Check if input is part of a longer phrase**
    for (let phrase of storedInputs) {
        if (phrase.includes(input)) { 
            return { response: `This could mean: "${knowledgeData.knowledge[phrase]}"`, confidence: 0.5 };
        }
    }

    // 3️⃣ **Fallback: Use string similarity matching**
    let matches = stringSimilarity.findBestMatch(input, storedInputs);
    let bestMatch = matches.bestMatch;

    if (bestMatch.rating > 0.4) {
        return { response: knowledgeData.knowledge[bestMatch.target], confidence: bestMatch.rating };
    }

    return { response: "I tried, but I am unsure.", confidence: 0 };
} // ✅ Make sure this function closes properly!





app.get("/knowledge", (req, res) => {
    knowledgeData = JSON.parse(fs.readFileSync(knowledgeFile, "utf8"));
    let input = req.query.input ? req.query.input.toLowerCase().trim() : "";
    
    if (knowledgeData.knowledge[input]) {
        res.json({ response: knowledgeData.knowledge[input], type: "supervised" });
    } else {
        let guessedResponse = findClosestMatch(input);
        
        if (guessedResponse.confidence > 0.3) {
            res.json({ response: guessedResponse.response, type: "unsupervised" });
        } else {
            res.json({ response: "I don't know this yet.", type: "unknown" });
        }
    }
});


// Route to generate an unsupervised response
app.get("/unsupervised", (req, res) => {
    knowledgeData = JSON.parse(fs.readFileSync(knowledgeFile, "utf8"));

    const input = req.query.input ? req.query.input.toLowerCase().trim() : "";
    const guessedResponse = findClosestMatch(input);

    res.json({ response: guessedResponse, type: "unsupervised" });
});

app.post("/learn", (req, res) => {
    const { input, response, method, rating } = req.body;

    if (!input || !response) {
        return res.status(400).json({ error: "Input and response are required" });
    }

    const timestamp = new Date().toISOString();
    let trimmedInput = input.trim();

    // Store the learned response
    knowledgeData.knowledge[trimmedInput] = response;

    let existingEntry = knowledgeData.history.find(entry => entry.input.trim() === trimmedInput);
    if (existingEntry) {
        existingEntry.response = response;
        existingEntry.learned_at = timestamp;
        existingEntry.method = method || "supervised";
        
        if (rating !== null) {
            existingEntry.rating = existingEntry.rating
                ? (existingEntry.rating + rating) / 2  // Average ratings
                : rating;
        }
    } else {
        knowledgeData.history.push({
            input: trimmedInput,
            response: response,
            learned_at: timestamp,
            method: method || "supervised",
            rating: rating || null
        });
    }

    // ✅ Ensure data is saved to knowledge.json
    saveKnowledge();  // <--- This must be here!

    res.json({ message: "AI learned successfully!", knowledge: knowledgeData.knowledge });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
