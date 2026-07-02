document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video[data-codec-video]');

  videos.forEach(video => {
    const card = video.closest('[data-video-card]');
    const status = card ? card.querySelector('[data-status]') : null;
    if (!status) return;

    function triggerFallback(reason) {
      if (card.id === 'test-c') {
        const container = document.getElementById('container-c');
        const img = document.createElement('img');
        img.src = 'https://github.io';
        img.className = 'video-frame'; 
        container.replaceChild(img, video);
        status.textContent = `Static Image (${reason})`;
      } else {
        status.textContent = reason;
      }
    }

    // Controllo e gestione eventi video...
    video.addEventListener('playing', () => status.textContent = 'Playing');
    video.addEventListener('error', () => triggerFallback('Error'));
    video.play().catch(() => triggerFallback('Blocked'));
  });
});
