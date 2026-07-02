const cards = document.querySelectorAll("[data-video-card]");

const setStatus = (card, text, className) => {
  const status = card.querySelector("[data-status]");
  status.className = `status ${className}`;
  status.textContent = text;
};

cards.forEach((card) => {
  const video = card.querySelector("[data-codec-video]");

  const markPlaying = () => setStatus(card, "Playing", "is-playing");
  const markPaused = () => setStatus(card, "Paused", "is-paused");
  const markError = () => setStatus(card, "Unsupported", "is-error");

  video.addEventListener("playing", markPlaying);
  video.addEventListener("pause", markPaused);
  video.addEventListener("error", markError);
  video.addEventListener("stalled", () => setStatus(card, "Stalled", "is-paused"));

  const attempt = video.play();
  if (attempt && typeof attempt.catch === "function") {
    attempt.catch(() => markPaused());
  }

  window.setTimeout(() => {
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      markError();
      return;
    }

    if (!video.paused && video.currentTime > 0) {
      markPlaying();
      return;
    }

    markPaused();
  }, 1800);
});
