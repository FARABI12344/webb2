import React, { useState, useEffect, useRef } from "react";
import "./index.css"

export default function AppStatus() {
  const [darkMode, setDarkMode] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [prompt, setPrompt] = useState("Dragon in the sky at sunset");
  const [type, setType] = useState("banner");
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [adRequired, setAdRequired] = useState(false);
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

  const downloadAndSetImage = async () => {
    if ((generatedCount + 1) % 3 === 0 && !adWatching && !adCooldownRef.current) {
      setAdRequired(true);
      return;
    }
    adCooldownRef.current = false;
    setLoading(true);
    let url;
    if (type === "logo") {
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=500&height=500&seed=36&enhance=true&nologo=true&model=flux-pro`;
    } else {
      url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&seed=36&enhance=true&nologo=true&model=flux-pro`;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setImageUrl(localUrl);
      setGeneratedCount((prev) => prev + 1);
    } catch (err) {
      console.error("Image download failed", err);
    }
    setLoading(false);
    setAdWatching(false);
  };

  useEffect(() => { downloadAndSetImage(); }, []);

  const handleRightClick = (e) => {
    if (!e.target.classList.contains("generated-image")) e.preventDefault();
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
          downloadAndSetImage();
        }, 1500);
      }
    }, 1000);
  };

  return (
    <div onClick={createRipple} onContextMenu={handleRightClick}
      className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-auto ${darkMode ? 'bg-gradient-to-br from-purple-900 to-black' : 'bg-gradient-to-br from-white to-pink-100'}`}>
      {ripples.map((r) => (
        <span key={r.id} className="absolute w-12 h-12 bg-pink-300 rounded-full opacity-50 pointer-events-none animate-ripple"
          style={{ top: r.y - 24 + "px", left: r.x - 24 + "px" }}></span>
      ))}

      <div className={`w-full ${darkMode ? 'bg-purple-950' : 'bg-white'} border-b border-gray-200 flex items-center justify-between px-6 py-3 shadow-md font-bold`}>
        <div className={`text-2xl sm:text-4xl font-bold tracking-wide ${darkMode ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]' : 'text-black'}`}>AKR IMAGE GEN</div>
        <div className="flex items-center gap-4 text-sm sm:text-base">
          <button onClick={() => setDarkMode(!darkMode)} className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-full shadow hover:scale-105 transition">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <a href="https://about.farabi.me" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 underline font-extrabold hover:text-blue-800 transition-colors">
            MADE BY FARABI
          </a>
        </div>
      </div>

      <div className={`mx-auto my-10 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.2)] border-[6px] ${darkMode ? 'border-purple-700 bg-gray-900 text-purple-100' : 'border-pink-400 bg-white text-pink-900'} w-[95%] max-w-4xl text-center`}>
        <h1 className="text-3xl sm:text-5xl panton-heading mb-6 tracking-wider">IMAGE GENERATOR</h1>
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Type your prompt here"
          className={`px-6 py-3 rounded-xl text-lg w-full max-w-xl shadow-md outline-none border ${darkMode ? 'border-purple-500 bg-black text-purple-100' : 'border-pink-300 bg-pink-100 text-pink-900'}`} />
        <div className="flex flex-wrap gap-4 justify-center my-6">
          <button onClick={() => setType("logo")} className={`px-6 py-2 rounded-full font-semibold ${type === 'logo' ? 'bg-blue-500 text-white' : 'bg-white border'} shadow`}>Logo</button>
          <button onClick={() => setType("banner")} className={`px-6 py-2 rounded-full font-semibold ${type === 'banner' ? 'bg-blue-500 text-white' : 'bg-white border'} shadow`}>Banner</button>
        </div>

        {adRequired ? (
          <div>
            <p className="text-red-500 font-semibold">Please watch an ad to continue</p>
            <p className="text-sm italic">It may redirect you to another website</p>
            <button onClick={startAdCountdown} className="mt-2 bg-pink-500 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-600">5 SECOND AD</button>
            {adTimer !== null && <p className="mt-2 text-lg font-bold">{adTimer > 0 ? `Waiting: ${adTimer}s` : ''}</p>}
          </div>
        ) : showThanks ? (
          <p className="text-green-500 text-lg mt-4 font-bold">Thanks for watching the ad! It helps us revive.</p>
        ) : (
          <button onClick={downloadAndSetImage} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:scale-105 transition-all">
            Generate Image
          </button>
        )}

        {loading && <p className="text-lg mt-4">Loading...</p>}
        {!loading && imageUrl && (
          <div className="mt-6 flex justify-center">
            <img src={imageUrl} alt="Generated"
              className="generated-image rounded-xl shadow-lg max-w-full max-h-[400px] transition-transform duration-300 hover:scale-105 cursor-pointer" />
          </div>
        )}

        <footer className="text-center py-4 text-sm text-gray-500">
          Total images generated: {generatedCount}
        </footer>
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        .animate-ripple { animation: ripple 0.7s ease-out forwards; }
      `}</style>
    </div>
  );
}
