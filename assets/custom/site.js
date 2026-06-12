/* ============================================================
   Customizações globais do site — Virgilio Roque
   Estratégia simplificada para evitar loops com o React do Framer:
   - Sem MutationObserver (cria ping-pong com o React)
   - Polling leve (4Hz, pára quando feito ou após 8s)
   - Cookie banner: localStorage flags + CSS fallback (sem JS remove)
   ============================================================ */
(function () {
  'use strict';

  /* --- Suprimir o cookie banner default do Framer ---
     Definir as flags antes do React do Framer hidratar.
     O CSS (site.css) é o backup caso ele apareça à mesma.       */
  try {
    if (!localStorage.getItem('framerCookiesDismissed')) {
      localStorage.setItem('framerCookiesDismissed', '1');
    }
    if (!localStorage.getItem('framerCookiesAutoAccepted')) {
      localStorage.setItem('framerCookiesAutoAccepted', '1');
    }
  } catch (e) {
    /* localStorage falha em Safari privado — CSS trata.         */
  }

  /* --- Esconder "Grupo Empresarial" e outros textos placeholder
     no footer. Polling leve a cada 250ms, máximo 8s, pára logo
     que encontra e esconde os links. NÃO usa MutationObserver
     para evitar ping-pong com a hidratação do React do Framer.  */
  const UNWANTED_LINK_TEXTS = ['Grupo Empresarial'];
  let pollIntervalId = null;
  let pollCount = 0;
  const POLL_MAX_TICKS = 32; /* 32 ticks × 250ms = 8 segundos */

  function hideUnwantedLinksOnce() {
    const links = document.querySelectorAll('a:not([data-vr-hidden])');
    let stillHasWork = false;
    links.forEach(function (a) {
      const t = (a.textContent || '').trim();
      if (UNWANTED_LINK_TEXTS.indexOf(t) !== -1) {
        a.setAttribute('data-vr-hidden', '1');
        a.style.display = 'none';
        const parent = a.parentElement;
        if (parent && parent.tagName === 'P' && parent.children.length === 1) {
          parent.style.display = 'none';
        }
        stillHasWork = true;
      }
    });
    return stillHasWork;
  }

  function startLinkHiding() {
    /* Primeira tentativa imediata */
    hideUnwantedLinksOnce();
    /* Polling defensivo para apanhar links que aparecem mais tarde */
    pollIntervalId = setInterval(function () {
      pollCount++;
      hideUnwantedLinksOnce();
      if (pollCount >= POLL_MAX_TICKS) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLinkHiding);
  } else {
    startLinkHiding();
  }
})();
