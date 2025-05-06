import React, { useState, useEffect, useRef } from "react";
import "./index.css";

export default function AppStatus() {
  const [darkMode, setDarkMode] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [prompt, setPrompt] = useState("Dragon in the sky at sunset");
  const [type, setType] = useState("banner");
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState(5);
  const [imageUrl, setImageUrl] = useState("");
  const [generatedCount, setGeneratedCount] = useState(0);
  const [adRequired, setAdRequired] = useState(false);
  const [adTimer, setAdTimer] = useState(null);
  const [adWatching, setAdWatching] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [showAutoFilled, setShowAutoFilled] = useState(false);
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

  const getRandomItems = (arr, count) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const discoverLogos = getRandomItems(logoPrompts, 6);
  const discoverBanners = getRandomItems(bannerPrompts, 2);

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
    setEta(5);

    let countdown = 5;
    const etaInterval = setInterval(() => {
      countdown--;
      setEta(countdown);
      if (countdown <= 0) clearInterval(etaInterval);
    }, 1000);

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

  useEffect(() => {
    downloadAndSetImage();
  }, []);

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
    <div
      onClick={createRipple}
      onContextMenu={handleRightClick}
      className={`min-h-screen flex flex-col transition-colors duration-500 relative overflow-auto ${darkMode ? 'bg-gradient-to-br from-purple-900 to-black' : 'bg-gradient-to-br from-white to-pink-100'}`}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-opacity-90 backdrop-blur-sm">
          <h1 className="text-5xl font-bold panton-heading mb-4">LOADING...</h1>
          <p className="text-xl">ETA: {eta} seconds...</p>
        </div>
      )}

      {showAutoFilled && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow z-50">
          Successfully autofilled to your prompt
        </div>
      )}

      {/* ... existing UI elements stay unchanged except update discover section below ... */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold panton-heading mb-4">Discover More!</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {discoverLogos.slice(0, 3).map((item, i) => (
            <img
              key={`logo1-${i}`}
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item)}?width=500&height=500&seed=36&enhance=true&nologo=true&model=flux-pro`}
              alt="logo"
              className="rounded-lg cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setPrompt(item);
                setType("logo");
                setShowAutoFilled(true);
                setTimeout(() => setShowAutoFilled(false), 2000);
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {discoverBanners.map((item, i) => (
            <img
              key={`banner-${i}`}
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item)}?width=1920&height=1080&seed=36&enhance=true&nologo=true&model=flux-pro`}
              alt="banner"
              className="rounded-lg cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setPrompt(item);
                setType("banner");
                setShowAutoFilled(true);
                setTimeout(() => setShowAutoFilled(false), 2000);
              }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {discoverLogos.slice(3).map((item, i) => (
            <img
              key={`logo2-${i}`}
              src={`https://image.pollinations.ai/prompt/${encodeURIComponent(item)}?width=500&height=500&seed=36&enhance=true&nologo=true&model=flux-pro`}
              alt="logo"
              className="rounded-lg cursor-pointer hover:scale-105 transition-all"
              onClick={() => {
                setPrompt(item);
                setType("logo");
                setShowAutoFilled(true);
                setTimeout(() => setShowAutoFilled(false), 2000);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
