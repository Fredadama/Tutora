chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "SHOW_OVERLAY") {
      const video = document.querySelector("video")
      if (!video || document.getElementById("mic-overlay-btn")) return
  
      const container = video.parentElement as HTMLElement
  
      const button = document.createElement("button")
      button.id = "mic-overlay-btn"
      button.innerHTML = "🎤"
      button.style.position = "absolute"
      button.style.top = "100%"
      button.style.right = "10px"
      button.style.zIndex = "9999"
      button.style.width = "40px"
      button.style.height = "40px"
      button.style.borderRadius = "50%"
      button.style.background = "rgba(255, 255, 255, 0.1)"
      button.style.color = "#fff"
      button.style.border = "none"
      button.style.cursor = "pointer"
  
      button.onclick = () => {
        alert("Mic clicked!")
      }

      button.addEventListener("mouseenter", () => {
        button.style.background = "rgba(255, 255, 255, 0.25)"
      })
      button.addEventListener("mouseleave", () => {
        button.style.background = "rgba(255, 255, 255, 0.1)"
      })
  
      container?.appendChild(button)
    }
  })

  export const config = {
    matches: ["*://www.youtube.com/*"]
  }