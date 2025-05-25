import React, { useState, useRef, useEffect } from "react";
import "./index.css";

export default function AppStatus() {
  const [darkMode, setDarkMode] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [imageSrc, setImageSrc] = useState(null);
  const [colorHex, setColorHex] = useState("#ffffff");
  const [colorName, setColorName] = useState("White");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const createRipple = (e) => {
    const ripple = { x: e.clientX, y: e.clientY, id: Date.now() };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
    }, 800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
    setColorHex(hex);
    setColorName(getColorName(pixel[0], pixel[1], pixel[2]));
  };

  const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  const getColorName = (r, g, b) => {
    // Basic color matching (expandable)
    if (r > 200 && g < 100 && b < 100) return "Red";
    if (r < 100 && g > 200 && b < 100) return "Green";
    if (r < 100 && g < 100 && b > 200) return "Blue";
    if (r > 200 && g > 200 && b < 100) return "Yellow";
    if (r > 200 && g > 200 && b > 200) return "White";
    if (r < 50 && g < 50 && b < 50) return "Black";
    return "Unknown";
  };

  const handleCopy = () => navigator.clipboard.writeText(colorHex);

  useEffect(() => {
    if (imageSrc && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [imageSrc]);

  return (
    <div
      onClick={createRipple}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
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
          COLOR PICKER
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

      <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
        <label
          htmlFor="imageInput"
          className="cursor-pointer text-xl font-bold py-6 px-10 rounded-full border-4 border-dashed border-pink-400 bg-white shadow-lg hover:bg-pink-100 transition"
        >
          Drag or Upload Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileChange}
          hidden
        />

        {imageSrc && (
          <div className="relative mt-10">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              className="rounded-xl border-4 border-pink-400"
            ></canvas>
            <img ref={imageRef} src={imageSrc} alt="Uploaded" className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-white backdrop-blur-sm"></div>
            </div>
            <div className="absolute top-4 left-4 bg-white/80 rounded-xl p-3 shadow text-left text-sm sm:text-base font-semibold flex flex-col items-start">
              <div>Hex: <span className="font-mono">{colorHex}</span></div>
              <div>Name: <span>{colorName}</span></div>
              <button
                onClick={handleCopy}
                className="mt-2 bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              >
                Copy Hex
              </button>
            </div>
          </div>
        )}
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
