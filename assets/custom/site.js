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

  /* O link "Grupo Empresarial" foi removido directamente do HTML
     de todas as 26 páginas no commit que introduziu esta versão
     do site.js. Já não precisamos de o esconder via JS.          */

  /* ============================================================
     CORRIGIR HREFS ERRADOS NOS LINKS DA NAV
     ============================================================
     O template Framer original deixou:
     - Telefones com hrefs placeholders (tel:+1 (123) 456-7890)
     - Links para Termos/Privacidade/Cookies apontando para /sobre
     - "Inicio" → /sobre, "Portefólio" → /, "Contactar" → /, etc.
     - "Blog" (página inexistente) ainda visível

     Mapeamos por TEXTO do link (case-sensitive, trim) para o
     href correcto. Aplicado via polling 4Hz × 8s para resistir
     a re-renders do React do Framer.
     ============================================================ */
  const LINK_HREF_MAP = {
    /* Telefones — tel: schema com formato internacional */
    'tlf: (+351) 275 971 394': 'tel:+351275971394',
    'fax: (+351) 275 971 534': 'tel:+351275971534',
    'tlm: 967 138 082 / 967 138 116 / 962 269 776': 'tel:+351967138082',
    /* Variante usada noutra zona do template (sem prefixo "tlf:") */
    '(+351) 275 971 394': 'tel:+351275971394',
    /* Notas das chamadas: não são clicáveis — removemos o href */
    '(Chamada para a rede fixa nacional)': '__remove__',
    '(Chamada para a rede móvel nacional)': '__remove__',
    /* Links de páginas legais */
    'Termos e Condições': '/termos-e-condicoes',
    'Política de Privacidade': '/politica-de-privacidade',
    'Política de cookies': '/politica-de-cookies',
    'Política de Cookies': '/politica-de-cookies',
    /* Links de navegação */
    'Inicio': '/',
    'Início': '/',
    'Sobre Nós': '/sobre',
    'A nossa Historia': '/sobre',
    'A Nossa História': '/sobre',
    'Equipa': '/sobre',
    'Recrutamento': '/carreira',
    'Portefólio': '/obras',
    'Portfólio': '/obras',
    'Contactar': '/contacto',
    'Contacto': '/contacto',
    /* Blog: já não existe — esconder */
    'Blog': '__hide__',
  };

  function fixNavLinks() {
    document.querySelectorAll('a:not([data-vr-fixed])').forEach(function (a) {
      /* Normalizar non-breaking spaces (U+00A0) e múltiplos espaços
         para space normal — o Framer usa   em alguns textos
         (ex: "tlf: (+351)...") e isso impedia o match.        */
      const text = (a.textContent || '')
        .replace(/ /g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!text) return;
      const action = LINK_HREF_MAP[text];
      if (!action) return;
      /* Marca como já tratado — evita reprocessar e loop */
      a.setAttribute('data-vr-fixed', '1');
      if (action === '__hide__') {
        a.style.display = 'none';
        /* Também esconder o parent <p> se for o único filho */
        const p = a.parentElement;
        if (p && p.tagName === 'P' && p.children.length === 1) {
          p.style.display = 'none';
        }
        return;
      }
      if (action === '__remove__') {
        a.removeAttribute('href');
        /* Remove cursor pointer também */
        a.style.cursor = 'default';
        a.style.color = 'inherit';
        a.style.textDecoration = 'none';
        return;
      }
      a.setAttribute('href', action);
    });
  }

  function startNavFixer() {
    fixNavLinks();
    let ticks = 0;
    const MAX_TICKS = 32;
    const intervalId = setInterval(function () {
      ticks++;
      fixNavLinks();
      if (ticks >= MAX_TICKS) clearInterval(intervalId);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startNavFixer);
  } else {
    startNavFixer();
  }
})();
