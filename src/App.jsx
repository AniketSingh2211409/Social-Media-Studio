import { useState } from "react";
import SlideCard from "./components/SlideCard";
import html2canvas from "html2canvas";

export default function App() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Viral");

  const generateSlides = async () => {
    if (!idea.trim()) return alert("Enter idea");

    setLoading(true);

    try {
      const res = await fetch(
        "https://social-media-backend-i3hj.onrender.com/generate", // ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea: `${idea} (${tone} tone)` }),
        }
      );

      const data = await res.json();
      setSlides(data.slides || []);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(slides.join("\n"));
  };

  const downloadText = () => {
    const blob = new Blob([slides.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "carousel.txt";
    link.click();
  };

  const exportImage = async () => {
    const cards = document.querySelectorAll(".card");

    for (let i = 0; i < cards.length; i++) {
      const canvas = await html2canvas(cards[i]);

      const link = document.createElement("a");
      link.download = `slide-${i + 1}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="app">

      <div className="hero">
        <h1>🚀 Social Media Studio</h1>
        <p>Turn your ideas into viral Instagram carousels ✨</p>
      </div>

      <div className="inputBox">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="✨ Describe your viral post idea..."
        />

        <div className="controls">
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option>Viral</option>
            <option>Professional</option>
            <option>Funny</option>
          </select>

          <button onClick={generateSlides}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {loading && <div className="loader">Generating viral content...</div>}

      <div className="grid">
        {slides.map((s, i) => (
          <SlideCard key={i} text={s} index={i} />
        ))}
      </div>

      {slides.length > 0 && (
        <div className="actions">
          <button onClick={copyAll}>📋 Copy All</button>
          <button onClick={downloadText}>⬇ Download</button>
          <button onClick={exportImage}>📸 Export Slides</button>
        </div>
      )}
    </div>
  );
}