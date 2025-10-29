import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/gemini", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // Extract just the plain text (simplify structure)
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from model";

    // Send back a clean structure your app expects
    res.json({ text });
  } catch (error) {
    console.error("Gemini proxy call failed:", error);
    res.status(500).json({ error: "Gemini proxy call failed" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Gemini proxy running on port ${port}`));

