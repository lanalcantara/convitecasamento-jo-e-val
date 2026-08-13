// ==========================================
// 1. ÁUDIO DO OASIS & ABERTURA DO CONVITE (BOHO CHIC)
// ==========================================
window.abrirConviteComAnimacao = function() {
  const cover = document.getElementById('cover');
  const audio = document.getElementById('bg-music');

  // 1. Esconde a capa do convite
  if (cover) {
    cover.classList.add('aberto');
    setTimeout(() => {
      cover.style.display = 'none';
    }, 600);
  }

  // 2. Libera a rolagem do site
  document.body.style.overflow = 'auto';

  // 3. Executa a música atrelada ao evento direto de clique
  if (audio) {
    audio.volume = 0.35; // Volume suave de fundo em 35%
    
    // Tenta reproduzir e trata o desbloqueio do navegador
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Música iniciada com sucesso!");
        })
        .catch(error => {
          console.log("O navegador bloqueou a reprodução automática:", error);
          // Fallback: tenta reproduzir novamente em qualquer clique subsequente na tela
          document.addEventListener('click', () => { audio.play(); }, { once: true });
        });
    }
  }
};

function abrirConviteComAnimacao() {
  window.abrirConviteComAnimacao();
}

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
  const wallContainer = document.getElementById('mural-recados') || document.getElementById('mural-lista');
  if (!wallContainer) return;

  if (typeof supabaseClient === 'undefined' || !supabaseClient) {
    console.warn("Supabase client não configurado em config.js.");
    return;
  }

  try {
    const { data: recados, error } = await supabaseClient
      .from('recados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!recados || recados.length === 0) {
      wallContainer.innerHTML = `
        <div style="border: 2px dashed #D9C3B0; padding: 1.2rem 1rem; border-radius: 0.8rem; text-align: center;">
          <p style="color: #78716C; font-style: italic; font-size: 0.85rem;">Seja o primeiro a deixar um recado carinhoso para os noivos!</p>
        </div>
      `;
      return;
    }

    wallContainer.innerHTML = recados.map(r => `
      <div style="background: #F7F4EF; border: 1px solid #D9C3B0; padding: 1rem; border-radius: 0.8rem; margin-bottom: 0.8rem; text-align: left;">
        <p style="font-weight: 700; color: #8C3F2B; font-size: 0.95rem; margin-bottom: 0.2rem;">
          <i class="fa-solid fa-heart" style="font-size: 0.75rem; margin-right: 4px;"></i> ${r.nome || 'Convidado'}
        </p>
        <p style="font-size: 0.9rem; color: #444; line-height: 1.4;">${r.mensagem || ''}</p>
        <span style="font-size: 0.7rem; color: #78716C; display: block; margin-top: 0.4rem;">
          ${r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : ''}
        </span>
      </div>
    `).join('');
  } catch (err) {
    console.error("Erro ao carregar recados:", err);
  }
}

// ==========================================
// 3. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Vincula evento de abertura do convite
  const btnAbrir = document.querySelector('.btn-abrir') || document.getElementById('btn-abrir') || document.querySelector('#cover button');
  if (btnAbrir) {
    btnAbrir.onclick = window.abrirConviteComAnimacao;
  }

  // Carrega recados do mural
  carregarRecados();

  // Copiar chave Pix
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', () => {
      const pixCode = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";
      navigator.clipboard.writeText(pixCode).then(() => {
        exibirToast("Chave Pix copiada com sucesso!");
      }).catch(err => {
        console.error("Erro ao copiar Pix:", err);
        exibirToast("Chave Pix: 091.602.964-61");
      });
    });
  }

  // RSVP Form Submit
  const formRsvp = document.getElementById('form-rsvp');
  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = document.getElementById('btn-rsvp');
      if (btn) btn.disabled = true;

      const nome = document.getElementById('rsvp-nome').value.trim();
      const status = document.getElementById('rsvp-status').value;
      const temAcompanhante = document.getElementById('rsvp-tem-acompanhante').value;
      const qtdAcompanhantes = (temAcompanhante === 'Sim') ? document.getElementById('rsvp-qtd-acompanhantes').value : '0';

      // 1. Envia notificação por e-mail via FormSubmit AJAX API
      try {
        await fetch('https://formsubmit.co/ajax/patriciajosalva@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Confirmação de RSVP - ${nome}`,
            _template: 'table',
            _captcha: 'false',
            Nome: nome,
            Presenca: status,
            Acompanhante: temAcompanhante,
            Quantidade_Acompanhantes: qtdAcompanhantes
          })
        });
      } catch (errEmail) {
        console.warn("Erro ao enviar e-mail via FormSubmit:", errEmail);
      }

      // 2. Registra presença no Supabase
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
          await supabaseClient.from('presencas').insert([{
            nome: nome,
            confirmado: (status.includes('Sim')),
            acompanhantes: parseInt(qtdAcompanhantes, 10) || 0
          }]);
        } catch (errSupa) {
          console.warn("Erro ao salvar presença no Supabase:", errSupa);
        }
      }

      exibirToast("Presença confirmada com sucesso!");
      formRsvp.reset();
      toggleAcompanhantes('Não');
      if (btn) btn.disabled = false;
    });
  }

  // Submit Mural de Recados Form
  const formMsg = document.getElementById('messageForm');
  if (formMsg) {
    formMsg.addEventListener('submit', async (e) => {
      e.preventDefault();

      const autorInput = document.getElementById('msgAuthor');
      const msgInput = document.getElementById('msgContent');
      const nome = autorInput ? autorInput.value.trim() : '';
      const mensagem = msgInput ? msgInput.value.trim() : '';

      if (!nome || !mensagem) return;

      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
          const { error } = await supabaseClient.from('recados').insert([{
            nome: nome,
            mensagem: mensagem
          }]);
          if (error) throw error;

          exibirToast("Mensagem publicada no mural!");
          formMsg.reset();
          carregarRecados();
        } catch (err) {
          console.error("Erro ao publicar recado:", err);
          exibirToast("Erro ao publicar recado. Tente novamente.");
        }
      } else {
        exibirToast("Mensagem recebida com carinho!");
        formMsg.reset();
      }
    });
  }
});

function exibirToast(mensagem) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = mensagem;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 4000);
  } else {
    alert(mensagem);
  }
}
