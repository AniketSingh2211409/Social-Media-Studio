import { useState } from "react";

export default function SlideCard({ text, index }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(text);

  const copy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="card">

      <div className="cardTop">
        🚀 Slide {index + 1}
      </div>

      {isEditing ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      ) : (
        <h2>{value}</h2>
      )}

      <div className="cardBtns">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save" : "Edit"}
        </button>

        <button onClick={copy}>Copy</button>
      </div>

    </div>
  );
}