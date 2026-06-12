/* ============================================================
   Customizações páginas de obras — Virgilio Roque
   Substitui títulos/descrições placeholder do template Framer
   pelos textos reais de cada obra.
   ============================================================ */
(function () {
  'use strict';

  /* Helper para gerar lista de fotos (caminho relativo à raiz do site).
     ext = 'png' ou 'jpg'; n = quantas fotos numeradas 01..n existem.   */
  function photos(slug, ext, n) {
    const out = [];
    for (let i = 1; i <= n; i++) {
      const num = i < 10 ? `0${i}` : `${i}`;
      out.push(`/assets/custom/obras/${slug}/${num}.${ext}`);
    }
    return out;
  }

  /* Conteúdo das 4 obras. Chave = slug da pasta. */
  const OBRAS = {
    'empreendimento-cidade-nova': {
      title: 'Empreendimento Cidade Nova',
      location: 'Covilhã, Portugal',
      shortDescription:
        'Condomínio moderno no coração da Covilhã com apartamentos de tipologias variadas e acabamentos de alta qualidade.',
      longDescription: `Situado numa localização estratégica no centro da Covilhã, junto à Faculdade e a diversas escolas, o empreendimento Cidade Nova reflete o compromisso da Virgílio Roque com a construção de alta qualidade. Este condomínio fechado combina arquitetura contemporânea, rigor técnico e espaços de lazer exclusivos.

Qualidade Construtiva e Sustentabilidade — A estrutura foi projetada com soluções técnicas de excelência, com foco na eficiência e na durabilidade: isolamento térmico e acústico superior, integração de painéis fotovoltaicos para otimização dos consumos energéticos, e acabamentos de elevada resistência (pavimentos vinílicos, madeiras lacadas, portas de alta segurança).

Lazer e Espaços Comuns — O condomínio oferece infraestruturas residenciais diferenciadas: piscina de água aquecida com cobertura integrada para os meses de inverno, ginásio privativo para residentes, e áreas de convívio exteriores cuidadosamente planeadas.

Interiores e Tecnologia — Os apartamentos apresentam layouts funcionais que maximizam a luz natural, complementados com sistema de controlo de estores, central de aspiração robotizada, climatização completa com ar condicionado nas divisões principais, cozinhas modernas com bancadas em Silestone (ou equivalente) e eletrodomésticos encastrados Teka (ou equivalente).

Mobilidade e Segurança — Piso subterrâneo amplo e estruturado para estacionamento seguro, lugares de garagem privativos com opções de estacionamento duplo, e possibilidade de instalação para carregamento de veículos elétricos.`,
      photos: photos('empreendimento-cidade-nova', 'png', 10),
    },

    'edificio-faculdade-medicina': {
      title: 'Edifício Junto à Faculdade de Medicina',
      location: 'Covilhã, Portugal',
      shortDescription:
        'Edifício residencial junto à Faculdade de Medicina da UBI, ideal para investimento ou habitação própria.',
      longDescription: `Localizado numa zona de excelência e de elevada procura na Covilhã, junto à Faculdade de Medicina da UBI e ao Hospital, este edifício residencial reflete o padrão de rigor e qualidade construtiva da Virgílio Roque. Projetado para oferecer uma excelente oportunidade de investimento ou habitação própria, o empreendimento destaca-se pela modernidade, eficiência energética e centralidade.

Engenharia e Sustentabilidade — A construção foi planeada com foco na durabilidade e no desempenho energético: isolamento térmico e acústico de alta performance, integração de painéis fotovoltaicos para otimização dos consumos de energia, e estrutura sólida com materiais de gama superior que asseguram uma manutenção reduzida ao longo dos anos.

Interiores e Tecnologia — Os apartamentos apresentam layouts funcionais com divisões invulgarmente espaçosas e uma excelente exposição solar. Conforto térmico total assegurado por sistemas de ar condicionado e bomba de calor. Equipamentos tecnológicos de uso diário como sistema de controlo de estores e central de aspiração robotizada. Cozinhas modernas com acabamentos em alto brilho, equipadas com bancadas em Silestone (ou equivalente) e eletrodomésticos encastrados Teka (ou equivalente).

Mobilidade e Acabamentos Premium — Parqueamento privativo estruturado em piso subterrâneo, lugares de estacionamento dotados de possibilidade de instalação para carregamento de veículos elétricos, e acabamentos de excelência em todas as divisões, incluindo pavimento vinílico de alta resistência e madeiras lacadas.`,
      photos: photos('edificio-faculdade-medicina', 'png', 4),
    },

    'estacao-tortosendo': {
      title: 'Estação Tortosendo',
      location: 'Tortosendo, Covilhã',
      shortDescription:
        'Requalificação e modernização integral da Estação Ferroviária do Tortosendo, focada na melhoria das acessibilidades, segurança e durabilidade das infraestruturas para todos os utentes.',
      longDescription: `Empreitada de modernização e requalificação da Estação Ferroviária do Tortosendo, adaptando esta infraestrutura pública aos exigentes padrões atuais de segurança, conforto e mobilidade regional.

Engenharia e Reabilitação — Intervenção profunda em fachadas, coberturas e pavimentos para garantir maior isolamento e resistência ao tráfego diário. Atualização integral das redes elétricas, sistemas de iluminação e redes de escoamento de águas.

Acessibilidade e Funcionalidade — Eliminação de barreiras arquitetónicas nos acessos e remodelação dos cais de embarque para garantir total mobilidade. Reorganização das zonas envolventes de ligação entre a estação, áreas de estacionamento e a via pública. Melhoria das áreas de espera para proporcionar maior conforto aos passageiros.

Uma obra com o selo de rigor técnico e solidez da Virgílio Roque.`,
      photos: photos('estacao-tortosendo', 'jpg', 3),
    },

    'bloco-habitacional-quinta-do-pinheiro': {
      title: 'Bloco Habitacional — Quinta do Pinheiro',
      location: 'Covilhã, Portugal',
      shortDescription:
        'Um dos maiores blocos habitacionais da cidade da Covilhã, este empreendimento residencial de grande escala destaca-se pela robustez construtiva e elevado padrão de qualidade.',
      longDescription: `O Bloco Habitacional Quinta do Pinheiro afirma-se como um dos maiores edifícios residenciais da cidade da Covilhã. Este projeto de grande envergadura reflete a capacidade de execução logística e técnica da Virgílio Roque, aliando engenharia robusta a um design contemporâneo.

Solidez e Conforto — Estrutura de grande porte com isolamento térmico e acústico de alta performance.

Qualidade Superior — Utilização de materiais certificados de elevada durabilidade e baixa manutenção.

Arquitetura Funcional — Frações amplas e otimizadas para maximizar a entrada de luz natural.

Um projeto de referência que espelha o rigor técnico e a assinatura de confiança da Virgílio Roque.`,
      photos: photos('bloco-habitacional-quinta-do-pinheiro', 'jpg', 7),
    },
  };

  /* Descobre o slug da obra a partir do URL: /obras/{slug}/ */
  function getSlug() {
    const m = location.pathname.match(/\/obras\/([^/]+)\/?$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* Substitui texto de um RichTextContainer, removendo a animação
     palavra-a-palavra do Framer (que rebenta com textos longos).   */
  function replaceRichText(container, newText) {
    if (!container) return false;
    /* Encontra o elemento de texto interno (h2 ou p) */
    const target = container.querySelector('h2, h1, p');
    if (!target) return false;
    /* Esvazia spans animados (replaceChildren sem args = remove tudo,
       sem riscos de XSS porque não interpreta HTML).                */
    target.replaceChildren();
    /* Suporte para parágrafos múltiplos no long description */
    const paragraphs = newText.split(/\n\n+/);
    if (paragraphs.length === 1) {
      target.textContent = newText;
    } else {
      target.textContent = paragraphs[0];
      const parent = target.parentElement;
      paragraphs.slice(1).forEach((p) => {
        const newP = document.createElement('p');
        newP.className = target.className;
        newP.style.cssText = target.style.cssText;
        newP.style.marginTop = '1em';
        newP.textContent = p;
        parent.appendChild(newP);
      });
    }
    return true;
  }

  /* Aplica os textos da obra à página. O Framer faz hydration
     assíncrono — fazemos polling (no init) até os componentes
     aparecerem no DOM.                                          */
  function applyObraContent(obra) {
    const titleEl = document.querySelector('[data-framer-name="Property Name"]');
    const locationEl = document.querySelector('[data-framer-name="Property Location"]');
    const overviewEl = document.querySelector('[data-framer-name="Property Overview"]');

    let applied = 0;
    if (titleEl && replaceRichText(titleEl, obra.title)) applied++;
    if (locationEl && replaceRichText(locationEl, obra.location)) applied++;
    if (overviewEl) {
      /* Property Overview tem 2 partes: heading "Overview" + parágrafo
         Mantemos o heading e substituímos só o parágrafo descritivo. */
      const paragraphs = overviewEl.querySelectorAll('p');
      const lastP = paragraphs[paragraphs.length - 1];
      if (lastP) {
        /* replaceChildren() limpa sem interpretar HTML; depois
           textContent injecta texto plano, escapado automaticamente. */
        lastP.replaceChildren();
        lastP.textContent = obra.shortDescription;
        applied++;
      }
    }
    return applied >= 3;
  }

  /* Atualiza o <title> do browser */
  function updatePageTitle(obra) {
    document.title = `${obra.title} — Virgilio Roque`;
  }

  /* ============================================================
     CARROSSEL — Substitui a galeria do Framer pelo nosso carrossel.
     Layout: imagem grande à esquerda (rota por todas as fotos),
     2 imagens fixas à direita (foto 02 e 03 — segunda e terceira
     do array). Início da grande = foto 01.
     ============================================================ */
  function buildCarousel(obra) {
    if (!obra.photos || obra.photos.length === 0) return null;

    const root = document.createElement('div');
    root.className = 'vr-carousel';
    root.setAttribute('aria-label', 'Galeria de fotos da obra');

    /* --- Bloco principal (imagem grande + setas) --- */
    const main = document.createElement('div');
    main.className = 'vr-carousel__main';

    /* Track das imagens (translateX para animar) */
    const track = document.createElement('div');
    track.className = 'vr-carousel__track';
    obra.photos.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'vr-carousel__slide';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${obra.title} — fotografia ${i + 1}`;
      /* Lazy-load tudo excepto a primeira (que aparece logo) */
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.draggable = false;
      slide.appendChild(img);
      track.appendChild(slide);
    });
    main.appendChild(track);

    /* Setas + counter + swipe + teclado: só com mais de 3 fotos.
       Com ≤ 3 fotos, todas estão visíveis simultaneamente (1 grande
       + 2 laterais), por isso não há nada para navegar.            */
    if (obra.photos.length > 3) {
      const prev = document.createElement('button');
      prev.className = 'vr-carousel__arrow vr-carousel__arrow--prev';
      prev.type = 'button';
      prev.setAttribute('aria-label', 'Foto anterior');
      prev.textContent = '‹';
      main.appendChild(prev);

      const next = document.createElement('button');
      next.className = 'vr-carousel__arrow vr-carousel__arrow--next';
      next.type = 'button';
      next.setAttribute('aria-label', 'Foto seguinte');
      next.textContent = '›';
      main.appendChild(next);

      /* Indicador "X de N" */
      const counter = document.createElement('div');
      counter.className = 'vr-carousel__counter';
      counter.textContent = `1 / ${obra.photos.length}`;
      main.appendChild(counter);

      /* Estado e navegação */
      let index = 0;
      const total = obra.photos.length;
      function go(newIndex) {
        index = ((newIndex % total) + total) % total;
        track.style.transform = `translateX(-${index * 100}%)`;
        counter.textContent = `${index + 1} / ${total}`;
      }
      prev.addEventListener('click', () => go(index - 1));
      next.addEventListener('click', () => go(index + 1));

      /* Teclado ← → quando o carrossel está focado ou em viewport */
      root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          go(index - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          go(index + 1);
        }
      });
      root.tabIndex = 0;

      /* Swipe touch (mobile) */
      let startX = null;
      track.addEventListener(
        'touchstart',
        (e) => {
          startX = e.touches[0].clientX;
        },
        { passive: true }
      );
      track.addEventListener(
        'touchend',
        (e) => {
          if (startX === null) return;
          const dx = e.changedTouches[0].clientX - startX;
          startX = null;
          /* Threshold de 40px para não disparar com toques acidentais */
          if (Math.abs(dx) > 40) go(dx < 0 ? index + 1 : index - 1);
        },
        { passive: true }
      );
    }

    root.appendChild(main);

    /* --- Lateral: 2 imagens fixas (foto 02 e 03) --- */
    /* Mostro só se houver pelo menos 2 fotos (precisamos da 02);
       a 3ª foto pode não existir (ex: Tortosendo tem 3) — nesse
       caso a 3ª lateral também aparece, é a foto 03.            */
    if (obra.photos.length >= 2) {
      const aside = document.createElement('div');
      aside.className = 'vr-carousel__aside';

      /* Foto 2 (índice 1) e foto 3 (índice 2), se existirem */
      [1, 2].forEach((i) => {
        if (i >= obra.photos.length) return;
        const item = document.createElement('div');
        item.className = 'vr-carousel__aside-item';
        const img = document.createElement('img');
        img.src = obra.photos[i];
        img.alt = `${obra.title} — fotografia ${i + 1}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        item.appendChild(img);
        aside.appendChild(item);
      });

      root.appendChild(aside);
    }

    return root;
  }

  /* Substitui o "Image Wrapper" (galeria original do Framer) pelo
     nosso carrossel. Idempotente: se já foi feito, não repete.    */
  function injectCarousel(obra) {
    if (document.querySelector('.vr-carousel')) return true;
    const wrapper = document.querySelector('[data-framer-name="Image Wrapper"]');
    if (!wrapper) return false;
    const carousel = buildCarousel(obra);
    if (!carousel) return false;
    /* replaceChildren: limpa filhos antigos sem interpretar HTML */
    wrapper.replaceChildren(carousel);
    return true;
  }

  function init() {
    const slug = getSlug();
    if (!slug || !OBRAS[slug]) return;
    const obra = OBRAS[slug];
    updatePageTitle(obra);

    let textsDone = applyObraContent(obra);
    let carouselDone = injectCarousel(obra);
    if (textsDone && carouselDone) return;

    /* Polling em vez de MutationObserver: evita ping-pong com a
       hidratação do React do Framer. 4Hz por 8 segundos, pára
       logo que ambos os trabalhos estejam feitos.                */
    let ticks = 0;
    const MAX_TICKS = 32; /* 32 × 250ms = 8s */
    const intervalId = setInterval(function () {
      ticks++;
      if (!textsDone) textsDone = applyObraContent(obra);
      if (!carouselDone) carouselDone = injectCarousel(obra);
      if ((textsDone && carouselDone) || ticks >= MAX_TICKS) {
        clearInterval(intervalId);
      }
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
