document.addEventListener('DOMContentLoaded', () => {
  const videoCards = document.querySelectorAll('[data-video-card]');

  videoCards.forEach(card => {
    const video = card.querySelector('[data-codec-video]');
    const statusLabel = card.querySelector('[data-status]');
    
    if (!video || !statusLabel) return;

    // ... [gestione logica aggiornata per stati 'playing' e 'error'] ...

    // Timeout di controllo: sblocca lo stato "Checking"
    setTimeout(() => {
      if (statusLabel.textContent === 'Checking') {
        if (video.paused) {
          const sources = video.querySelectorAll('source');
          if (sources.length > 0 && video.readyState === 0) {
            statusLabel.textContent = 'Fallback (Image)';
          } else {
            statusLabel.textContent = 'Not Supported';
          }
        }
      }
    }, 2500);

    // Esegue il play programmatico
    video.play().catch(() => {
      if (statusLabel.textContent === 'Checking' && video.readyState > 1) {
        statusLabel.textContent = 'Click to Play';
      }
    });
  });
});
