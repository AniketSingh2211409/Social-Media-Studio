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

    const prompt = `
Create an Instagram carousel on: "${idea}"

Rules:
- 5 slides only
- Each line = one slide
- Max 8 words per line
- Slide 1 = strong hook
- Slide 5 = CTA
- Make it catchy, emotional, viral
`;

    const response = await client.chat.completions.create({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    let slides = text
      .split("\n")
      .map((s) => s.replace(/[-*]/g, "").trim())
      .filter((s) => s.length > 3)
      .slice(0, 5);

    if (slides.length === 0) {
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