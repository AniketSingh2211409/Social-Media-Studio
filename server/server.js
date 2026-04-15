import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required" });
    }

    // 🔥 IMPROVED PROMPT
    const prompt = `
Create 5 Instagram carousel slides on: "${idea}"

STRICT RULES:
- Output EXACTLY 5 lines
- Each line = one slide
- No numbering
- No bullets
- Max 8 words per line
- Line break after each slide
- Slide 1 = strong hook
- Slide 5 = CTA

Example:
Stop wasting your potential today
You are your biggest distraction
Consistency beats motivation daily
Small habits create massive success
Start today, not tomorrow 🚀
`;

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free", // 🔥 upgraded model
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    // 🔥 DEBUG (important)
    console.log("AI RESPONSE:\n", text);

    let slides = text
      .split("\n")
      .map((s) => s.replace(/[-*0-9.]/g, "").trim())
      .filter((s) => s.length > 3)
      .slice(0, 5);

    // fallback only if AI fails
    if (slides.length < 5) {
      slides = [
        "Why you forget things 😱",
        "No revision happens",
        "Focus is too low",
        "No real connection",
        "Start spaced repetition 🚀",
      ];
    }

    res.json({ slides });
  } catch (err) {
    console.log("ERROR:", err.message);

    res.json({
      slides: [
        "Why you forget things 😱",
        "No revision happens",
        "Focus is too low",
        "No real connection",
        "Start spaced repetition 🚀",
      ],
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});