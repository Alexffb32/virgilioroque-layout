/* ============================================================
   Customizações globais do site — Virgilio Roque
   - Polyfill multi-range fetch (essencial para o CMS do Framer
     funcionar no Vercel)
   - Cookie banner: localStorage flags + CSS fallback
   - Esconder "Grupo Empresarial" via polling leve
   ============================================================ */
(function () {
  'use strict';

  /* ============================================================
     POLYFILL: multi-range HTTP fetch para .framercms
     ============================================================
     O Framer usa Range: bytes=A-B,C-D,... para carregar registos
     do CMS. O CDN da Vercel NÃO suporta multi-range (responde com
     HTTP 200 + ficheiro inteiro em vez de 206 Multipart). Quando
     o Framer compara tamanho recebido vs. esperado, aborta com
     "Unexpected response length" e a página fica em loop.

     A solução: interceptar fetch() para .framercms. Quando vem
     com multi-range, fazemos N pedidos sequenciais com single
     range cada, e concatenamos as respostas no mesmo formato que
     o Framer espera (bytes contíguos, na ordem das ranges).
     ============================================================ */
  (function patchFetchForMultiRange() {
    if (typeof window === 'undefined' || !window.fetch) return;
    const originalFetch = window.fetch.bind(window);

    function parseRanges(rangeHeader) {
      /* Aceita "bytes=A-B,C-D,E-F" — devolve [[A,B],[C,D],[E,F]] */
      if (!rangeHeader) return null;
      const m = /^bytes=(.+)$/i.exec(String(rangeHeader).trim());
      if (!m) return null;
      const parts = m[1].split(',').map(function (p) {
        const seg = p.trim().split('-');
        return [parseInt(seg[0], 10), parseInt(seg[1], 10)];
      });
      if (parts.some(function (p) { return isNaN(p[0]) || isNaN(p[1]); })) return null;
      return parts;
    }

    function getRangeHeader(init) {
      if (!init || !init.headers) return null;
      const h = init.headers;
      if (h instanceof Headers) return h.get('Range') || h.get('range');
      if (typeof h.get === 'function') return h.get('Range') || h.get('range');
      if (Array.isArray(h)) {
        for (const pair of h) {
          if (String(pair[0]).toLowerCase() === 'range') return pair[1];
        }
        return null;
      }
      return h.Range || h.range || null;
    }

    function isFramercmsURL(input) {
      try {
        const u = typeof input === 'string' ? input : input.url;
        return /\.framercms(\?|$)/.test(u);
      } catch (e) {
        return false;
      }
    }

    async function fetchSingleRange(input, init, range) {
      const headers = new Headers(init && init.headers ? init.headers : {});
      headers.set('Range', 'bytes=' + range[0] + '-' + range[1]);
      const newInit = Object.assign({}, init || {}, { headers: headers });
      const resp = await originalFetch(input, newInit);
      if (!resp.ok && resp.status !== 206) {
        throw new Error('Single-range fetch failed: ' + resp.status);
      }
      return await resp.arrayBuffer();
    }

    window.fetch = async function (input, init) {
      try {
        if (!isFramercmsURL(input)) {
          return originalFetch(input, init);
        }
        const rangeHeader = getRangeHeader(init);
        if (!rangeHeader) {
          return originalFetch(input, init);
        }
        const ranges = parseRanges(rangeHeader);
        /* Só intervimos se houver MAIS DE UM range — single-range
           funciona bem no Vercel.                                  */
        if (!ranges || ranges.length <= 1) {
          return originalFetch(input, init);
        }
        /* Multi-range: fazemos N pedidos sequenciais e concatenamos.
           Sequencial (não Promise.all) para reduzir picos de rede.  */
        const buffers = [];
        let totalLength = 0;
        for (const r of ranges) {
          const buf = await fetchSingleRange(input, init, r);
          buffers.push(buf);
          totalLength += buf.byteLength;
        }
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const buf of buffers) {
          combined.set(new Uint8Array(buf), offset);
          offset += buf.byteLength;
        }
        /* Resposta sintética com o formato que o Framer espera.   */
        return new Response(combined.buffer, {
          status: 206,
          statusText: 'Partial Content',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': String(totalLength),
          },
        });
      } catch (e) {
        /* Em caso de erro, fallback para fetch original — pior
           cenário é o erro original "Unexpected response length",
           mas pelo menos não pior do que estava antes.            */
        console.warn('[VR] multi-range polyfill error:', e);
        return originalFetch(input, init);
      }
    };
  })();

  /* --- Suprimir o cookie banner default do Framer ---             */
  try {
    if (!localStorage.getItem('framerCookiesDismissed')) {
      localStorage.setItem('framerCookiesDismissed', '1');
    }
    if (!localStorage.getItem('framerCookiesAutoAccepted')) {
      localStorage.setItem('framerCookiesAutoAccepted', '1');
    }
  } catch (e) {
    /* localStorage falha em Safari privado — CSS trata.            */
  }

  /* --- Esconder "Grupo Empresarial" e outros textos placeholder
     no footer via polling leve.                                    */
  const UNWANTED_LINK_TEXTS = ['Grupo Empresarial'];
  let pollIntervalId = null;
  let pollCount = 0;
  const POLL_MAX_TICKS = 32; /* 32 ticks × 250ms = 8s */

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
