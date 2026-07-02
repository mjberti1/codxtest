document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video[data-codec-video]');

  videos.forEach(video => {
    const card = video.closest('[data-video-card]');
    const status = card ? card.querySelector('[data-status]') : null;

    if (!status) return;

    // Se il video è già in riproduzione
    video.addEventListener('playing', () => {
      status.textContent = 'Playing';
      status.style.color = '#4caf50'; // Verde
    });

    // Se la riproduzione fallisce o non è supportata
    video.addEventListener('error', () => {
      status.textContent = 'Failed';
      status.style.color = '#f44336'; // Rosso
    });

    // Controllo di sicurezza per browser che bloccano l'autoplay silenzioso
    video.play().catch(() => {
      status.textContent = 'Paused / Blocked';
    });
  });
});
