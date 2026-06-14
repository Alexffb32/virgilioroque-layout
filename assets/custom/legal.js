/* ============================================================
   Páginas legais — Virgilio Roque
   Substitui o conteúdo placeholder do template Framer pelas
   versões reais de Política de Privacidade, Termos e Condições
   e Política de Cookies enviadas pelo cliente (1 jun 2026).

   Estratégia: deteta a URL → escolhe a config → substitui o
   bloco principal (Text Wrapper) na página por HTML estruturado.
   Polling 4Hz por 8s para apanhar a hidratação assíncrona do
   Framer (mesmo padrão do obras.js).
   ============================================================ */
(function () {
  'use strict';

  const COMPANY = {
    name: 'Virgilio Roque - Sociedade de Construção Civil, Lda',
    nif: '503 022 578',
    address:
      'Parque Industrial do Tortosendo, Lote 75, Rua E, 6200-823 Tortosendo',
    email: 'virgilioroque.lda@gmail.com',
    phone: '275 971 394',
    phoneNote: 'Chamada para a rede fixa nacional',
    website: 'www.virgilioroque.com',
  };

  const LAST_UPDATED = '1 de junho de 2026';

  /* Tipos de bloco aceites:
     - { type: 'p', text: '...' }
     - { type: 'h2', text: '...' }
     - { type: 'list', items: ['...', '...'] }
     - { type: 'list-titled', items: [{ heading: '...', body: '...' }] } */
  const PAGES = {
    'politica-de-privacidade': {
      title: 'Política de Privacidade',
      slug: 'politica-de-privacidade',
      meta: [
        { label: 'Última atualização', value: LAST_UPDATED },
        { label: 'Website', value: COMPANY.website },
        { label: 'Entidade Responsável', value: `${COMPANY.name} (NIF: ${COMPANY.nif})` },
        { label: 'Morada', value: COMPANY.address },
        {
          label: 'Contacto',
          value: `${COMPANY.email} | Tel.: ${COMPANY.phone} (${COMPANY.phoneNote})`,
        },
      ],
      sections: [
        {
          heading: '1. Entidade Responsável',
          blocks: [
            {
              type: 'p',
              text:
                'A Virgilio Roque - Sociedade de Construção Civil, Lda é a entidade responsável pela recolha e tratamento dos dados pessoais submetidos através deste website, garantindo o rigoroso cumprimento do Regulamento Geral sobre a Proteção de Dados (RGPD).',
            },
          ],
        },
        {
          heading: '2. Dados Recolhidos e Finalidades',
          blocks: [
            {
              type: 'p',
              text:
                'Este website funciona como um portefólio e canal de contacto direto, não dispondo de área de cliente ou gestão de faturação online. A recolha de dados ocorre exclusivamente nos seguintes contextos:',
            },
            {
              type: 'list-titled',
              items: [
                {
                  heading: 'Contacto Comercial e Orçamentação',
                  body:
                    'Recolhemos Nome, E-mail e Telefone para dar resposta a pedidos de orçamento, esclarecimento de dúvidas e agendamento de reuniões técnicas.',
                },
                {
                  heading: 'Recrutamento',
                  body:
                    'Recolhemos dados curriculares (CV) através do formulário de candidatura para processos de seleção. Os currículos submetidos são mantidos numa base de dados segura por um período máximo de 12 meses. Findo este prazo, os documentos e os dados associados são eliminados definitivamente.',
                },
                {
                  heading: 'Dados Técnicos (Vercel Analytics)',
                  body:
                    'Recolhemos dados estatísticos anónimos de navegação para monitorizar o desempenho técnico do site, sem identificar perfis pessoais.',
                },
              ],
            },
          ],
        },
        {
          heading: '3. Alojamento e Partilha de Dados',
          blocks: [
            {
              type: 'p',
              text:
                'O nosso website encontra-se alojado na infraestrutura da Vercel. Os dados introduzidos nos formulários são encaminhados de forma segura para o nosso e-mail corporativo e tratados exclusivamente pela nossa equipa interna. A Virgilio Roque garante que não partilha, não vende e não cede os seus dados a terceiros para fins comerciais ou de marketing.',
            },
          ],
        },
        {
          heading: '4. Segurança',
          blocks: [
            {
              type: 'p',
              text:
                'Implementamos medidas técnicas para proteger os dados recolhidos. No entanto, o utilizador deve estar ciente de que a transmissão de informações pela Internet não é 100% infalível. A nossa responsabilidade foca-se na proteção interna dos dados após a sua receção, não nos responsabilizando por interceções externas motivadas por vulnerabilidades no dispositivo ou rede do utilizador.',
            },
          ],
        },
        {
          heading: '5. Direitos do Titular',
          blocks: [
            {
              type: 'p',
              text:
                'O utilizador tem o direito de solicitar o Acesso, Retificação, Limitação ou o Apagamento (direito a ser esquecido) dos seus dados pessoais. Para exercer qualquer um destes direitos, deverá enviar um e-mail para virgilioroque.lda@gmail.com. Comprometemo-nos a analisar e responder ao seu pedido no prazo máximo de 30 dias.',
            },
          ],
        },
      ],
    },

    'termos-e-condicoes': {
      title: 'Termos e Condições de Utilização',
      slug: 'termos-e-condicoes',
      meta: [
        { label: 'Última atualização', value: LAST_UPDATED },
        { label: 'Website', value: COMPANY.website },
        { label: 'Entidade Responsável', value: COMPANY.name },
      ],
      sections: [
        {
          heading: '1. Objeto e Aceitação',
          blocks: [
            {
              type: 'p',
              text:
                'O presente documento estabelece as regras que regulam o acesso e a utilização do website oficial da Virgilio Roque, Lda. Ao navegar nesta página, o utilizador aceita integralmente os presentes Termos e Condições e a Política de Privacidade. Caso não concorde, deverá cessar imediatamente a sua utilização.',
            },
          ],
        },
        {
          heading: '2. Finalidade do Website',
          blocks: [
            {
              type: 'p',
              text:
                'O website tem como objetivos apresentar o portefólio da empresa, facilitar o contacto e gerir candidaturas espontâneas:',
            },
            {
              type: 'list-titled',
              items: [
                {
                  heading: 'Caráter Informativo',
                  body:
                    'As imagens e descrições das obras servem para demonstrar a capacidade técnica, experiência e qualidade de execução da empresa.',
                },
                {
                  heading: 'Orçamentação',
                  body:
                    'O preenchimento do formulário de contacto não constitui qualquer vínculo contratual. A formalização de orçamentos e adjudicação de obras requer sempre uma avaliação técnica presencial e documentação própria.',
                },
                {
                  heading: 'Recrutamento',
                  body:
                    'Ao submeter o seu currículo, o utilizador aceita que o seu perfil seja analisado pela nossa equipa para vagas atuais ou futuras, de acordo com os prazos legais de conservação.',
                },
              ],
            },
          ],
        },
        {
          heading: '3. Propriedade Intelectual',
          blocks: [
            {
              type: 'p',
              text:
                'Todo o conteúdo presente no website (textos, logótipos, design e código) é propriedade exclusiva da Virgilio Roque - Sociedade de Construção Civil, Lda.',
            },
            {
              type: 'list-titled',
              items: [
                {
                  heading: 'Proteção de Imagem',
                  body:
                    'As fotografias de obras, projetos e estaleiros representam o nosso know-how.',
                },
                {
                  heading: 'Proibição',
                  body:
                    'É estritamente proibida a cópia, reprodução, alteração ou distribuição destes conteúdos (especialmente por entidades concorrentes ou para fins comerciais) sem autorização prévia por escrito.',
                },
              ],
            },
          ],
        },
        {
          heading: '4. Responsabilidade do Utilizador',
          blocks: [
            {
              type: 'p',
              text:
                'O utilizador compromete-se a fornecer informações verdadeiras nos formulários e a não utilizar o website para fins ilícitos, envio de spam ou introdução de vírus que possam comprometer a segurança da infraestrutura.',
            },
          ],
        },
        {
          heading: '5. Alojamento, Disponibilidade e Erros',
          blocks: [
            {
              type: 'list-titled',
              items: [
                {
                  heading: 'Infraestrutura',
                  body:
                    'O website é desenvolvido em código próprio e mantido através dos serviços de alojamento da Vercel. Não nos responsabilizamos por eventuais interrupções temporárias de serviço devido a manutenções ou falhas nos servidores de alojamento.',
                },
                {
                  heading: 'Limitações de Visualização',
                  body:
                    'Dependendo do dispositivo ou navegador utilizado pelo utilizador, podem ocorrer imprecisões gráficas. A Virgilio Roque reserva-se o direito de suspender o acesso ao site para correções ou atualizações de portefólio sem aviso prévio.',
                },
              ],
            },
          ],
        },
        {
          heading: '6. Livro de Reclamações Eletrónico',
          blocks: [
            {
              type: 'p',
              text:
                'Em cumprimento do disposto no Decreto-Lei n.º 74/2017, informamos que a empresa dispõe de Livro de Reclamações Eletrónico. Caso o deseje, poderá exercer o seu direito de reclamação através da plataforma oficial: www.livroreclamacoes.pt.',
            },
          ],
        },
        {
          heading: '7. Alterações e Foro Competente',
          blocks: [
            {
              type: 'p',
              text:
                'A Virgilio Roque reserva-se o direito de alterar estes Termos a qualquer momento. Os presentes Termos regem-se pela legislação portuguesa. Para a resolução de qualquer litígio emergente da utilização deste website, é convencionado como competente o foro da Comarca de Castelo Branco / Covilhã, com expressa renúncia a qualquer outro.',
            },
          ],
        },
      ],
    },

    'politica-de-cookies': {
      title: 'Política de Cookies',
      slug: 'politica-de-cookies',
      meta: [
        { label: 'Última atualização', value: LAST_UPDATED },
        { label: 'Website', value: COMPANY.website },
        { label: 'Entidade Responsável', value: COMPANY.name },
      ],
      sections: [
        {
          heading: '1. O que são Cookies?',
          blocks: [
            {
              type: 'p',
              text:
                'Os "cookies" são pequenos ficheiros de texto armazenados no seu computador ou dispositivo móvel através do navegador de internet (browser). Estes ficheiros servem para garantir o correto funcionamento técnico, a segurança da página e a recolha de métricas de desempenho.',
            },
          ],
        },
        {
          heading: '2. Que Cookies utilizamos?',
          blocks: [
            {
              type: 'p',
              text:
                'O website da Virgilio Roque foi desenvolvido com uma abordagem rigorosa de respeito pela privacidade, recorrendo a tecnologias modernas e dispensando cookies intrusivos. Utilizamos apenas:',
            },
            {
              type: 'list-titled',
              items: [
                {
                  heading: 'A. Cookies Estritamente Necessários (Técnicos)',
                  body:
                    'São indispensáveis para que o website funcione de forma segura e responsiva (por exemplo, para o processamento de formulários). Por serem essenciais, a legislação não exige o consentimento prévio para a sua utilização.',
                },
                {
                  heading: 'B. Métricas de Desempenho (Vercel Analytics)',
                  body:
                    'Utilizamos o Vercel Analytics para monitorizar a estabilidade do site (contabilizar visitas, velocidade de carregamento e páginas com erros). Esta tecnologia funciona com uma política Privacy-First: os dados recolhidos são anónimos, não armazenam o endereço IP completo do utilizador, não criam perfis de comportamento e não cruzam informação com plataformas externas.',
                },
              ],
            },
          ],
        },
        {
          heading: '3. O que NÃO utilizamos',
          blocks: [
            {
              type: 'p',
              text:
                'Para garantir uma navegação limpa e livre de rastreadores, declaramos formalmente que este website:',
            },
            {
              type: 'list',
              items: [
                'NÃO utiliza cookies de publicidade direcionada, marketing ou retargeting.',
                'NÃO utiliza pixéis de rastreio de redes sociais (como o Facebook Pixel).',
                'NÃO partilha métricas de navegação com empresas terceiras para fins comerciais.',
              ],
            },
          ],
        },
        {
          heading: '4. Gestão e Desativação de Cookies',
          blocks: [
            {
              type: 'p',
              text:
                'Ao navegar no nosso website, o utilizador aceita a utilização dos cookies técnicos descritos acima. Caso pretenda bloquear todos os cookies, poderá fazê-lo a qualquer momento através das definições de privacidade do seu próprio navegador (Google Chrome, Safari, Microsoft Edge, Mozilla Firefox, etc.). Alertamos que o bloqueio de cookies essenciais poderá impedir o envio correto dos formulários de contacto ou recrutamento.',
            },
          ],
        },
        {
          heading: '5. Contacto',
          blocks: [
            {
              type: 'p',
              text:
                'Para qualquer esclarecimento adicional sobre as nossas práticas de privacidade ou gestão técnica, contacte-nos através do e-mail: virgilioroque.lda@gmail.com.',
            },
          ],
        },
      ],
    },
  };

  /* Descobre o slug a partir do URL: /{slug}/ ou /{slug} */
  function getSlug() {
    const path = location.pathname.replace(/\/+$/, '');
    const last = path.split('/').filter(Boolean).pop();
    return last ? decodeURIComponent(last) : null;
  }

  /* Constrói o DOM do conteúdo legal. Usa textContent para
     escape automático de HTML — não interpreta tags em strings. */
  function buildLegalSection(page) {
    const root = document.createElement('section');
    root.className = 'vr-legal';
    root.setAttribute('aria-label', page.title);

    /* Título da página */
    const h1 = document.createElement('h1');
    h1.className = 'vr-legal__title';
    h1.textContent = page.title;
    root.appendChild(h1);

    /* Metadados (última atualização, website, entidade, etc.) */
    if (Array.isArray(page.meta) && page.meta.length > 0) {
      const meta = document.createElement('div');
      meta.className = 'vr-legal__meta';
      page.meta.forEach(function (m) {
        const row = document.createElement('p');
        row.className = 'vr-legal__meta-row';
        const label = document.createElement('strong');
        label.textContent = m.label + ': ';
        row.appendChild(label);
        row.appendChild(document.createTextNode(m.value));
        meta.appendChild(row);
      });
      root.appendChild(meta);
    }

    /* Secções numeradas */
    (page.sections || []).forEach(function (sec) {
      const block = document.createElement('div');
      block.className = 'vr-legal__section';

      if (sec.heading) {
        const h2 = document.createElement('h2');
        h2.className = 'vr-legal__heading';
        h2.textContent = sec.heading;
        block.appendChild(h2);
      }

      (sec.blocks || []).forEach(function (b) {
        if (b.type === 'p') {
          const p = document.createElement('p');
          p.className = 'vr-legal__paragraph';
          p.textContent = b.text;
          block.appendChild(p);
        } else if (b.type === 'list') {
          const ul = document.createElement('ul');
          ul.className = 'vr-legal__list';
          (b.items || []).forEach(function (item) {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
          });
          block.appendChild(ul);
        } else if (b.type === 'list-titled') {
          const ul = document.createElement('ul');
          ul.className = 'vr-legal__list-titled';
          (b.items || []).forEach(function (item) {
            const li = document.createElement('li');
            const strong = document.createElement('strong');
            strong.textContent = item.heading + ': ';
            li.appendChild(strong);
            li.appendChild(document.createTextNode(item.body));
            ul.appendChild(li);
          });
          block.appendChild(ul);
        }
      });

      root.appendChild(block);
    });

    return root;
  }

  /* Esconde o hero placeholder (Desktop/Tablet/Phone) — mostra
     texto "Termos e Condições" mesmo nas páginas de Privacidade
     e Cookies. CSS :has() selectors são frágeis (hierarquia
     varia); JavaScript é robusto.                                */
  function hidePlaceholderHero() {
    /* Apanhar todos os 3 breakpoints. Tipicamente só um está
       visível mas escondemos todos para garantir.                */
    ['Desktop', 'Tablet', 'Phone'].forEach(function (name) {
      const el = document.querySelector('[data-framer-name="' + name + '"]');
      if (el && el.querySelector('h1') && el.style.display !== 'none') {
        el.style.display = 'none';
      }
    });
  }

  /* Estratégia: o template do Framer tem o hero ("Desktop") dentro
     de um page container flex com height fixo. Injectar o nosso
     conteúdo lá dentro causa o conteúdo a transbordar (invisível
     ou sobreposto com o footer).

     Em vez disso, INSERIMOS o .vr-legal como sibling do Footer
     Section, dentro do mesmo flex container.                     */
  function injectLegalContent(page) {
    /* Idempotente: se já está como sibling do Footer Section, OK. */
    const existing = document.querySelector('.vr-legal');
    if (existing) {
      const footerSiblingCheck = existing.nextElementSibling;
      if (
        footerSiblingCheck &&
        footerSiblingCheck.getAttribute('data-framer-name') === 'Footer Section'
      ) {
        return false; /* já está no sítio correcto */
      }
      /* Estava num sítio errado (ex: ainda no Text Wrapper). Tira. */
      existing.remove();
    }

    /* Encontrar o Footer Section para inserir o .vr-legal antes dele. */
    const footer = document.querySelector('[data-framer-name="Footer Section"]');
    if (!footer) return false;
    const flexParent = footer.parentElement;
    if (!flexParent) return false;

    const section = buildLegalSection(page);
    flexParent.insertBefore(section, footer);
    return true;
  }

  function updateBrowserTitle(page) {
    document.title = `${page.title} — Virgilio Roque`;
  }

  function init() {
    const slug = getSlug();
    if (!slug || !PAGES[slug]) return;
    const page = PAGES[slug];
    updateBrowserTitle(page);

    /* Tenta injectar imediatamente, depois faz polling 4Hz × 8s
       sempre até ao fim — para resistir a re-renders do React do
       Framer que podem apagar o nosso conteúdo logo depois da
       hidratação. Polling tem custo desprezável (1 query × 32). */
    injectLegalContent(page);
    hidePlaceholderHero();
    let ticks = 0;
    const MAX_TICKS = 32;
    const intervalId = setInterval(function () {
      ticks++;
      injectLegalContent(page);
      hidePlaceholderHero();
      /* Reaplica o título caso o React o tenha mudado */
      if (document.title !== `${page.title} — Virgilio Roque`) {
        updateBrowserTitle(page);
      }
      if (ticks >= MAX_TICKS) {
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
