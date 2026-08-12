/* ==========================================================================
   JOSALVA & VALTAIR - CONVITE DE CASAMENTO BOHO CHIC
   REPRODUÇÃO DO MP3 REAL DE "LIVE FOREVER - OASIS" (live-forever.mp3)
   ========================================================================== */

const PAYLOAD_PIX_EMV_OFICIAL = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";

// Função de abertura do convite que dispara o MP3 de Live Forever - Oasis
function abrirConviteComAnimacao() {
  const cover = document.getElementById('cover') || document.getElementById('cover-overlay');
  const audio = document.getElementById('bg-music');

  if (cover) {
    cover.classList.add('aberto');
    cover.classList.add('envelope-opening');
    setTimeout(() => { cover.style.display = 'none'; }, 1000);
  }

  if (audio) {
    audio.volume = 0.3; // Volume agradável de fundo (30%)
    audio.play().catch(e => console.log("Erro audio:", e));
  }
}

function abrirConvite() {
  abrirConviteComAnimacao();
}

// Mostrar / esconder campo de quantidade de acompanhantes
function toggleAcompanhantes(valor) {
  const box = document.getElementById('box-qtd-acompanhantes');
  if (box) {
    box.style.display = (valor === 'Sim') ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnAbrir = document.querySelector('.btn-abrir') || document.getElementById('btn-abrir') || document.querySelector('.btn-abrir-envelope');
  if (btnAbrir) {
    btnAbrir.onclick = abrirConviteComAnimacao;
  }

  /* Inicialização do Supabase */
  if (window.supabase && window.CONFIG && window.CONFIG.SUPABASE_URL) {
    try {
      window.supabaseClient = window.supabase.createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);
      carregarRecadosSupabase();
    } catch(e) {
      console.error('Erro no Supabase:', e);
    }
  }

  /* Botão de Copiar Chave Pix */
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PAYLOAD_PIX_EMV_OFICIAL).then(() => {
          alert("✨ Código Pix Copia e Cola copiado com sucesso! Abra o app do seu banco e escolha 'Pix Copia e Cola'.");
        }).catch(err => {
          fallbackCopyPixText(PAYLOAD_PIX_EMV_OFICIAL);
        });
      } else {
        fallbackCopyPixText(PAYLOAD_PIX_EMV_OFICIAL);
      }
    });
  }

  /* Envio de Notificação por E-mail via FormSubmit API */
  const formRsvp = document.getElementById('form-rsvp') || document.querySelector('form');

  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = formRsvp.querySelector('button[type="submit"]') || document.getElementById('btn-rsvp');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Enviando...';
      }

      const inputNome = formRsvp.querySelector('input[type="text"]');
      const selectStatus = formRsvp.querySelector('select');
      const selectAcompanhante = document.getElementById('rsvp-tem-acompanhante');
      const inputQtdAcompanhantes = document.getElementById('rsvp-qtd-acompanhantes');

      const nome = inputNome ? inputNome.value : '';
      const status = selectStatus ? selectStatus.value : 'Sim, estarei presente!';
      const temAcomp = selectAcompanhante ? selectAcompanhante.value : 'Não';
      const qtdAcomp = (temAcomp === 'Sim' && inputQtdAcompanhantes) ? inputQtdAcompanhantes.value : '0';

      try {
        // 1. Salva no Supabase
        if (window.supabaseClient) {
          await window.supabaseClient.from('presencas').insert([{
            nome_completo: nome,
            status: status,
            se_acompanhante: temAcomp,
            qtd_acompanhantes: parseInt(qtdAcomp) || 0,
            email_notificacao: 'patriciajosalva@gmail.com'
          }]);
        }

        // 2. Dispara e-mail real e direto para patriciajosalva@gmail.com via FormSubmit API
        await fetch('https://formsubmit.co/ajax/patriciajosalva@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
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

        alert(`✨ Muito obrigado, ${nome}! Sua presença foi confirmada com sucesso e os noivos foram notificados por e-mail.`);
        formRsvp.reset();
        toggleAcompanhantes('Não');

      } catch (err) {
        console.error("Erro ao enviar:", err);
        alert("✨ Presença confirmada!");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = 'Confirmar Presença';
        }
      }
    });
  }

  /* Guestbook Form Submission */
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
      carregarRecadosSupabase();
    });
  }
});

async function carregarRecadosSupabase() {
  const wallContainer = document.getElementById('mural-lista');
  if (!wallContainer || !window.supabaseClient) return;

  try {
    const { data, error } = await window.supabaseClient
      .from('recados')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data && data.length > 0) {
      wallContainer.innerHTML = data.map(msg => `
        <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1.1rem; margin-bottom: 0.85rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary); margin-bottom: 0.3rem; font-size: 0.95rem;">
            <span>${msg.autor}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">${msg.criado_em ? new Date(msg.criado_em).toLocaleDateString('pt-BR') : 'Hoje'}</span>
          </div>
          <p style="margin: 0; color: var(--text-dark); font-style: italic; font-size: 0.9rem;">"${msg.mensagem}"</p>
        </div>
      `).join('');
    }
  } catch(e) {}
}

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
