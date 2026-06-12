/* ============================================================
   Customizações globais do site — Virgilio Roque
   ESTRATÉGIA SIMPLES E DEFINITIVA:
   - Forçar reload completo em cada navegação (desactiva o
     client-side router do Framer, que está a falhar)
   - Cookie banner: localStorage flags + CSS fallback
   - Esconder "Grupo Empresarial" via polling leve
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     FORÇAR NAVEGAÇÃO TRADICIONAL (NÃO-SPA)
     ============================================================
     O client-side router do Framer está a falhar em runtime no
     Vercel: carregamento dinâmico de páginas entra em loop.

     Estratégia: interceptar TODOS os cliques em <a> internos e
     forçar window.location.assign(), que faz reload completo.
     O Framer perde a "magia" SPA mas cada página carrega como
     site tradicional — sempre fiável.

     Capturamos no document em fase de capture (true) para vir
     antes dos handlers do Framer.                                */
  document.addEventListener(
    'click',
    function (e) {
      /* Ignorar se a tecla modificadora está premida (ctrl-click =
         abrir em nova tab, etc.) — deixa o browser tratar.        */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.button !== 0) return; /* só clique esquerdo */

      /* Procurar o <a> mais próximo no caminho do evento.        */
      let target = e.target;
      while (target && target !== document) {
        if (target.tagName === 'A') break;
        target = target.parentNode;
      }
      if (!target || target.tagName !== 'A') return;

      const href = target.getAttribute('href');
      if (!href) return;

      /* Ignorar anchors, telefones, emails, ficheiros JS/CSS.    */
      if (href.startsWith('#')) return;
      if (href.startsWith('mailto:')) return;
      if (href.startsWith('tel:')) return;
      if (href.startsWith('javascript:')) return;

      /* Resolver URL absoluto para comparar host.                */
      let resolvedURL;
      try {
        resolvedURL = new URL(href, location.href);
      } catch (err) {
        return;
      }

      /* Links externos: deixa o browser/Framer tratar (target=_blank etc) */
      if (resolvedURL.host !== location.host) return;

      /* Se o link tem target=_blank, não interferir.              */
      if (target.target && target.target !== '_self') return;

      /* Forçar reload completo via location.assign.              */
      e.preventDefault();
      e.stopPropagation();
      window.location.assign(resolvedURL.href);
    },
    true /* useCapture = true: corre antes do Framer */
  );

  /* --- Suprimir o cookie banner default do Framer ---            */
  try {
    if (!localStorage.getItem('framerCookiesDismissed')) {
      localStorage.setItem('framerCookiesDismissed', '1');
    }
    if (!localStorage.getItem('framerCookiesAutoAccepted')) {
      localStorage.setItem('framerCookiesAutoAccepted', '1');
    }
  } catch (e) {
    /* localStorage falha em Safari privado — CSS trata.           */
  }

  /* --- Esconder "Grupo Empresarial" via polling leve.            */
  const UNWANTED_LINK_TEXTS = ['Grupo Empresarial'];
  let pollIntervalId = null;
  let pollCount = 0;
  const POLL_MAX_TICKS = 32; /* 32 × 250ms = 8s */

  function hideUnwantedLinksOnce() {
    const links = document.querySelectorAll('a:not([data-vr-hidden])');
    links.forEach(function (a) {
      const t = (a.textContent || '').trim();
      if (UNWANTED_LINK_TEXTS.indexOf(t) !== -1) {
        a.setAttribute('data-vr-hidden', '1');
        a.style.display = 'none';
        const parent = a.parentElement;
        if (parent && parent.tagName === 'P' && parent.children.length === 1) {
          parent.style.display = 'none';
        }
      }
    });
  }

  function startLinkHiding() {
    hideUnwantedLinksOnce();
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
