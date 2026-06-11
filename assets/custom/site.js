/* ============================================================
   Customizações globais do site — Virgilio Roque
   Executado em todas as páginas o mais cedo possível.
   ============================================================ */
(function () {
  'use strict';

  /* --- Suprimir o cookie banner default do Framer ---
     O Framer mostra o seu banner quando estas 3 chaves não
     existem no localStorage. Ao defini-las antes do React do
     Framer arrancar, ele assume "já consentido" e não monta
     o banner. Isto não afecta cookies analíticos do site nem
     o nosso banner custom (centro da página).                  */
  try {
    if (!localStorage.getItem('framerCookiesDismissed')) {
      localStorage.setItem('framerCookiesDismissed', '1');
    }
    if (!localStorage.getItem('framerCookiesAutoAccepted')) {
      localStorage.setItem('framerCookiesAutoAccepted', '1');
    }
  } catch (e) {
    /* localStorage pode falhar em modo privado de Safari — não
       é crítico. O CSS de fallback (site.css) garante que se o
       banner for renderizado, fica escondido na mesma.         */
  }

  /* --- Remoção defensiva: caso o banner ainda chegue a
     aparecer no DOM (timing entre o nosso script e o do
     Framer), apanhamos via MutationObserver e removemos.       */
  function isCookieBanner(node) {
    if (!node || node.nodeType !== 1 || !node.className) return false;
    const cls = typeof node.className === 'string' ? node.className : '';
    return (
      cls.indexOf('framer-cookie-banner-container') !== -1 ||
      cls.indexOf('framer-lib-cookie-banner') !== -1 ||
      cls.indexOf('framer-cookie-banner-type-') !== -1
    );
  }

  function sweepCookieBanner(root) {
    if (!root) return;
    if (isCookieBanner(root)) {
      root.remove();
      return;
    }
    if (root.querySelectorAll) {
      root
        .querySelectorAll(
          '[class*="framer-cookie-banner-container"],[class*="framer-lib-cookie-banner"],[class*="framer-cookie-banner-type-"]'
        )
        .forEach((n) => n.remove());
    }
  }

  function startObserver() {
    /* Limpa o que já lá esteja */
    sweepCookieBanner(document.body || document.documentElement);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => sweepCookieBanner(n));
      });
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    /* Safety: para de observar ao fim de 30s — depois disso o
       Framer já hidratou e mais ninguém vai injectar o banner.   */
    setTimeout(() => observer.disconnect(), 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
