"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [developerMessage, setDeveloperMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const responseRef = useRef<HTMLDivElement>(null);

  // Retrowave color palette
  const colors = {
    bg: "bg-gradient-to-br from-[#1a0033] via-[#2d0066] to-[#ff0080]",
    panel: "bg-[#2d0066]/80 border-[#ff0080]",
    accent: "text-[#ff0080]",
    button: "bg-[#ff0080] hover:bg-[#ff4da6] text-white",
    input: "bg-[#1a0033] border-[#ff0080] text-white placeholder-[#ffb3d9]",
    label: "text-[#ffb3d9]",
  };

  // Scroll to bottom on new response
  const scrollToBottom = () => {
    setTimeout(() => {
      responseRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle chat submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResponse("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://0.0.0.0:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: developerMessage,
          user_message: userMessage,
          model: "gpt-4.1-mini",
          api_key: apiKey,
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let fullText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        fullText += chunk;
        setResponse(fullText);
        scrollToBottom();
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`min-h-screen ${colors.bg} flex flex-col items-center justify-center py-8 px-2 font-mono`}>
      <div className={`w-full max-w-xl rounded-2xl shadow-2xl border-2 ${colors.panel} p-8 flex flex-col gap-6`}>
        <h1 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-white drop-shadow-lg">
          <span className={colors.accent}>Retrowave LLM Chat</span>
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className={`flex flex-col gap-1 ${colors.label} font-semibold`}>OpenAI API Key
            <input
              type="password"
              className={`rounded px-3 py-2 border-2 outline-none ${colors.input}`}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              required
              autoComplete="off"
              placeholder="sk-..."
            />
          </label>
          <label className={`flex flex-col gap-1 ${colors.label} font-semibold`}>Developer Message
            <input
              type="text"
              className={`rounded px-3 py-2 border-2 outline-none ${colors.input}`}
              value={developerMessage}
              onChange={e => setDeveloperMessage(e.target.value)}
              required
              placeholder="System prompt or context"
            />
          </label>
          <label className={`flex flex-col gap-1 ${colors.label} font-semibold`}>User Message
            <input
              type="text"
              className={`rounded px-3 py-2 border-2 outline-none ${colors.input}`}
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              required
              placeholder="What do you want to ask?"
            />
          </label>
          <button
            type="submit"
            className={`mt-2 py-2 rounded font-bold text-lg transition-colors ${colors.button} disabled:opacity-60`}
            disabled={loading}
          >
            {loading ? "Chatting..." : "Send"}
          </button>
        </form>
        <div className="mt-2 min-h-[120px] max-h-64 overflow-y-auto bg-black/40 rounded-lg p-4 text-white text-base whitespace-pre-wrap shadow-inner border border-[#ff0080]" ref={responseRef}>
          {response && <span>{response}</span>}
          {error && <span className="text-red-400">Error: {error}</span>}
        </div>
        <div className="text-xs text-center text-[#ffb3d9] mt-2">
          Your API key is only used in your browser and never sent to any server except OpenAI.<br/>
          <span className="opacity-70">Retrowave theme. Powered by Next.js, Tailwind, and FastAPI.</span>
        </div>
      </div>
    </div>
  );
}
