document.addEventListener('DOMContentLoaded', () => {
  const videoCards = document.querySelectorAll('[data-video-card]');

  videoCards.forEach(card => {
    const video = card.querySelector('[data-codec-video]');
    const statusLabel = card.querySelector('[data-status]');
    
    if (!video || !statusLabel) return;

    const setStatus = (text) => {
      statusLabel.textContent = text;
    };

    // REGOLA 1: Se il video riesce a riprodurre (qualunque sia il codec), è un successo.
    video.addEventListener('playing', () => {
      setStatus('Playing');
    });

    // REGOLA 2: Gestione dei canali di errore per sorgenti multiple (Test C)
    const sources = video.querySelectorAll('source');
    
    if (sources.length > 0) {
      let failedSources = 0;
      
      sources.forEach(source => {
        source.addEventListener('error', () => {
          failedSources++;
          // Il fallback si attiva SOLO se TUTTI i tag <source> hanno fallito
          if (failedSources === sources.length) {
            setStatus('Fallback (Image)');
          }
        });
      });
    } else {
      // REGOLA 3: Gestione errore diretto per sorgente singola (Test A e Test B)
      video.addEventListener('error', () => {
        setStatus('Not Supported');
      });
    }

    // REGOLA 4: Controllo di sicurezza asincrono (Timeout per stalli del browser)
    // Risolve i casi in cui i browser mobili non supportano il codec ma congelano la UI senza lanciare eventi.
    setTimeout(() => {
      if (statusLabel.textContent === 'Checking') {
        if (video.paused) {
          if (sources.length > 0 && video.readyState === 0) {
            setStatus('Fallback (Image)');
          } else {
            setStatus('Not Supported');
          }
        } else {
          setStatus('Playing');
        }
      }
    }, 2000);

    // Forza l'avvio programmatico mitigando i blocchi di autoplay sui browser
    video.play().catch(() => {
      if (statusLabel.textContent === 'Checking' && video.readyState > 1) {
        setStatus('Click to Play');
      }
    });
  });
});
