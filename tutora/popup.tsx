import { useState, useEffect } from "react"

function IndexPopup() {
  const [isYoutube, setIsYoutube] = useState(false)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || ""
      setIsYoutube(url.includes("youtube.com/watch"))
    })
  }, [])

  const handleStart = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: "SHOW_OVERLAY" })
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <button
        onClick={handleStart}
        disabled={!isYoutube}
        style={{
          marginTop: 10,
          padding: "8px 16px",
          backgroundColor: isYoutube ? "#4caf50" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: isYoutube ? "pointer" : "not-allowed"
        }}>
        Turn on learning mode
      </button>

      {!isYoutube && (
        <p style={{ color: "red", marginTop: 10 }}>
          Go to a YouTube video to activate
        </p>
      )}
    </div>
  )
}

export default IndexPopup