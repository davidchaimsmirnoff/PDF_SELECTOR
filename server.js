// Import required modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Server configuration
const port = 3000;
const contentFilePath = path.join(__dirname, "content.txt");
const tooltipContentFilePath = path.join(__dirname, "TOOLTIPCONTENT.json");

// Middleware to serve static files and parse request bodies
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to ensure necessary files exist and initialize if not
function initializeFiles() {
    if (!fs.existsSync(tooltipContentFilePath)) {
        const defaultTooltipData = {
            left: 100,
            top: 100,
            width: 150,
            height: 80,
            content: "Editable tooltip content goes here."
        };
        fs.writeFileSync(tooltipContentFilePath, JSON.stringify(defaultTooltipData, null, 2), 'utf-8');
    }
}

initializeFiles();

// Route to serve the main HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API to fetch main content
app.get("/content", (req, res) => {
    try {
        const content = fs.existsSync(contentFilePath) ? fs.readFileSync(contentFilePath, "utf-8").trim() : "Your Hebrew text will appear here.";
        res.json({ content });
    } catch (error) {
        console.error("Error reading content file:", error);
        res.status(500).send("Error loading content.");
    }
});

app.get("/tooltip-content", (req, res) => {
    const selectedText = req.query.text; 

    if (!selectedText) {
        return res.status(400).json({ error: "No selected text provided" });
    }

    fs.readFile(tooltipContentFilePath, "utf-8", (err, data) => {
        if (err) {
            console.error("❌ Error reading TOOLTIPCONTENT.json:", err);
            return res.status(500).json({ error: "Error loading tooltip content." });
        }

        let tooltipData = {};
        try {
            tooltipData = JSON.parse(data) || {};
        } catch (parseError) {
            console.error("❌ Error parsing TOOLTIPCONTENT.json:", parseError);
            return res.status(500).json({ error: "Error parsing tooltip content." });
        }

        console.log("🗄️ Current tooltip data:", tooltipData);

        if (tooltipData[selectedText]) {
            console.log(`✅ Found tooltip for "${selectedText}":`, tooltipData[selectedText]);
            return res.json(tooltipData[selectedText]);
        } else {
            console.warn(`⚠️ No tooltip found for "${selectedText}", returning default.`);
            return res.json({
                left: 100,
                top: 100,
                width: 200,
                height: 150,
                content: "Edit me..."
            });
        }
    });
});

// API to save main content
app.post("/save", async (req, res) => {
    try {
        const { text, content } = req.body;
        await fs.promises.writeFile(contentFilePath, text || content, "utf-8");
        io.emit("content-updated", text || content);
        res.status(200).send("Content saved successfully!");
    } catch (error) {
        console.error("Error saving content:", error);
        res.status(500).send("Failed to save content.");
    }
});


//NEW FUNCTION???

app.get("/tooltip-content", (req, res) => {
    const selectedText = req.query.text; // Get highlighted text

    if (!selectedText) {
        return res.status(400).json({ error: "No selected text provided" });
    }

    fs.readFile(tooltipContentFilePath, "utf-8", (err, data) => {
        if (err) {
            console.error("❌ Error reading TOOLTIPCONTENT.json:", err);
            return res.status(500).json({ error: "Error loading tooltip content." });
        }

        let tooltipData = {};
        try {
            tooltipData = JSON.parse(data) || {};
        } catch (parseError) {
            console.error("❌ Error parsing TOOLTIPCONTENT.json:", parseError);
            return res.status(500).json({ error: "Error parsing tooltip content." });
        }

        // Return existing tooltip or an empty tooltip
        res.json({
            left: tooltipData[selectedText]?.left || 100,
            top: tooltipData[selectedText]?.top || 100,
            width: tooltipData[selectedText]?.width || 200,
            height: tooltipData[selectedText]?.height || 150,
            content: tooltipData[selectedText]?.content || "Edit me..."
        });
    });
});

app.post("/save-tooltip", async (req, res) => {
    try {
        const { selectedText, tooltipData } = req.body;

        if (!selectedText || !tooltipData || typeof tooltipData !== "object") {
            return res.status(400).json({ error: "Invalid tooltip data received" });
        }

        let storedData = {};
        if (fs.existsSync(tooltipContentFilePath)) {
            const fileContent = await fs.promises.readFile(tooltipContentFilePath, "utf-8");
            storedData = JSON.parse(fileContent) || {};
        }

        // Overwrite or create new tooltip for selected text
        storedData[selectedText] = tooltipData;

        await fs.promises.writeFile(tooltipContentFilePath, JSON.stringify(storedData, null, 2), "utf-8");
        res.status(200).json({ message: "Tooltip content saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving tooltip content:", error);
        res.status(500).json({ error: "Failed to save tooltip content." });
    }
});




// Setup WebSocket connection handling
io.on('connection', (socket) => {
    console.log("A user connected");

    socket.on('event-name', (data) => {
        console.log("Event data:", data);
    });

    socket.on('disconnect', () => {
        console.log("User disconnected");
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
