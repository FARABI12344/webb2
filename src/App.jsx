import React, { useState, useRef } from "react";
import "./index.css";

export default function AppStatus() {
  const [darkMode, setDarkMode] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("myfile");
  const [extension, setExtension] = useState(".txt");
  const [adRequired, setAdRequired] = useState(true);
  const [adTimer, setAdTimer] = useState(null);
  const [adWatching, setAdWatching] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const adCooldownRef = useRef(false);

  const createRipple = (e) => {
    const ripple = { x: e.clientX, y: e.clientY, id: Date.now() };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 800);
  };

  const startAdCountdown = () => {
    setAdWatching(true);
    window.open("https://sawutser.top/4/9293232", "_blank");
    let countdown = 5;
    setAdTimer(countdown);
    const interval = setInterval(() => {
      countdown--;
      setAdTimer(countdown);
      if (countdown <= 0) {
        clearInterval(interval);
        setAdTimer(null);
        setAdRequired(false);
        setShowThanks(true);
        adCooldownRef.current = true;
        setTimeout(() => {
          setShowThanks(false);
          handleDownload();
        }, 1500);
      }
    }, 1000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}${extension}`;
    link.click();
  };

  return (
    <div
      onClick={createRipple}
      className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-auto ${darkMode ? 'bg-gradient-to-br from-purple-900 to-black' : 'bg-gradient-to-br from-white to-pink-100'}`}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute w-12 h-12 bg-pink-300 rounded-full opacity-50 pointer-events-none animate-ripple"
          style={{ top: `${r.y - 24}px`, left: `${r.x - 24}px` }}
        ></span>
      ))}

      <div
        className={`w-full ${darkMode ? 'bg-purple-950' : 'bg-white'} border-b border-gray-200 flex items-center justify-between px-6 py-3 shadow-md font-bold`}
      >
        <div className={`text-2xl sm:text-4xl font-bold tracking-wide ${darkMode ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]' : 'text-black'}`}>
          TEXT TO FILE
        </div>
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-full shadow hover:scale-105 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <a
            href="https://about.farabi.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-extrabold hover:text-blue-800 transition-colors"
          >
            MADE BY FARABI
          </a>
        </div>
      </div>

      <div
        className={`mx-auto my-10 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.2)] border-[6px] ${darkMode ? 'border-purple-700 bg-gray-900 text-purple-100' : 'border-pink-400 bg-white text-pink-900'} w-[95%] max-w-4xl text-center`}
      >
        <h1 className="text-3xl sm:text-5xl panton-heading mb-6 tracking-wider">PASTE TO FILE</h1>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your text or code here..."
          className={`w-full h-64 p-4 rounded-xl text-base font-mono resize-none shadow-md border outline-none ${darkMode ? 'border-purple-500 bg-black text-purple-100' : 'border-pink-300 bg-pink-100 text-pink-900'}`}
        />

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="File name (no extension)"
            className="px-4 py-2 rounded-lg shadow-md border outline-none w-52 text-center"
          />

          <select
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-md border outline-none w-32 text-center"
          >
            <option value=".txt">.txt</option>
            <option value=".js">.js</option>
            <option value=".py">.py</option>
            <option value=".html">.html</option>
            <option value=".css">.css</option>
            <option value=".json">.json</option>
          </select>

          {adRequired ? (
            <div className="text-center">
              <p className="text-red-500 font-semibold">Please watch an ad to download</p>
              <p className="text-sm italic">It may redirect you to another website</p>
              <button
                onClick={startAdCountdown}
                className="mt-2 bg-pink-500 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-600"
              >
                5 SECOND AD
              </button>
              {adTimer !== null && (
                <p className="mt-2 text-lg font-bold">{adTimer > 0 ? `Waiting: ${adTimer}s` : ''}</p>
              )}
            </div>
          ) : showThanks ? (
            <p className="text-green-500 text-lg mt-4 font-bold">Thanks for watching the ad! Download starting...</p>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
