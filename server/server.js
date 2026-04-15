import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 OpenRouter config
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ✅ Health check route (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.post("/generate", async (req, res) => {
  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: "Idea is required" });
    }

    // 🔥 STRONG PROMPT
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
      model: "openai/gpt-oss-120b:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const text = response.choices?.[0]?.message?.content || "";

    console.log("AI RESPONSE:\n", text);

    let slides = text
      .split("\n")
      .map((s) => s.replace(/[-*0-9.]/g, "").trim())
      .filter((s) => s.length > 3)
      .slice(0, 5);

    // fallback (safety)
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
    console.log("ERROR FULL:", err);

    res.status(500).json({
      slides: [
        "Something went wrong 😅",
        "AI not responding",
        "Check API key",
        "Try again later",
        "We’ll fix it soon 🚀",
      ],
    });
  }
});

// 🔥 MUST FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});