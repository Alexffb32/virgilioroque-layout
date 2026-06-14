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

  /* ============================================================
     CORRIGIR CARDS DE OBRAS na home / listagem
     ============================================================
     O CMS interno do Framer ainda tem todas as obras antigas com
     títulos errados/typos. Como não podemos editar os binários
     .framercms sem risco, corrigimos via runtime:

     - SLUGS_TO_HIDE: cards de obras eliminadas que devem desaparecer
     - SLUG_CARD_FIXES: mapeamento slug → { title, location }
       para sobrescrever textos errados nos cards visíveis

     Detectamos cards pelo <a href> que aponta para /obras/SLUG e
     subimos para esconder ou para alterar os textos dentro.
     ============================================================ */
  const SLUGS_TO_HIDE = ['duplex', 'centro-interpretativo-da-cereja'];

  const SLUG_CARD_FIXES = {
    'empreendimento-cidade-nova': {
      title: 'Empreendimento Cidade Nova',
      location: 'Covilhã',
    },
    'edificio-faculdade-medicina': {
      title: 'Edifício Junto à Faculdade de Medicina',
      location: 'Covilhã',
    },
    'estacao-tortosendo': {
      title: 'Estação Tortosendo',
      location: 'Tortosendo',
    },
    'bloco-habitacional-quinta-do-pinheiro': {
      title: 'Bloco Habitacional - Quinta do Pinheiro',
      location: 'Covilhã',
    },
  };

  /* Devolve o slug da obra a partir do href do card.              */
  function extractObraSlug(href) {
    const m = /\/obras\/([a-z0-9-]+)\/?(?:[?#]|$)/i.exec(href);
    return m ? m[1] : null;
  }

  /* Encontra o "card container" — o elemento mais próximo que
     parece o card todo (não só o <a> interno). Heurística: subir
     enquanto o tamanho do elemento crescer; parar quando atingir
     uma section ou grid container típico do Framer.                */
  function findCardContainer(anchor) {
    let cur = anchor;
    let lastArea = 0;
    /* Subir até 6 níveis ou enquanto a área aumenta              */
    for (let i = 0; i < 6 && cur && cur.parentElement; i++) {
      const r = cur.getBoundingClientRect();
      const area = r.width * r.height;
      /* Se o pai é a "Case Section" ou "Service Section", já
         demos um nível a mais — devolve current.                 */
      const parentName = cur.parentElement.getAttribute('data-framer-name') || '';
      if (/Section$/.test(parentName) || /Wrapper$/.test(parentName)) {
        return cur;
      }
      cur = cur.parentElement;
      lastArea = area;
    }
    return anchor;
  }

  function fixObraCards() {
    document.querySelectorAll('a[href*="/obras/"]:not([data-vr-card-fixed])').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      const slug = extractObraSlug(href);
      if (!slug) return;
      a.setAttribute('data-vr-card-fixed', '1');

      /* Esconder cards de obras eliminadas */
      if (SLUGS_TO_HIDE.indexOf(slug) !== -1) {
        const card = findCardContainer(a);
        if (card) card.style.display = 'none';
        return;
      }

      /* Corrigir textos errados nos cards.
         Os títulos NÃO têm font-weight bold (font-weight: 400 igual
         à localização). Usamos ORDEM em vez de styling: 1º texto
         encontrado dentro do <a> = título, 2º = localização.      */
      const fix = SLUG_CARD_FIXES[slug];
      if (!fix) return;

      /* Apanhar todos os <p>/<span>/<h*> com texto, pela ordem
         em que aparecem no DOM (TreeWalker garante ordem). */
      const walker = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (n) {
          /* Só leaf elements com texto e tag de texto */
          if (n.children.length > 0) return NodeFilter.FILTER_SKIP;
          if (!/^(P|SPAN|H[1-6]|DIV)$/.test(n.tagName)) return NodeFilter.FILTER_SKIP;
          const t = (n.textContent || '').trim();
          if (!t) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const textElements = [];
      let node;
      while ((node = walker.nextNode())) {
        const t = (node.textContent || '').replace(/ /g, ' ').trim();
        if (t) textElements.push({ el: node, text: t });
      }

      /* Espera-se 2 elementos: [título, localização].
         Mas se o card tem só 1 (variante mobile compact), trata-se
         o único elemento como título.                              */
      if (textElements.length >= 1) {
        const titleEl = textElements[0];
        if (titleEl.text !== fix.title) titleEl.el.textContent = fix.title;
      }
      if (textElements.length >= 2) {
        const locEl = textElements[1];
        if (locEl.text !== fix.location) locEl.el.textContent = fix.location;
      }
    });
  }

  /* ============================================================
     ESCONDER ITEMS PLACEHOLDER NO DROPDOWN "SOBRE NÓS"
     ============================================================
     O dropdown "Sobre Nós" no menu hamburger mostra:
       Páginas Internas
       A Nossa Historia
       Recrutamento
       Empreendimento Cidade Nova   ← placeholder errado!

     "Empreendimento Cidade Nova" não devia estar aqui (é uma obra,
     não uma página interna sobre a empresa). Esconde-se sempre
     que esse texto aparece FORA da Case Section.
     ============================================================ */
  function hideStaleMenuItems() {
    document.querySelectorAll('p:not([data-vr-stale-hidden]), a:not([data-vr-stale-hidden])').forEach(function (el) {
      const text = (el.textContent || '').replace(/ /g, ' ').trim();
      /* "Empreendimento Cidade Nova" só é legítimo dentro da
         Case Section (cards da home) ou dentro do <h1>/<h2>
         do título da página da obra. Em qualquer outro lugar
         (especialmente menus / dropdowns) — esconder.            */
      if (text === 'Empreendimento Cidade Nova' || text === 'Empreendimento Cidade NovaCovilhã') {
        const inCaseSection = el.closest('[data-framer-name="Case Section"]');
        const inObraTitle = el.closest('[data-framer-name="Property Name"]') ||
                            el.closest('[data-framer-name="Header"]');
        if (!inCaseSection && !inObraTitle) {
          el.setAttribute('data-vr-stale-hidden', '1');
          el.style.display = 'none';
        }
      }
    });
  }

  function startNavFixer() {
    fixNavLinks();
    fixObraCards();
    hideStaleMenuItems();
    let ticks = 0;
    const MAX_TICKS = 32;
    const intervalId = setInterval(function () {
      ticks++;
      fixNavLinks();
      fixObraCards();
      hideStaleMenuItems();
      if (ticks >= MAX_TICKS) clearInterval(intervalId);
    }, 250);

    /* O menu hamburger mobile é lazy-mounted (Framer só renderiza
       os items quando o utilizador abre o menu). Como o polling
       inicial pode ter parado antes disso, re-aplicamos os fixes
       em CADA clique no documento. Idempotente via markers
       data-vr-fixed e data-vr-stale-hidden, custo desprezável.    */
    document.addEventListener(
      'click',
      function () {
        setTimeout(function () {
          fixNavLinks();
          hideStaleMenuItems();
        }, 50);
        setTimeout(function () {
          fixNavLinks();
          hideStaleMenuItems();
        }, 400); /* após animação Framer */
      },
      true /* capture phase: antes dos handlers do Framer */
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startNavFixer);
  } else {
    startNavFixer();
  }
})();
