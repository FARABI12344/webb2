import React, { useRef, useState, useEffect } from "react";
import "./index.css";

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState({ hex: "#000000" });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const viewerRef = useRef(null);
  const [viewerPos, setViewerPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  const updateColorFromViewer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = viewerPos.x - rect.left;
    const y = viewerPos.y - rect.top;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${pixel[0].toString(16).padStart(2, "0")}${pixel[1]
      .toString(16)
      .padStart(2, "0")}${pixel[2].toString(16).padStart(2, "0")}`;
    setColorData({ hex });
  };

  const handleMouseDown = (e) => {
    const viewer = viewerRef.current;
    const rect = viewer.getBoundingClientRect();
    setIsDragging(true);
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;
    setViewerPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    updateColorFromViewer();
  }, [viewerPos]);

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
        updateColorFromViewer();
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="relative z-10 border-4 border-dashed border-pink-400 rounded-full px-8 py-4 text-xl font-bold text-black mb-6 shadow-lg cursor-pointer">
        Drag or Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files[0])}
          className="opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer"
        />
      </div>

      <div className="relative border-4 border-pink-400 rounded-xl overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full h-auto" />
        {imageSrc && <img ref={imageRef} src={imageSrc} alt="uploaded" className="hidden" />}

        {/* Draggable Circle Viewer */}
        <div
          ref={viewerRef}
          className="absolute w-32 h-32 rounded-full border-4 border-white pointer-events-auto cursor-move"
          onMouseDown={handleMouseDown}
          style={{ top: viewerPos.y + "px", left: viewerPos.x + "px", transform: "translate(-50%, -50%)" }}
        />

        {/* Color Info */}
        <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <p>
            Hex: <span className="font-bold">{colorData.hex}</span>
          </p>
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
