// ==========================================
// 1. ÁUDIO DO OASIS & ABERTURA DO CONVITE
// ==========================================
function abrirConviteComAnimacao() {
  const cover = document.getElementById('cover') || document.getElementById('cover-overlay');
  const audio = document.getElementById('bg-music');

  if (cover) {
    cover.classList.add('aberto');
    cover.classList.add('envelope-opening');
    setTimeout(() => { cover.style.display = 'none'; }, 800);
  }

  if (audio) {
    audio.volume = 0.35;
    audio.play().catch(err => console.log("Erro ao reproduzir áudio:", err));
  }
}

// Garante disponibilidade global da função no window
window.abrirConviteComAnimacao = abrirConviteComAnimacao;
window.abrirConvite = abrirConviteComAnimacao;

function toggleAcompanhantes(valor) {
  const box = document.getElementById('box-qtd-acompanhantes');
  if (box) {
    box.style.display = (valor === 'Sim') ? 'block' : 'none';
  }
}

// ==========================================
// 2. MURAL DE RECADOS (SUPABASE)
// ==========================================
async function carregarRecados() {
  const wallContainer = document.getElementById('mural-recados') || document.getElementById('wall-container') || document.getElementById('mural-lista');
  if (!wallContainer || !window.supabaseClient) return;

  try {
    const { data, error } = await window.supabaseClient
      .from('recados')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data && data.length > 0) {
      wallContainer.innerHTML = data.map(msg => `
        <div style="background: var(--bg-main, #FFFDF9); border: 1px solid var(--border-color, #D9C3B0); border-radius: 1rem; padding: 1.1rem; margin-bottom: 0.85rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary, #8C3F2B); margin-bottom: 0.3rem; font-size: 0.95rem;">
            <span>${msg.autor || msg.nome || 'Convidado'}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted, #78716C); font-weight: 400;">${msg.criado_em ? new Date(msg.criado_em).toLocaleDateString('pt-BR') : 'Hoje'}</span>
          </div>
          <p style="margin: 0; color: var(--text-dark, #444); font-style: italic; font-size: 0.9rem;">"${msg.mensagem}"</p>
        </div>
      `).join('');
    }
  } catch(e) {
    console.error("Erro ao carregar recados:", e);
  }
}

// ==========================================
// 3. AUXILIARES (PIX & TOAST)
// ==========================================
function fallbackCopyPixText(text) {
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
  alert("✨ Código Pix Copia e Cola copiado com sucesso! Abra o app do seu banco e escolha 'Pix Copia e Cola'.");
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 4000);
}

// ==========================================
// 4. INICIALIZAÇÃO E FORMULÁRIOS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa Supabase se configurado
  if (window.supabase && window.CONFIG && window.CONFIG.SUPABASE_URL) {
    try {
      window.supabaseClient = window.supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
    } catch(e) {
      console.error('Erro no Supabase:', e);
    }
  }

  // Carrega recados do mural
  carregarRecados();

  // Botão "Abrir Convite"
  const btnAbrir = document.querySelector('.btn-abrir') || document.getElementById('btn-abrir') || document.querySelector('#cover button');
  if (btnAbrir) {
    btnAbrir.onclick = abrirConviteComAnimacao;
  }

  // Botão Copiar Pix
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', () => {
      const payloadPix = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payloadPix).then(() => {
          alert("✨ Código Pix Copia e Cola copiado com sucesso!");
        }).catch(() => fallbackCopyPixText(payloadPix));
      } else {
        fallbackCopyPixText(payloadPix);
      }
    });
  }

  // Formulário RSVP (Supabase + E-mail FormSubmit)
  const formRsvp = document.getElementById('form-rsvp') || document.querySelector('form');
  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = formRsvp.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerText = 'Enviando...'; }

      const inputNome = formRsvp.querySelector('input[type="text"]');
      const selectStatus = formRsvp.querySelector('select');
      const selectAcomp = document.getElementById('rsvp-tem-acompanhante');
      const inputQtd = document.getElementById('rsvp-qtd-acompanhantes');

      const nome = inputNome ? inputNome.value : '';
      const status = selectStatus ? selectStatus.value : 'Sim, estarei presente!';
      const temAcomp = selectAcomp ? selectAcomp.value : 'Não';
      const qtdAcomp = (temAcomp === 'Sim' && inputQtd) ? inputQtd.value : '0';

      try {
        // 1. Grava no Supabase
        if (window.supabaseClient) {
          await window.supabaseClient.from('presencas').insert([{
            nome_completo: nome,
            status: status,
            se_acompanhante: temAcomp,
            qtd_acompanhantes: parseInt(qtdAcomp) || 0,
            email_notificacao: 'patriciajosalva@gmail.com'
          }]);
        }

        // 2. Envia e-mail direto para patriciajosalva@gmail.com
        await fetch('https://formsubmit.co/ajax/patriciajosalva@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `💌 Confirmação de Presença: ${nome}`,
            _template: 'table',
            _captcha: 'false',
            Nome: nome,
            Presenca: status,
            Acompanhante: temAcomp,
            Quantidade_Acompanhantes: qtdAcomp
          })
        });

        alert(`✨ Muito obrigado, ${nome}! Sua presença foi confirmada e os noivos foram notificados por e-mail.`);
        formRsvp.reset();
      } catch (err) {
        console.error("Erro RSVP:", err);
        alert("✨ Sua presença foi confirmada!");
      } finally {
        if (btn) { btn.disabled = false; btn.innerText = 'Confirmar Presença'; }
      }
    });
  }

  // Formulário do Mural de Recados
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('msgAuthor').value.trim();
      const content = document.getElementById('msgContent').value.trim();

      if (!author || !content) return;

      if (window.supabaseClient) {
        try {
          await window.supabaseClient.from('recados').insert([{
            autor: author,
            mensagem: content,
            criado_em: new Date().toISOString()
          }]);
        } catch(e) {}
      }

      showToast("Seu recado foi publicado no mural!");
      messageForm.reset();
      carregarRecados();
    });
  }
});
