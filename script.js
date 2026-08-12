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
  initCotasModal();
  initGuestbook();
  initNavigation();
  initCalendarAdd();
});

let supabaseClient = null;

/* --------------------------------------------------------------------------
   1. TELA DE ENTRADA EXCLUSIVA (HERO COVER 100VH) & ÁUDIO NO CLIQUE
   -------------------------------------------------------------------------- */
function initEnvelopeOpening() {
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const btnOpenInvite = document.getElementById('btnOpenInvite');
  const waxSeal = document.getElementById('waxSeal');
  const bgAudio = document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicText = document.getElementById('musicText');

  // Configurar volume inicial suave de 20%
  if (bgAudio) {
    bgAudio.volume = 0.2;
  }

  function openEnvelope() {
    if (!envelopeOverlay) return;

    envelopeOverlay.classList.add('opened');
    document.body.classList.remove('envelope-active');

    // Iniciar áudio com volume suave de 20% no exato instante do clique
    if (bgAudio) {
      bgAudio.volume = 0.2;
      bgAudio.play().then(() => {
        if (musicBtn) musicBtn.classList.add('playing');
        if (musicIcon) musicIcon.className = 'fa-solid fa-pause';
        if (musicText) musicText.innerText = 'Pausar';
        showToast('Tocando "Songbird" - Oasis 🎶');
      }).catch(err => {
        console.log('Autoplay bloqueado pelo navegador:', err);
      });
    }
  }

  if (btnOpenInvite) btnOpenInvite.addEventListener('click', openEnvelope);
  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
}

/* --------------------------------------------------------------------------
   2. CONEXÃO COM O SUPABASE ( ssfgxswkdbrjvqcpxcfp )
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

  if (window.emailjs && cfg.EMAILJS_PUBLIC_KEY && !cfg.EMAILJS_PUBLIC_KEY.includes('your_public_key')) {
    try {
      window.emailjs.init(cfg.EMAILJS_PUBLIC_KEY);
    } catch (e) {
      console.warn('Configuração do EmailJS pendente:', e);
    }
  }
}

/* --------------------------------------------------------------------------
   3. CONTADOR REGRESSIVO EM TEMPO REAL (18/10/2026 13:00)
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
   4. CONTROLE DE ÁUDIO DE FUNDO (VOLUME INICIAL 0.2)
   -------------------------------------------------------------------------- */
function initAudioPlayer() {
  const bgAudio = document.getElementById('bgAudio');
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
      if (musicText) musicText.innerText = 'Songbird 🎵';
      isPlaying = false;
      showToast('Música de fundo pausada 🎵');
    } else {
      bgAudio.volume = 0.2;
      bgAudio.play().then(() => {
        musicBtn.classList.add('playing');
        if (musicIcon) musicIcon.className = 'fa-solid fa-pause';
        if (musicText) musicText.innerText = 'Pausar';
        isPlaying = true;
        showToast('Tocando "Songbird" - Oasis 🎶');
      }).catch(() => {
        musicBtn.classList.add('playing');
        if (musicText) musicText.innerText = 'Pausar';
        isPlaying = true;
      });
    }
  });
}

/* --------------------------------------------------------------------------
   5. CHAVE PIX & QR CODE
   -------------------------------------------------------------------------- */
function initQRCodeAndPixKey() {
  const cfg = window.CONFIG || {};
  const pixKeyText = document.getElementById('pixKeyText');
  const modalPixKeyText = document.getElementById('modalPixKeyText');
  const pixKeyLabel = document.getElementById('pixKeyLabel');

  const chavePix = cfg.CHAVE_PIX || 'SUA-CHAVE-PIX-AQUI';
  const chavePixLabel = cfg.CHAVE_PIX_LABEL || 'Chave Pix em breve / Exemplo';

  if (pixKeyText) pixKeyText.innerText = chavePix;
  if (modalPixKeyText) modalPixKeyText.innerText = chavePix;
  if (pixKeyLabel) pixKeyLabel.innerText = chavePixLabel + ':';

  const qrContainers = [document.getElementById('qrcodeCanvas'), document.getElementById('modalQrcodeCanvas')];
  
  qrContainers.forEach(container => {
    if (!container) return;
    container.innerHTML = `
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
  });

  const btnCopyPixMain = document.getElementById('btnCopyPixMain');
  if (btnCopyPixMain) {
    btnCopyPixMain.addEventListener('click', () => copyToClipboard(chavePix));
  }
}

/* --------------------------------------------------------------------------
   6. CONFIRMAÇÃO DE PRESENÇA EM TEMPO REAL NO SUPABASE
   -------------------------------------------------------------------------- */
function initRSVP() {
  const rsvpForm = document.getElementById('rsvpForm');
  const attYes = document.getElementById('attYes');
  const attNo = document.getElementById('attNo');
  const companionsContainer = document.getElementById('companionsContainer');
  const companionsCount = document.getElementById('companionsCount');
  const companionNamesWrapper = document.getElementById('companionNamesWrapper');
  const btnSubmitRsvp = document.getElementById('btnSubmitRsvp');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const formStatusBox = document.getElementById('formStatusBox');
  const btnViewRSVPList = document.getElementById('btnViewRSVPList');
  const rsvpListModal = document.getElementById('rsvpListModal');
  const btnCloseRsvpListModal = document.getElementById('btnCloseRsvpListModal');

  if (attYes && attNo && companionsContainer) {
    attYes.addEventListener('change', () => companionsContainer.classList.add('active'));
    attNo.addEventListener('change', () => companionsContainer.classList.remove('active'));
  }

  if (companionsCount && companionNamesWrapper) {
    companionsCount.addEventListener('change', () => {
      const count = parseInt(companionsCount.value);
      companionNamesWrapper.innerHTML = '';
      
      for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'form-group';
        div.style.marginTop = '10px';
        div.innerHTML = `
          <label class="form-label">Nome do Acompanhante ${i}</label>
          <input type="text" class="form-control companion-input" placeholder="Ex: Nome Completo do Acompanhante ${i}">
        `;
        companionNamesWrapper.appendChild(div);
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName').value.trim();
      const phone = document.getElementById('guestPhone').value.trim();
      const attendanceVal = document.querySelector('input[name="attendance"]:checked').value;
      const vaiComparecer = attendanceVal === 'sim' ? 'Sim' : 'Não';
      const count = parseInt(document.getElementById('companionsCount').value || '0');
      const rsvpMessage = document.getElementById('rsvpMessage').value.trim();

      const companionInputs = document.querySelectorAll('.companion-input');
      const companions = Array.from(companionInputs).map(input => input.value.trim()).filter(val => val !== '');
      const nomesAcompanhantesStr = companions.join(', ');

      if (btnSubmitRsvp) btnSubmitRsvp.disabled = true;
      if (btnSubmitText) btnSubmitText.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Enviando sua confirmação...`;
      if (formStatusBox) formStatusBox.style.display = 'none';

      const payload = {
        nome_completo: name,
        vai_comparecer: vaiComparecer,
        quantidade_acompanhantes: count,
        nomes_acompanhantes: nomesAcompanhantesStr,
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
          } else {
            console.log('Gravado no Supabase com sucesso:', data);
          }
        }

        const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        savedRSVPs.push({ ...payload, phone, date: new Date().toLocaleString('pt-BR') });
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));
        
        success = true;
      } catch (err) {
        const savedRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        savedRSVPs.push({ ...payload, phone, date: new Date().toLocaleString('pt-BR') });
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedRSVPs));
        success = true;
      }

      if (btnSubmitRsvp) btnSubmitRsvp.disabled = false;
      if (btnSubmitText) btnSubmitText.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Enviar Confirmação`;

      if (success) {
        if (formStatusBox) {
          formStatusBox.style.display = 'block';
          formStatusBox.style.background = 'var(--primary-light)';
          formStatusBox.style.color = 'var(--primary)';
          formStatusBox.style.border = '1px solid var(--primary)';
          formStatusBox.innerHTML = `
            <i class="fa-solid fa-circle-check" style="font-size:1.8rem; margin-bottom:8px; display:block;"></i>
            ✨ <strong>Muito obrigado, ${name}!</strong><br>
            Sua confirmação de presença na nossa comemoração foi registrada com sucesso! Esperamos por você! ❤️
          `;
        }
        showToast(`Confirmação enviada com sucesso, ${name}! ✨`);
        rsvpForm.reset();
        if (companionNamesWrapper) companionNamesWrapper.innerHTML = '';
      }
    });
  }

  if (btnViewRSVPList && rsvpListModal) {
    btnViewRSVPList.addEventListener('click', async () => {
      await renderRSVPList();
      rsvpListModal.classList.add('active');
    });

    if (btnCloseRsvpListModal) {
      btnCloseRsvpListModal.addEventListener('click', () => {
        rsvpListModal.classList.remove('active');
      });
    }
  }
}

async function renderRSVPList() {
  const content = document.getElementById('rsvpListContent');
  if (!content) return;

  let rsvps = [];

  // Buscar confirmações reais no Supabase
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('confirmacoes')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data && data.length > 0) {
        rsvps = data;
      } else {
        rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
      }
    } catch (e) {
      rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
    }
  } else {
    rsvps = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
  }

  if (!rsvps || rsvps.length === 0) {
    content.innerHTML = `
      <div class="empty-state-box">
        <i class="fa-regular fa-folder-open"></i>
        <p>Nenhuma confirmação registrada até o momento.</p>
      </div>
    `;
    return;
  }

  content.innerHTML = rsvps.map(item => `
    <div style="background: var(--bg-main); padding: 14px 18px; border-radius: var(--radius-sm); border-left: 4px solid ${item.vai_comparecer === 'Sim' ? '#8C3F2B' : '#6E5D57'}">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="color: var(--text-dark); font-size: 1rem;">${item.nome_completo}</strong>
        <span style="font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 12px; background: ${item.vai_comparecer === 'Sim' ? 'var(--primary-light)' : '#EAEAEA'}; color: ${item.vai_comparecer === 'Sim' ? 'var(--primary)' : '#6E5D57'}">
          Comparece: ${item.vai_comparecer}
        </span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
        <i class="fa-solid fa-user-group"></i> ${item.quantidade_acompanhantes > 0 ? `${item.quantidade_acompanhantes} acompanhante(s): ${item.nomes_acompanhantes}` : 'Apenas o convidado'}
      </p>
      ${item.mensagem_noivos ? `<p style="font-size: 0.85rem; font-style: italic; color: var(--text-dark); margin-top: 6px; background: #FFF; padding: 8px; border-radius: 6px;">"${item.mensagem_noivos}"</p>` : ''}
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   7. COTAS DE PRESENTES PIX (MODAL)
   -------------------------------------------------------------------------- */
function initCotasModal() {
  const cotaModal = document.getElementById('cotaModal');
  const btnCloseCotaModal = document.getElementById('btnCloseCotaModal');
  const modalCotaTitle = document.getElementById('modalCotaTitle');
  const modalCotaPrice = document.getElementById('modalCotaPrice');
  const modalCotaIcon = document.getElementById('modalCotaIcon');
  const modalSuggestedPrice = document.getElementById('modalSuggestedPrice');
  const btnCopyModalPix = document.getElementById('btnCopyModalPix');

  const cotaBtns = document.querySelectorAll('.btn-cota');

  cotaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cota-card');
      const title = btn.getAttribute('data-title') || 'Cota de Presente';
      const price = btn.getAttribute('data-price') || 'Livre';
      const icon = card ? card.querySelector('.cota-icon').innerText : '🎁';

      if (modalCotaTitle) modalCotaTitle.innerText = title;
      if (modalCotaIcon) modalCotaIcon.innerText = icon;
      
      if (price === 'Livre') {
        if (modalCotaPrice) modalCotaPrice.innerText = 'Valor Livre';
        if (modalSuggestedPrice) modalSuggestedPrice.innerText = 'qualquer valor desejado';
      } else {
        const formattedPrice = `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
        if (modalCotaPrice) modalCotaPrice.innerText = formattedPrice;
        if (modalSuggestedPrice) modalSuggestedPrice.innerText = formattedPrice;
      }

      if (cotaModal) cotaModal.classList.add('active');
    });
  });

  if (btnCloseCotaModal && cotaModal) {
    btnCloseCotaModal.addEventListener('click', () => cotaModal.classList.remove('active'));
    cotaModal.addEventListener('click', (e) => {
      if (e.target === cotaModal) cotaModal.classList.remove('active');
    });
  }

  if (btnCopyModalPix) {
    btnCopyModalPix.addEventListener('click', () => {
      const cfg = window.CONFIG || {};
      copyToClipboard(cfg.CHAVE_PIX || 'SUA-CHAVE-PIX-AQUI');
    });
  }
}

/* --------------------------------------------------------------------------
   8. MURAL DE RECADOS EM TEMPO REAL NO SUPABASE (SEM DADOS FAKE)
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

      // Salvar no Supabase
      if (supabaseClient) {
        try {
          await supabaseClient.from('recados').insert([newMessage]);
        } catch (err) {
          console.warn('Erro ao inserir recado no Supabase:', err);
        }
      }

      // Salvar cópia local
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
  const messagesWall = document.getElementById('messagesWall');
  if (!messagesWall) return;

  let messages = [];

  // Buscar recados reais no Supabase
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

  // SEM DADOS MOCADOS: Exibe estado vazio amigável caso não existam mensagens
  if (!messages || messages.length === 0) {
    messagesWall.innerHTML = `
      <div class="empty-state-box">
        <i class="fa-regular fa-comment-dots"></i>
        <p>Seja o primeiro a enviar uma mensagem aos noivos! ❤️</p>
      </div>
    `;
    return;
  }

  messagesWall.innerHTML = messages.map(msg => `
    <div class="message-card" id="msg-${msg.id}">
      <div class="message-header">
        <span class="message-author">${msg.autor || msg.author}</span>
        <span class="message-date">${msg.criado_em ? new Date(msg.criado_em).toLocaleDateString('pt-BR') : (msg.date || 'Hoje')}</span>
      </div>
      <p class="message-text">"${msg.mensagem || msg.text}"</p>
      <div class="message-actions">
        <button class="like-btn" onclick="likeMessage(${msg.id})">
          <i class="fa-solid fa-heart"></i> <span id="like-count-${msg.id}">${msg.curtidas || msg.likes || 1}</span>
        </button>
      </div>
    </div>
  `).join('');
}

window.likeMessage = async function(id) {
  let countEl = document.getElementById(`like-count-${id}`);
  let currentLikes = countEl ? parseInt(countEl.innerText || '1') : 1;
  let newLikes = currentLikes + 1;

  if (countEl) countEl.innerText = newLikes;

  if (supabaseClient) {
    try {
      await supabaseClient
        .from('recados')
        .update({ curtidas: newLikes })
        .eq('id', id);
    } catch(e) {
      console.warn('Erro ao atualizar curtidas no Supabase:', e);
    }
  }

  let savedMessages = JSON.parse(localStorage.getItem('wedding_messages') || '[]');
  const msgIndex = savedMessages.findIndex(m => m.id === id);
  if (msgIndex !== -1) {
    savedMessages[msgIndex].curtidas = newLikes;
    localStorage.setItem('wedding_messages', JSON.stringify(savedMessages));
  }

  showToast('Você enviou amor para este recado! ❤️');
};

/* --------------------------------------------------------------------------
   9. UTILS & SISTEMA DE TOAST & NAVEGAÇÃO
   -------------------------------------------------------------------------- */
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Chave Pix copiada com sucesso! Cole no seu app bancário. 📋✨');
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
    showToast('Chave Pix copiada com sucesso! 📋✨');
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
  toast.innerHTML = `
    <i class="fa-solid fa-sparkles text-gold" style="font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('active');
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section, header');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initCalendarAdd() {
  const btnCalendar = document.getElementById('btnCalendar');
  if (!btnCalendar) return;

  btnCalendar.addEventListener('click', () => {
    const title = encodeURIComponent("Recepção de Comemoração - Josalva & Valtair");
    const details = encodeURIComponent("Recepção de comemoração com amigos e familiares de Josalva & Valtair. Esperamos por você!");
    const location = encodeURIComponent("https://maps.app.goo.gl/yRGEsEoDAZ6Uun5n8");
    const startDate = "20261018T160000Z";
    const endDate = "20261018T220000Z";

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    
    window.open(googleUrl, '_blank');
    showToast('Redirecionando para o Google Agenda... 📅');
  });
}
