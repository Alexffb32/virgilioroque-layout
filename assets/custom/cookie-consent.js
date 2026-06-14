/* ============================================================
   Banner de Consentimento de Cookies — Virgilio Roque
   Banner central com 3 opções (Aceitar Todas / Apenas Essenciais
   / Personalizar). Modal de configurações detalhadas.
   Estado persistido em localStorage (chave 'vrCookieConsent_v1').

   1 único ficheiro — injecta CSS, HTML e comportamento.
   Para incluir numa página: <script src="/assets/custom/cookie-consent.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  /* Se já existir um banner injectado (refresh, navegação), não duplicar. */
  if (document.getElementById('vrCookieBanner')) return;

  const STORAGE_KEY = 'vrCookieConsent_v1';

  const CSS = `
.vr-cookie-banner{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);width:min(720px,calc(100vw - 32px));background:#fff;border:1px solid rgba(10,17,25,.08);border-radius:16px;box-shadow:0 12px 40px rgba(10,17,25,.18);padding:20px 22px;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#0a1119;z-index:2147483647;display:none;animation:vrCookieSlideUp .4s cubic-bezier(.22,1,.36,1)}
.vr-cookie-banner.visible{display:block}
.vr-cookie-banner *{box-sizing:border-box}
@keyframes vrCookieSlideUp{from{opacity:0;transform:translate(-50%,30px)}to{opacity:1;transform:translate(-50%,0)}}
.vr-cookie-row{display:flex;gap:14px;align-items:flex-start}
.vr-cookie-icon{flex:0 0 40px;width:40px;height:40px;border-radius:50%;background:#fff5d6;display:flex;align-items:center;justify-content:center;font-size:22px}
.vr-cookie-body{flex:1;min-width:0}
.vr-cookie-title{font-size:15px;font-weight:600;margin:0 0 6px;color:#0a1119}
.vr-cookie-text{font-size:13px;line-height:1.5;color:#4a5260;margin:0 0 14px}
.vr-cookie-text a{color:#d9a01e;text-decoration:none;font-weight:500}
.vr-cookie-text a:hover{text-decoration:underline}
.vr-cookie-actions{display:flex;gap:10px;flex-wrap:wrap}
.vr-cookie-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:500;cursor:pointer;border:1px solid transparent;font-family:inherit;transition:filter .15s,background .15s,border-color .15s}
.vr-cookie-btn-accept{background:#f0b73c;color:#0a1119;border-color:#f0b73c}
.vr-cookie-btn-accept:hover{filter:brightness(.95)}
.vr-cookie-btn-essential{background:#fff;color:#0a1119;border-color:rgba(10,17,25,.18)}
.vr-cookie-btn-essential:hover{border-color:rgba(10,17,25,.35)}
.vr-cookie-btn-custom{background:transparent;color:#0a1119;border:none;padding:9px 8px}
.vr-cookie-btn-custom:hover{color:#d9a01e}
.vr-cookie-modal{position:fixed;inset:0;background:rgba(10,17,25,.45);z-index:2147483646;display:none;align-items:center;justify-content:center;padding:20px;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.vr-cookie-modal.visible{display:flex}
.vr-cookie-modal-card{background:#fff;border-radius:16px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto;padding:28px}
.vr-cookie-modal-card h3{margin:0 0 6px;font-size:18px;font-weight:600;color:#0a1119}
.vr-cookie-modal-card p{margin:0 0 18px;font-size:13px;color:#4a5260;line-height:1.5}
.vr-cookie-option{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding:14px 0;border-top:1px solid rgba(10,17,25,.08)}
.vr-cookie-option:first-of-type{border-top:none}
.vr-cookie-option h4{margin:0 0 4px;font-size:14px;font-weight:600;color:#0a1119}
.vr-cookie-option small{display:block;font-size:12px;color:#4a5260;line-height:1.45}
.vr-cookie-toggle{position:relative;display:inline-block;width:38px;height:22px;flex-shrink:0;margin-top:2px}
.vr-cookie-toggle input{opacity:0;width:0;height:0}
.vr-cookie-toggle-track{position:absolute;inset:0;background:#d4d6db;border-radius:11px;transition:background .15s;cursor:pointer}
.vr-cookie-toggle-track::after{content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;background:#fff;border-radius:50%;transition:transform .15s}
.vr-cookie-toggle input:checked + .vr-cookie-toggle-track{background:#f0b73c}
.vr-cookie-toggle input:checked + .vr-cookie-toggle-track::after{transform:translateX(16px)}
.vr-cookie-toggle input:disabled + .vr-cookie-toggle-track{cursor:not-allowed;opacity:.65}
.vr-cookie-modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}
@media (max-width:520px){.vr-cookie-banner{padding:18px;bottom:16px}.vr-cookie-actions{flex-direction:column}.vr-cookie-btn{justify-content:center;width:100%}}
`;

  const HTML = `
<div class="vr-cookie-banner" id="vrCookieBanner" role="dialog" aria-label="Consentimento de cookies">
  <div class="vr-cookie-row">
    <div class="vr-cookie-icon" aria-hidden="true">🍪</div>
    <div class="vr-cookie-body">
      <p class="vr-cookie-title">Utilizamos cookies</p>
      <p class="vr-cookie-text">Este website utiliza cookies para melhorar a sua experiência de navegação, analisar o tráfego do site e personalizar conteúdo. De acordo com o Regulamento Geral sobre a Proteção de Dados (RGPD) e a Lei n.º 58/2019, necessitamos do seu consentimento para utilizar cookies não essenciais. Para mais informações, consulte a nossa <a href="/politica-de-privacidade">Política de Privacidade</a> e <a href="/politica-de-cookies">Política de Cookies</a>.</p>
      <div class="vr-cookie-actions">
        <button type="button" class="vr-cookie-btn vr-cookie-btn-accept" id="vrCookieAcceptAll">✓ Aceitar Todas</button>
        <button type="button" class="vr-cookie-btn vr-cookie-btn-essential" id="vrCookieEssential">Apenas Essenciais</button>
        <button type="button" class="vr-cookie-btn vr-cookie-btn-custom" id="vrCookieCustomize"><span aria-hidden="true">⚙</span> Personalizar</button>
      </div>
    </div>
  </div>
</div>
<div class="vr-cookie-modal" id="vrCookieModal" role="dialog" aria-modal="true" aria-label="Configurações de cookies">
  <div class="vr-cookie-modal-card">
    <h3>Configurações de cookies</h3>
    <p>Pode personalizar quais cookies aceita. Os cookies essenciais são necessários para o funcionamento do website e não podem ser desativados.</p>
    <div class="vr-cookie-option">
      <div>
        <h4>Cookies Essenciais</h4>
        <small>Necessários para o funcionamento técnico do site e processamento de formulários.</small>
      </div>
      <label class="vr-cookie-toggle">
        <input type="checkbox" checked disabled aria-label="Cookies essenciais (sempre ativos)">
        <span class="vr-cookie-toggle-track"></span>
      </label>
    </div>
    <div class="vr-cookie-option">
      <div>
        <h4>Métricas de Desempenho</h4>
        <small>Vercel Analytics — dados anónimos de navegação para monitorizar a estabilidade do site. Não criam perfis pessoais.</small>
      </div>
      <label class="vr-cookie-toggle">
        <input type="checkbox" id="vrCookieAnalytics" aria-label="Métricas de desempenho">
        <span class="vr-cookie-toggle-track"></span>
      </label>
    </div>
    <div class="vr-cookie-modal-actions">
      <button type="button" class="vr-cookie-btn vr-cookie-btn-essential" id="vrCookieModalCancel">Cancelar</button>
      <button type="button" class="vr-cookie-btn vr-cookie-btn-accept" id="vrCookieModalSave">Guardar preferências</button>
    </div>
  </div>
</div>
`;

  /* ---------- State helpers ---------- */
  function save(prefs) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ prefs: prefs, ts: Date.now() })
      );
    } catch (e) {
      /* localStorage indisponível (Safari privado): aceita-se a sessão actual */
    }
  }
  function read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  /* ---------- Injection ---------- */
  function inject() {
    /* Inject CSS */
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* Inject HTML — DOMParser em vez de innerHTML para evitar
       execução de qualquer <script> inline e para satisfazer
       a defesa em profundidade contra XSS (mesmo sendo o HTML
       hardcoded sem dados externos, é boa prática).               */
    const parsed = new DOMParser().parseFromString(HTML, 'text/html');
    Array.from(parsed.body.children).forEach(function (node) {
      document.body.appendChild(document.importNode(node, true));
    });

    /* Bind handlers */
    const banner = document.getElementById('vrCookieBanner');
    const modal = document.getElementById('vrCookieModal');
    const analyticsToggle = document.getElementById('vrCookieAnalytics');

    function hide() {
      banner.classList.remove('visible');
      modal.classList.remove('visible');
    }
    function show() {
      banner.classList.add('visible');
    }

    document.getElementById('vrCookieAcceptAll').addEventListener('click', function () {
      save({ essential: true, analytics: true });
      hide();
    });
    document.getElementById('vrCookieEssential').addEventListener('click', function () {
      save({ essential: true, analytics: false });
      hide();
    });
    document.getElementById('vrCookieCustomize').addEventListener('click', function () {
      const stored = read();
      if (stored && stored.prefs) {
        analyticsToggle.checked = !!stored.prefs.analytics;
      }
      modal.classList.add('visible');
    });
    document.getElementById('vrCookieModalCancel').addEventListener('click', function () {
      modal.classList.remove('visible');
    });
    document.getElementById('vrCookieModalSave').addEventListener('click', function () {
      save({ essential: true, analytics: !!analyticsToggle.checked });
      hide();
    });

    /* Mostrar só se ainda não há consentimento guardado */
    if (!read()) {
      setTimeout(show, 800);
    }

    /* Permite re-abrir o banner por outro código (ex: link "Configurações de cookies") */
    window.vrCookieReopen = function () {
      show();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
