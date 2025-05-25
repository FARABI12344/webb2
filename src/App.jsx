import React, { useRef, useState, useEffect } from "react";
import "./index.css";

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState({ hex: "#000000", name: "Black" });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
      .toString(16)
      .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
    const name = getColorName(hex);
    setColorData({ hex, name });
  };

  const getColorName = (hex) => {
    // Basic color mapping for demo purposes
    const simpleMap = {
      "#000000": "Black",
      "#ffffff": "White",
      "#ff0000": "Red",
      "#00ff00": "Green",
      "#0000ff": "Blue",
      "#ffff00": "Yellow",
      "#00ffff": "Cyan",
      "#ff00ff": "Magenta",
    };
    return simpleMap[hex.toLowerCase()] || "Unknown";
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      img.onload = () => {
        const maxWidth = 800;
        const scale = Math.min(maxWidth / img.width, 1);
        const width = img.width * scale;
        const height = img.height * scale;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      };

      img.src = imageSrc;
    }
  }, [imageSrc]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(colorData.hex);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-pink-50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="border-4 border-dashed border-pink-400 rounded-full px-8 py-4 text-xl font-bold text-black mb-6 shadow-lg cursor-pointer">
        Drag or Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
        />
      </div>

      <div className="relative border-4 border-pink-400 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          className="max-w-full h-auto"
        />
        {imageSrc && <img ref={imageRef} src={imageSrc} alt="uploaded" className="hidden" />}

        {/* Circular transparent viewer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white pointer-events-none" />

        {/* Color info */}
        <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <p>
            Hex: <span className="font-bold">{colorData.hex}</span>
          </p>
          <p>Name: {colorData.name}</p>
          <button
            onClick={copyToClipboard}
            className="mt-2 bg-pink-500 text-white px-3 py-1 rounded font-bold hover:bg-pink-600"
          >
            Copy Hex
          </button>
        </div>
      </div>
    </div>
  );
}
