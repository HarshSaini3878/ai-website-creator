import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
configDotenv()
const app = express();
const port = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.apiKey,
});

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt, chat_history } = req.body;

    if (!prompt || !Array.isArray(chat_history)) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: chat_history,
      config: {
        systemInstruction:
          "You are a web developer. Based on the user prompt, generate a responsive website with good design and vibrant colors single page . Respond in **pure JSON** with four keys: html, css, js, and projectName. Do not wrap response in markdown or add explanations.",
      },
    });

  const response = await chat.sendMessage({ message: prompt });

const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) {
  return res.status(500).json({ error: "AI did not return text output." });
}
const cleaned = text.replace(/```json\n?|```/g, "").trim();
let parsed;
try {
  parsed = JSON.parse(cleaned);
} catch (err) {
  return res.status(500).json({ error: "Invalid JSON", raw: cleaned });
}

res.json(parsed);



  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
