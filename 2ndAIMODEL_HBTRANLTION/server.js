const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());


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

// **Step 1: Word-by-Word Learning**
function translateHebrew(input) {
    let words = input.trim().split(" ");
    let translation = words.map(word => knowledgeData.knowledge[word] || `(${word}?)`); // Unknown words marked
    return translation.join(" ");
}

// **Step 2: Try Predicting Context-Based Meanings**
function guessMeaning(input) {
    let words = input.trim().split(" ");
    let knownWords = words.filter(word => knowledgeData.knowledge[word]);

    // If all words are known, return full translation
    if (knownWords.length === words.length) {
        return knownWords.map(word => knowledgeData.knowledge[word]).join(" ");
    }

    // If only some words are known, try predicting meaning
    if (knownWords.length > 0) {
        return `Maybe: "${knownWords.map(word => knowledgeData.knowledge[word]).join(" ")}"`;
    }

    return "I don't know this yet.";
}

app.get("/translate", (req, res) => {
    let input = req.query.input ? req.query.input.trim() : "";
    
    if (knowledgeData.knowledge[input]) {
        res.json({ response: knowledgeData.knowledge[input], type: "supervised" });
    } else {
        let guessedResponse = guessMeaning(input);
        res.json({ response: guessedResponse, type: "unsupervised" });
    }
});

app.post("/learn", (req, res) => {
    const { input, response } = req.body;
    if (!input || !response) return res.status(400).json({ error: "Both input and response are required" });

    knowledgeData.knowledge[input] = response;
    saveKnowledge();
    
    res.json({ message: "AI learned successfully!", knowledge: knowledgeData.knowledge });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
