document.addEventListener('DOMContentLoaded', () => {
  const videoCards = document.querySelectorAll('[data-video-card]');

  videoCards.forEach(card => {
    const video = card.querySelector('[data-codec-video]');
    const statusLabel = card.querySelector('[data-status]');
    
    if (!video || !statusLabel) return;

    // Definisce le funzioni di aggiornamento dello stato della UI
    const setStatus = (text, className) => {
      statusLabel.textContent = text;
      // Rimuove eventuali classi di stato precedenti se usate nel CSS
      statusLabel.className = 'status'; 
      if (className) statusLabel.classList.add(className);
    };

    // 1. Il video si avvia correttamente
    video.addEventListener('playing', () => {
      setStatus('Playing', 'status-playing');
    });

    // 2. Il video viene messo in pausa o si ferma
    video.addEventListener('pause', () => {
      // Se è in loop, la pausa improvvisa di solito indica un problema o un blocco
      setStatus('Paused', 'status-paused');
    });

    // 3. Gestione degli errori nativi (es. file non trovato o corrotto)
    video.addEventListener('error', () => {
      setStatus('Error', 'status-error');
    });

    // 4. GESTIONE RESILIENTE PER IL TEST C (Fallimento di tutti i <source>)
    // Se nessuna delle sorgenti interne è supportata, l'errore scatta sui singoli elementi <source>
    const sources = video.querySelectorAll('source');
    if (sources.length > 0) {
      let failedSourcesCount = 0;
      
      sources.forEach(source => {
        source.addEventListener('error', () => {
          failedSourcesCount++;
          // Se TUTTI i sorgenti falliscono, il browser mostrerà l'immagine di fallback
          if (failedSourcesCount === sources.length) {
            setStatus('Fallback (Image)', 'status-fallback');
          }
        });
      });
    }

    // 5. CONTROLLO DI SICUREZZA (Timeout per riproduzione bloccata)
    // Molti browser mobili non supportano un codec ma non generano un errore, 
    // rimangono semplicemente congelati sul poster.
    setTimeout(() => {
      // Se dopo 2.5 secondi lo stato è ancora "Checking" e il video non è partito
      if (video.paused && statusLabel.textContent === 'Checking') {
        // Se il Test C ha dei source e sono falliti, lo stato è già gestito sopra.
        // Altrimenti, forziamo lo stato di non supportato.
        if (sources.length === 0) {
          setStatus('Not Supported', 'status-failed');
        } else if (video.readyState === 0) {
          // readyState 0 significa che non è stato caricato nessun dato utile
          setStatus('Fallback (Image)', 'status-fallback');
        }
      }
    }, 2500);

    // Forza l'avvio programmatico per bypassare alcune restrizioni aggressive dei browser
    video.play().catch(err => {
      console.log(`Autoplay impedito o non supportato per questa scheda:`, err);
      // Se l'autoplay fallisce per policy del browser, aggiorna lo stato
      if (statusLabel.textContent === 'Checking') {
        setStatus('Click to Play', 'status-action-required');
      }
    });
  });
});
