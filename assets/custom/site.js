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
    /* Grupo Empresarial: item placeholder do template (apareceu
       no dropdown "Sobre Nós" do menu hamburger lazy-mounted) */
    'Grupo Empresarial': '__hide__',
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

  /* Encontra o "card container" individual — APENAS o card, NUNCA
     um wrapper que contenha múltiplos cards.

     Heurística (BUG anterior subiu até "Container" da Case Section
     e escondia todos os cards da página /obras):
     - Apenas 1-2 níveis acima do <a>
     - Parar IMEDIATAMENTE se o parent imediato tem nome com "Grid",
       "List", "Section" ou "Wrapper" (sinal que somos siblings de
       outros cards no mesmo container)
     - Nunca retornar elemento cujo data-framer-name termine em
       "Section" ou "Container" (esses englobam vários cards).      */
  function findCardContainer(anchor) {
    let cur = anchor;
    for (let i = 0; i < 2 && cur && cur.parentElement; i++) {
      const parent = cur.parentElement;
      const parentName = parent.getAttribute('data-framer-name') || '';
      /* Se já estamos a um nível onde o parent agrupa cards, ficamos
         aqui (não subir mais).                                      */
      if (/^(Grid|List|Cards|Cases|Case Section|Service Section|Content|Container)$/.test(parentName)) {
        return cur;
      }
      /* Se o cur em si é um Section/Container, não devolver — está
         demasiado alto. Devolver o nível abaixo.                    */
      const curName = cur.getAttribute('data-framer-name') || '';
      if (/^(Section$|Container$|Content$|Grid$|Cases$|Wrapper$)/.test(curName)) {
        return anchor; /* fallback: esconder só o link, não o grid */
      }
      cur = parent;
    }
    /* Validação final: se o cur que vamos devolver tem nome de
       container colectivo, voltar ao anchor para não esconder demais. */
    const finalName = cur.getAttribute('data-framer-name') || '';
    if (/^(Section|Container|Content|Grid|Cases|Wrapper)$/.test(finalName)) {
      return anchor;
    }
    return cur;
  }

  /* RESCATE: reverter o bug anterior em que findCardContainer subiu
     até "Container" e aplicou display:none ao wrapper de todos os
     cards da página /obras. Limpa inline display:none de qualquer
     elemento com data-framer-name="Container" ou similar.          */
  function uncoverHiddenObraCards() {
    document
      .querySelectorAll('[data-framer-name="Container"][style*="display"], [data-framer-name="Content"][style*="display"], [data-framer-name="Grid"][style*="display"]')
      .forEach(function (el) {
        if (el.style.display === 'none') {
          el.style.display = '';
        }
      });
  }

  function fixObraCards() {
    uncoverHiddenObraCards();
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
  /* ============================================================
     CORRIGIR LAYOUT do dropdown 'Sobre Nós' no menu hamburger
     ============================================================
     O dropdown está em position:fixed com top:~198px e height:~174px,
     ficando em overlay (z-index:11) sobre os items seguintes do menu
     (Portefólio em y=200, Contactar em y=240 — completamente tapados
     pelo dropdown). Solução: empurrar os items irmãos que vêm depois
     de "Sobre Nós" para baixo do dropdown quando este estiver aberto.

     IMPORTANTE: o dropdown box é position:fixed, por isso NÃO está
     dentro da subárvore do "Sobre Nós" — está em outro ponto do DOM.
     Detectamos o estado aberto pela existência do texto "Páginas
     internas" visível em qualquer lugar do documento.
     ============================================================ */
  function adjustDropdownLayout() {
    /* Detectar dropdown aberto: procurar "Páginas internas" visível */
    let dropdownOpenMarker = null;
    document.querySelectorAll('p, span').forEach(function (el) {
      if (dropdownOpenMarker) return;
      const t = el.textContent.trim().toLowerCase();
      if (t === 'páginas internas') {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) dropdownOpenMarker = el;
      }
    });

    /* Encontrar o item "Sobre Nós" no menu drawer (variante visível) */
    const sobreP = Array.from(document.querySelectorAll('p')).find(function (p) {
      return p.textContent.trim() === 'Sobre Nós' && p.getBoundingClientRect().width > 0;
    });
    if (!sobreP) return;

    /* Subir até ao child direto do container "Links" — esse é o
       "Sobre Nós item" cujos siblings precisam empurrar.            */
    let sobreItem = sobreP;
    for (let i = 0; i < 8 && sobreItem.parentElement; i++) {
      const parent = sobreItem.parentElement;
      if (parent.getAttribute('data-framer-name') === 'Links') break;
      sobreItem = parent;
    }
    const linksContainer = sobreItem.parentElement;
    if (linksContainer?.getAttribute('data-framer-name') !== 'Links') return;

    /* Os children do Links usam CSS flex `order` para ordem visual.
       O DOM order é diferente da ordem visual:
         DOM: Inicio, Portefólio, Sobre Nós, Contactar, Blog
         Visual: Inicio (1), Sobre Nós (7), Portefólio (8), Contactar (9), Blog (10)
       Por isso `nextElementSibling` no DOM (=Contactar) NÃO é o
       sibling visual a empurrar. Tem de ser o de menor `order`
       maior que o do "Sobre Nós".                                  */
    const sobreOrder = parseFloat(getComputedStyle(sobreItem).order) || 0;
    let nextVisualSibling = null;
    let nextVisualOrder = Infinity;
    Array.from(linksContainer.children).forEach(function (sib) {
      if (sib === sobreItem) return;
      const sibOrder = parseFloat(getComputedStyle(sib).order) || 0;
      if (sibOrder > sobreOrder && sibOrder < nextVisualOrder) {
        nextVisualOrder = sibOrder;
        nextVisualSibling = sib;
      }
    });
    if (!nextVisualSibling) return;

    const isOpen = !!dropdownOpenMarker;

    if (isOpen) {
      /* Procurar a height do dropdown box pelo ancestor com
         position:fixed do marker.                                   */
      let dropdownBox = dropdownOpenMarker;
      for (let i = 0; i < 8 && dropdownBox.parentElement; i++) {
        const cs = getComputedStyle(dropdownBox);
        if (cs.position === 'fixed') break;
        dropdownBox = dropdownBox.parentElement;
      }
      const dropH = Math.round(dropdownBox.getBoundingClientRect().height);
      const offset = Math.max(dropH + 20, 200);
      const currentOffset = nextVisualSibling.getAttribute('data-vr-dropdown-offset');
      if (currentOffset !== String(offset)) {
        nextVisualSibling.style.marginTop = offset + 'px';
        nextVisualSibling.setAttribute('data-vr-dropdown-offset', String(offset));
      }
    } else {
      /* Dropdown fechado — limpar margem.                           */
      Array.from(linksContainer.children).forEach(function (sib) {
        if (sib.hasAttribute('data-vr-dropdown-offset')) {
          sib.style.marginTop = '';
          sib.removeAttribute('data-vr-dropdown-offset');
        }
      });
    }
  }

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
    adjustDropdownLayout();
    let ticks = 0;
    const MAX_TICKS = 32;
    const intervalId = setInterval(function () {
      ticks++;
      fixNavLinks();
      fixObraCards();
      hideStaleMenuItems();
      adjustDropdownLayout();
      if (ticks >= MAX_TICKS) clearInterval(intervalId);
    }, 250);

    /* O menu hamburger mobile é lazy-mounted (Framer só renderiza
       os items quando o utilizador abre o menu). Como o polling
       inicial pode ter parado antes disso, re-aplicamos os fixes
       em CADA clique no documento. Idempotente via markers,
       custo desprezável.

       BURST POLLING (2s): em vez de só 2 timeouts (50ms + 400ms),
       corremos 10 vezes em 2 segundos (200ms cada). Cobre race
       conditions onde o utilizador clica rapidamente abrir/fechar
       o dropdown — o estado pode mudar entre clicks e queremos
       o margin-top a reflectir o estado final, não um transitório. */
    let burstIntervalId = null;
    let burstTicks = 0;
    function clickBurstFix() {
      fixNavLinks();
      hideStaleMenuItems();
      adjustDropdownLayout();
    }
    document.addEventListener(
      'click',
      function () {
        if (burstIntervalId) clearInterval(burstIntervalId);
        burstTicks = 0;
        clickBurstFix(); /* imediato */
        burstIntervalId = setInterval(function () {
          burstTicks++;
          clickBurstFix();
          if (burstTicks >= 10) {
            clearInterval(burstIntervalId);
            burstIntervalId = null;
          }
        }, 200);
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
