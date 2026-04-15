export default function InputBox({ idea, setIdea, generate, loading }) {
  return (
    <div className="w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl">

      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="✨ Describe your full post idea in detail..."
        className="w-full h-36 p-4 rounded-xl bg-black/40 border border-white/20 outline-none"
      />

      <button
        onClick={generate}
        disabled={loading}
        className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-pink-500 py-3 rounded-xl font-semibold text-lg hover:scale-105 transition"
      >
        {loading ? "Generating..." : "Generate Carousel"}
      </button>

    </div>
  );
}