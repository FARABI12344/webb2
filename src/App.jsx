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
  const [discoverPrompts, setDiscoverPrompts] = useState([]);
  const adCooldownRef = useRef(false);

  const logoPrompts = [
    "A green field where anime characters are playing football at sunset",
    "A scientist of the universe",
    "A sad student who gets pressured by his parents all the time",
    "A happy dragon with his kid owner.",
    "A student who is leaving his school sad to go to college",
    "A speech given by the prime minister",
    "How social media destroying kids",
    "How going to school destroying kids creativity"
  ];

  const bannerPrompts = [
    "T-Rex at Sunset Angry.",
    "Random dude giving away money to people who need.",
    "How social media destroying every kids",
    "A broken heart guy crying beside the sea"
  ];

  useEffect(() => {
    const shuffledLogos = [...logoPrompts].sort(() => 0.5 - Math.random()).slice(0, 6);
    const shuffledBanners = [...bannerPrompts].sort(() => 0.5 - Math.random()).slice(0, 2);
    const arranged = [
      shuffledLogos.slice(0, 3).map(p => ({ prompt: p, type: 'logo' })),
      shuffledBanners.map(p => ({ prompt: p, type: 'banner' })),
      shuffledLogos.slice(3).map(p => ({ prompt: p, type: 'logo' }))
    ];
    setDiscoverPrompts(arranged);
    downloadAndSetImage();
  }, []);

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

      {/* ...other UI parts... */}

      {!loading && (
        <div className="w-full max-w-5xl mx-auto mt-10 px-6">
          <h2 className="text-3xl panton-heading mb-6 text-center">Discover More!</h2>
          {discoverPrompts.map((row, i) => (
            <div key={i} className="flex justify-center flex-wrap gap-6 mb-6">
              {row.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setPrompt(item.prompt);
                    setType(item.type);
                    downloadAndSetImage();
                  }}
                  className="cursor-pointer hover:scale-105 transition-transform shadow-lg rounded-xl overflow-hidden w-[150px] h-[150px]"
                >
                  <img
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item.prompt)}?width=${item.type === 'logo' ? '500' : '1920'}&height=${item.type === 'logo' ? '500' : '1080'}&seed=36&enhance=true&nologo=true&model=flux-pro`}
                    alt={item.prompt}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <footer className="text-center py-4 text-sm text-gray-500">
        Total images generated: {generatedCount}
      </footer>

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
