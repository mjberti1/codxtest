/**
 * Codec Loop Test - JavaScript Controller
 * Gestisce in modo resiliente i test di riproduzione video A, B e C.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Seleziona tutte le schede di test nella pagina
  const videoCards = document.querySelectorAll('[data-video-card]');

  videoCards.forEach(card => {
    const video = card.querySelector('[data-codec-video]');
    const statusLabel = card.querySelector('[data-status]');
    
    // Sicurezza: se la scheda non contiene gli elementi necessari, salta
    if (!video || !statusLabel) return;

    // Funzione helper per aggiornare il testo e le classi CSS dello stato
    const updateStatus = (text, stateClass) => {
      statusLabel.textContent = text;
      // Mantiene la classe base 'status' e ne aggiunge una specifica per lo stile CSS
      statusLabel.className = 'status'; 
      if (stateClass) {
        statusLabel.classList.add(stateClass);
      }
    };

    // 1. EVENTO DI SUCCESSO: Il video è partito (vale per qualsiasi sorgente valida)
    video.addEventListener('playing', () => {
      updateStatus('Playing', 'status-playing');
    });

    // 2. GESTIONE DEI SORGENTI MULTIPLI (Specifica per il Test C)
    const sources = video.querySelectorAll('source');
    
    if (sources.length > 0) {
      let failedSourcesCount = 0;
      
      // Monitora l'errore su OGNI singolo tag <source>
      sources.forEach(source => {
        source.addEventListener('error', () => {
          failedSourcesCount++;
          
          // Il Fallback statico scatta SOLO se TUTTI i <source> interni falliscono
          if (failedSourcesCount === sources.length) {
            updateStatus('Fallback (Image)', 'status-fallback');
          }
        });
      });
    } else {
      // 3. GESTIONE ERRORE DIRETTO (Per Test A e Test B senza tag <source> multipli)
      video.addEventListener('error', () => {
        updateStatus('Not Supported', 'status-failed');
      });
    }

    // 4. TIMEOUT DI SICUREZZA (Bypass per i browser che si bloccano senza emettere errori)
    // Alcuni motori di rendering mobili non supportano il codec ma congelano il video sul poster 
    // senza mai attivare l'evento 'error'.
    setTimeout(() => {
      if (statusLabel.textContent === 'Checking') {
        if (video.paused) {
          if (sources.length > 0 && video.readyState === 0) {
            // Se ha sorgenti ma non ha caricato metadati (readyState 0), è scattato il fallback
            updateStatus('Fallback (Image)', 'status-fallback');
          } else {
            // Altrimenti il codec singolo non è supportato
            updateStatus('Not Supported', 'status-failed');
          }
        }
      }
    }, 3000); // 3 secondi di tolleranza per i dispositivi più lenti

    // 5. ATTIVAZIONE PROGRAMMATICA
    // Tenta di forzare il play() per superare le restrizioni sui browser mobili
    video.play().catch(error => {
      console.warn(`Autoplay bloccato dalle policy del browser o codec non supportato:`, error);
      // Se l'autoplay viene bloccato ma il browser supporta il codec, chiede l'azione dell'utente
      if (statusLabel.textContent === 'Checking' && video.readyState > 1) {
        updateStatus('Click to Play', 'status-action-required');
      }
    });
  });
});
