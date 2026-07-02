document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    const card = video.closest('[data-video-card]');
    const status = card ? card.querySelector('[data-status]') : null;
    if (!status) return;
    video.addEventListener('playing', () => { status.textContent = 'Playing'; });
    video.addEventListener('error', () => {
      if (card.id === 'test-c' && !video.parentNode) return;
      status.textContent = 'Failed';
    });
    video.play().catch(() => {
      if (video.parentNode) status.textContent = 'Autoplay Blocked';
    });
  });
});
