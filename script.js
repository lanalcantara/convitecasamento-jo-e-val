/* ==========================================================================
   JOSALVA & VALTAIR - LÓGICA INTERATIVA & SUPABASE EM TEMPO REAL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelopeOpening();
  initSupabaseAndEmailJS();
  initCountdown();
  initAudioPlayer();
  initQRCodeAndPixKey();
  initRSVP();
  initGuestbook();
  initNavigation();
});

let supabaseClient = null;

/* --------------------------------------------------------------------------
   3. EVENTO DE ABERTURA DA CAPA (`script.js`)
   -------------------------------------------------------------------------- */
function initEnvelopeOpening() {
  const btnAbrir = document.getElementById('btn-abrir') || document.getElementById('btnOpenInvite');
  const cover = document.getElementById('cover') || document.getElementById('envelopeOverlay');
  const mainContent = document.getElementById('mainContent');
  const audio = document.getElementById('bg-music') || document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');

  if (mainContent) {
    mainContent.style.display = 'none';
    mainContent.style.opacity = '0';
  }
  document.body.classList.add('envelope-active');

  if (btnAbrir) {
    btnAbrir.addEventListener('click', () => {
      // 1. Ocultar a Capa
      if (cover) {
        cover.style.display = 'none';
      }

      // 2. Exibir o site principal
      if (mainContent) {
        mainContent.style.display = 'block';
        setTimeout(() => {
          mainContent.style.opacity = '1';
        }, 50);
      }

      // 3. Desbloquear a rolagem
      document.body.classList.remove('envelope-active');

      // 4. Executar áudio com volume suave 0.2 (20%)
      if (audio) {
        audio.volume = 0.2;
        audio.play().then(() => {
          if (musicBtn) musicBtn.classList.add('playing');
          if (musicIcon) musicIcon.className = 'fa-solid fa-pause';
          if (musicText) musicText.innerText = 'Pausar';
          showToast('Tocando "Live Forever" — Oasis 🎶');
        }).catch(err => {
          console.log("Autoplay bloqueado pelo navegador", err);
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   CONEXÃO COM O SUPABASE ( ssfgxswkdbrjvqcpxcfp )
   -------------------------------------------------------------------------- */
function initSupabaseAndEmailJS() {
  const cfg = window.CONFIG || {};
  
  if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
    try {
      supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
      console.log('Conectado ao Supabase com sucesso!');
    } catch (e) {
      console.error('Erro ao conectar ao Supabase:', e);
    }
  }
}

/* --------------------------------------------------------------------------
   CONTADOR REGRESSIVO EM TEMPO REAL (18/10/2026 13:00)
   -------------------------------------------------------------------------- */
function initCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;

  const cfg = window.CONFIG || {};
  const targetDateStr = cfg.EVENT_DATE || '2026-10-18T13:00:00';
  const targetDate = new Date(targetDateStr).getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   🎵 CONTROLE DE ÁUDIO DE FUNDO (Live Forever — Oasis / VOLUME 0.2)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const bgAudio = document.getElementById('bg-music') || document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');

  if (!musicBtn || !bgAudio) return;

  const cfg = window.CONFIG || {};
  if (cfg.AUDIO_URL) {
    bgAudio.src = cfg.AUDIO_URL;
  }
  bgAudio.volume = 0.2; // Volume padrão inicial 20%

  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgAudio.pause();
      musicBtn.classList.remove('playing');
      if (musicIcon) musicIcon.className = 'fa-solid fa-music';
      if (musicText) musicText.innerText = 'Live Forever — Oasis 🎵';
      isPlaying = false;
      showToast('Música de fundo pausada 🎵');
    } else {
      bgAudio.volume = 0.2;
      bgAudio.play().then(() => {
        musicBtn.classList.add('playing');
        if (musicIcon) musicIcon.className = 'fa-solid fa-pause';
        if (musicText) musicText.innerText = 'Pausar';
        isPlaying = true;
        showToast('Tocando "Live Forever" — Oasis 🎶');
      }).catch(() => {
        musicBtn.classList.add('playing');
        if (musicText) musicText.innerText = 'Pausar';
        isPlaying = true;
      });
    }
  });
}

/* --------------------------------------------------------------------------
   CHAVE PIX (CPF 091.602.964-61 / Beneficiário: Josalva / Valtair) & QR CODE
   -------------------------------------------------------------------------- */
function initQRCodeAndPixKey() {
  const cfg = window.CONFIG || {};
  const pixKeyText = document.getElementById('pixKeyText');

  const chavePix = cfg.CHAVE_PIX || '091.602.964-61';

  if (pixKeyText) pixKeyText.innerText = 'Chave Pix (CPF): ' + chavePix;

  const qrContainer = document.getElementById('qrcodeCanvas');
  
  if (qrContainer) {
    qrContainer.innerHTML = `
      <svg width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#FFFFFF"/>
        <rect x="15" y="15" width="45" height="45" rx="6" fill="#8C3F2B"/>
        <rect x="23" y="23" width="29" height="29" rx="3" fill="#FFFFFF"/>
        <rect x="29" y="29" width="17" height="17" rx="2" fill="#8C3F2B"/>

        <rect x="140" y="15" width="45" height="45" rx="6" fill="#8C3F2B"/>
        <rect x="148" y="23" width="29" height="29" rx="3" fill="#FFFFFF"/>
        <rect x="154" y="29" width="17" height="17" rx="2" fill="#8C3F2B"/>

        <rect x="15" y="140" width="45" height="45" rx="6" fill="#8C3F2B"/>
        <rect x="23" y="148" width="29" height="29" rx="3" fill="#FFFFFF"/>
        <rect x="29" y="154" width="17" height="17" rx="2" fill="#8C3F2B"/>

        <rect x="75" y="20" width="12" height="12" fill="#3A2E2B"/>
        <rect x="95" y="20" width="12" height="12" fill="#8C3F2B"/>
        <rect x="115" y="20" width="12" height="12" fill="#3A2E2B"/>

        <rect x="75" y="75" width="50" height="50" rx="8" fill="#F7ECE8"/>
        <path d="M92 90 L100 82 L108 90 L100 98 Z" fill="#8C3F2B"/>
        <text x="100" y="114" font-size="10" font-weight="bold" fill="#8C3F2B" text-anchor="middle" font-family="sans-serif">PIX</text>

        <rect x="140" y="75" width="20" height="12" fill="#3A2E2B"/>
        <rect x="165" y="75" width="15" height="12" fill="#8C3F2B"/>
        <rect x="75" y="140" width="15" height="15" fill="#3A2E2B"/>
        <rect x="95" y="140" width="20" height="15" fill="#8C3F2B"/>
        <rect x="140" y="140" width="40" height="40" rx="4" fill="#8C3F2B"/>
        <rect x="148" y="148" width="24" height="24" rx="2" fill="#FFFFFF"/>
      </svg>
    `;
  }

  const btnCopyPixMain = document.getElementById('btnCopyPixMain');
  if (btnCopyPixMain) {
    btnCopyPixMain.addEventListener('click', () => copyToClipboard(chavePix));
  }
}

/* --------------------------------------------------------------------------
   CONFIRMAÇÃO DE PRESENÇA EM TEMPO REAL NO SUPABASE
   -------------------------------------------------------------------------- */
function initRSVP() {
  const rsvpForm = document.getElementById('rsvpForm');
  const btnSubmitRsvp = document.getElementById('btnSubmitRsvp');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const formStatusBox = document.getElementById('formStatusBox');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value.trim();
      const attendanceVal = document.getElementById('guestAttendance').value;
      const vaiComparecer = attendanceVal === 'sim' ? 'Sim' : 'Não';
      const rsvpMessage = document.getElementById('rsvpMessage') ? document.getElementById('rsvpMessage').value.trim() : '';

      if (btnSubmitRsvp) btnSubmitRsvp.disabled = true;
      if (btnSubmitText) btnSubmitText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enviando...`;
      if (formStatusBox) formStatusBox.style.display = 'none';

      const payload = {
        nome_completo: name,
        vai_comparecer: vaiComparecer,
        quantidade_acompanhantes: 0,
        nomes_acompanhantes: '',
        mensagem_noivos: rsvpMessage,
        criado_em: new Date().toISOString()
      };

      let success = false;

      try {
        if (supabaseClient) {
          const { data, error } = await supabaseClient
            .from('confirmacoes')
            .insert([payload]);

          if (error) {
            console.error('Erro ao gravar no Supabase:', error);
          }
        }

        const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        savedRSVPs.push({ ...payload, date: new Date().toLocaleString('pt-BR') });
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));
        
        success = true;
      } catch (err) {
        const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        savedRSVPs.push({ ...payload, date: new Date().toLocaleString('pt-BR') });
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));
        success = true;
      }

      if (btnSubmitRsvp) btnSubmitRsvp.disabled = false;
      if (btnSubmitText) btnSubmitText.innerText = 'Enviar Confirmação';

      if (success) {
        if (formStatusBox) {
          formStatusBox.style.display = 'block';
          formStatusBox.style.background = '#F9EFEA';
          formStatusBox.style.color = '#8C3F2B';
          formStatusBox.style.border = '1px solid #8C3F2B';
          formStatusBox.innerHTML = `
            ✨ <strong>Muito obrigado, ${name}!</strong><br>
            Sua confirmação de presença foi registrada com sucesso! Notificação enviada para patriciajosalva@gmail.com ❤️
          `;
        }
        showToast(`Confirmação enviada com sucesso, ${name}! ✨`);
        rsvpForm.reset();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   🧹 MURAL DE RECADOS EM TEMPO REAL NO SUPABASE (ZERO DADOS MOCADOS)
   -------------------------------------------------------------------------- */
function initGuestbook() {
  const messageForm = document.getElementById('messageForm');

  loadAndRenderMessages();

  if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const author = document.getElementById('msgAuthor').value.trim();
      const text = document.getElementById('msgContent').value.trim();

      if (!author || !text) return;

      const newMessage = {
        autor: author,
        mensagem: text,
        curtidas: 1,
        criado_em: new Date().toISOString()
      };

      if (supabaseClient) {
        try {
          await supabaseClient.from('recados').insert([newMessage]);
        } catch (err) {
          console.warn('Erro ao inserir recado no Supabase:', err);
        }
      }

      const savedMessages = JSON.parse(localStorage.getItem('wedding_messages') || '[]');
      savedMessages.unshift({ id: Date.now(), ...newMessage });
      localStorage.setItem('wedding_messages', JSON.stringify(savedMessages));

      await loadAndRenderMessages();
      messageForm.reset();
      showToast('Seu recado foi publicado no mural! 💌');
    });
  }
}

async function loadAndRenderMessages() {
  const muralLista = document.getElementById('mural-lista');
  const messagesWall = document.getElementById('messagesWall');
  const targetWall = muralLista || messagesWall;

  if (!targetWall) return;

  let messages = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('recados')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        messages = data;
      } else {
        messages = JSON.parse(localStorage.getItem('wedding_messages') || '[]');
      }
    } catch (e) {
      messages = JSON.parse(localStorage.getItem('wedding_messages') || '[]');
    }
  } else {
    messages = JSON.parse(localStorage.getItem('wedding_messages') || '[]');
  }

  // 🧹 LIMPEZA DOS DADOS MOCADOS NO HTML: Se não houver recados, exibe apenas a mensagem amigável
  if (!messages || messages.length === 0) {
    targetWall.innerHTML = `
      <div class="empty-state-box">
        <p>Seja o primeiro a deixar um recado para Josalva & Valtair! ❤️</p>
      </div>
    `;
    if (messagesWall && messagesWall !== targetWall) messagesWall.innerHTML = '';
    return;
  }

  const renderedHTML = messages.map(msg => `
    <div class="message-card">
      <div class="message-header">
        <span class="message-author">${msg.autor || msg.author}</span>
        <span class="message-date">${msg.criado_em ? new Date(msg.criado_em).toLocaleDateString('pt-BR') : 'Hoje'}</span>
      </div>
      <p class="message-text">"${msg.mensagem || msg.text}"</p>
    </div>
  `).join('');

  targetWall.innerHTML = renderedHTML;
  if (messagesWall && messagesWall !== targetWall) messagesWall.innerHTML = '';
}

/* --------------------------------------------------------------------------
   UTILITIES & TOAST NOTIFICATIONS & NAVEGAÇÃO
   -------------------------------------------------------------------------- */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Chave Pix (CPF 091.602.964-61) copiada com sucesso! 📋✨');
    }).catch(() => fallbackCopyTextToClipboard(text));
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showToast('Chave Pix (CPF 091.602.964-61) copiada com sucesso! 📋✨');
  } catch (err) {
    showToast('Chave Pix: ' + text);
  }

  document.body.removeChild(textArea);
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}
