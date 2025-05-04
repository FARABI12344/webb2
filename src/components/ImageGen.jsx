import React, { useState, useEffect } from 'react'

const ImageGen = () => {
  const [prompt, setPrompt] = useState("Dragon in the sky at sunset")
  const [type, setType] = useState("banner")
  const [imageUrl, setImageUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(0)
  const [showAd, setShowAd] = useState(false)
  const [adCountdown, setAdCountdown] = useState(5)

  const generateImage = async () => {
    if (generated > 0 && generated % 3 === 0) {
      setShowAd(true)
      return
    }

    setLoading(true)
    const url =
      type === "logo"
        ? `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=500&height=500&seed=36&enhance=true&nologo=true&model=flux-pro`
        : `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&seed=36&enhance=true&nologo=true&model=flux-pro`

    const res = await fetch(url)
    const blob = await res.blob()
    const localUrl = URL.createObjectURL(blob)
    setImageUrl(localUrl)
    setGenerated(prev => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    generateImage() // auto-generate on load
  }, [])

  const handleAdClick = () => {
    window.open("https://sawutser.top/4/9293232", "_blank")
    setShowAd(false)
    let countdown = 5
    const interval = setInterval(() => {
      countdown -= 1
      setAdCountdown(countdown)
      if (countdown === 0) {
        clearInterval(interval)
        setAdCountdown(5)
        generateImage()
      }
    }, 1000)
  }

  return (
    <div className="border rounded-xl p-6 mt-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">FREE IMAGE GEN V1</h2>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 rounded mb-4 text-black dark:text-white"
        placeholder="Type your prompt here"
        style={{ backgroundColor: document.body.classList.contains("dark") ? "#000" : "#ffd1dc" }}
      />
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setType("logo")} className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded">
          Logo
        </button>
        <button onClick={() => setType("banner")} className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded">
          Banner
        </button>
      </div>

      <button
        onClick={generateImage}
        className="w-full py-2 rounded font-bold text-white"
        style={{
          background: "linear-gradient(to right, #ff69b4, #800080)"
        }}
      >
        {loading ? "Loading..." : "Generate Image"}
      </button>

      {showAd && (
        <div className="text-center mt-4 text-sm font-semibold">
          <p>Please watch an ad to continue</p>
          <p className="text-xs italic text-gray-400 mb-2">It may redirect you to another website</p>
          <button
            onClick={handleAdClick}
            className="px-4 py-1 bg-pink-500 text-white rounded"
          >
            {adCountdown < 5 ? `${adCountdown}` : "5 SECOND AD"}
          </button>
        </div>
      )}

      {imageUrl && !loading && (
        <img
          src={imageUrl}
          alt="Generated"
          className="mt-6 w-full max-w-2xl mx-auto rounded hover:scale-105 transition-transform duration-300"
          onContextMenu={(e) => {
            e.preventDefault()
            const a = document.createElement("a")
            a.href = imageUrl
            a.download = "image.png"
            a.click()
          }}
        />
      )}

      <footer className="text-center mt-6 text-xs text-gray-500">
        Total images generated: {generated}
      </footer>
    </div>
  )
}

export default ImageGen
