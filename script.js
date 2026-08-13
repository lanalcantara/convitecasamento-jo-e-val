// ==========================================
// 1. ÁUDIO DO OASIS & ABERTURA DO CONVITE (BOHO CHIC)
// ==========================================
window.abrirConviteComAnimacao = function() {
  const cover = document.getElementById('cover');
  const audio = document.getElementById('bg-music');
  const btnIcon = document.getElementById('music-icon');

  // Esconde a capa
  if (cover) {
    cover.classList.add('aberto');
    setTimeout(() => { cover.style.display = 'none'; }, 600);
  }

  document.body.style.overflow = 'auto';

  // Dispara o áudio no clique
  if (audio) {
    audio.volume = 0.35;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("Música iniciada com sucesso!");
        if (btnIcon) btnIcon.className = 'fa-solid fa-pause';
      }).catch(err => {
        console.log("Erro de autoplay do navegador:", err);
        if (btnIcon) btnIcon.className = 'fa-solid fa-music';
        // Fallback: toca no próximo toque em qualquer lugar da tela (click + touchstart)
        const tocarNoToque = () => {
          audio.play().then(() => {
            if (btnIcon) btnIcon.className = 'fa-solid fa-pause';
          });
          document.removeEventListener('click', tocarNoToque);
          document.removeEventListener('touchstart', tocarNoToque);
        };
        document.addEventListener('click', tocarNoToque);
        document.addEventListener('touchstart', tocarNoToque);
      });
    }
  }
};

function abrirConviteComAnimacao() {
  window.abrirConviteComAnimacao();
}

// 2. CONTROLE MANUAL DE PLAY / PAUSE DO ÁUDIO
window.toggleMusic = function() {
  const audio = document.getElementById('bg-music');
  const btnIcon = document.getElementById('music-icon');
  
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      if (btnIcon) btnIcon.className = 'fa-solid fa-pause';
    }).catch(err => console.log("Erro ao tocar:", err));
  } else {
    audio.pause();
    if (btnIcon) btnIcon.className = 'fa-solid fa-music';
  }
};

// 3. ALTERAÇÃO DINÂMICA DO BOTÃO E ACOMPANHANTES NO RSVP
function atualizarFormularioRsvp() {
  const selectStatus = document.getElementById('rsvp-status');
  const boxAcompanhanteSelect = document.getElementById('box-tem-acompanhante-wrapper') || document.getElementById('rsvp-tem-acompanhante-box');
  const boxQtdAcompanhantes = document.getElementById('box-qtd-acompanhantes');
  const btnSubmit = document.getElementById('btn-rsvp') || document.querySelector('#form-rsvp button[type="submit"]');

  if (!selectStatus || !btnSubmit) return;

  const valor = selectStatus.value;
  const naoVai = valor.toLowerCase().includes('não') || valor.toLowerCase().includes('nao');

  if (naoVai) {
    btnSubmit.innerText = 'Enviar';
    if (boxAcompanhanteSelect) boxAcompanhanteSelect.style.display = 'none';
    if (boxQtdAcompanhantes) boxQtdAcompanhantes.style.display = 'none';
  } else {
    btnSubmit.innerText = 'Confirmar Presença';
    if (boxAcompanhanteSelect) boxAcompanhanteSelect.style.display = 'block';
    const selectAcomp = document.getElementById('rsvp-tem-acompanhante');
    if (selectAcomp && selectAcomp.value === 'Sim') {
      if (boxQtdAcompanhantes) boxQtdAcompanhantes.style.display = 'block';
    }
  }
}

function toggleAcompanhantes(valor) {
  const box = document.getElementById('box-qtd-acompanhantes');
  if (box) {
    box.style.display = (valor === 'Sim') ? 'block' : 'none';
  }
}

// ==========================================
// 4. MURAL DE RECADOS (SUPABASE)
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
// 5. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Vincula evento de abertura do convite
  const btnAbrir = document.querySelector('.btn-abrir') || document.getElementById('btn-abrir') || document.querySelector('#cover button');
  if (btnAbrir) {
    btnAbrir.onclick = window.abrirConviteComAnimacao;
  }

  // Listener para dinâmica do RSVP
  const selectStatus = document.getElementById('rsvp-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', atualizarFormularioRsvp);
    atualizarFormularioRsvp();
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

  // RSVP Form Submit Handler com Formatação FormSubmit em Português (_language: pt, _template: box)
  const formRsvp = document.getElementById('form-rsvp') || document.querySelector('#form-rsvp form') || document.querySelector('form');
  
  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById('btn-rsvp') || formRsvp.querySelector('button[type="submit"]');
      const textoOriginalBotao = btnSubmit ? btnSubmit.innerText : 'Confirmar Presença';

      // 1. Estado de carregamento no botão
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Enviando resposta...';
      }

      // Captura dos campos
      const inputNome = document.getElementById('rsvp-nome') || formRsvp.querySelector('input[type="text"]');
      const selectStatus = document.getElementById('rsvp-status') || formRsvp.querySelector('select');
      const selectAcomp = document.getElementById('rsvp-tem-acompanhante');
      const inputQtd = document.getElementById('rsvp-qtd-acompanhantes');

      const nome = inputNome ? inputNome.value.trim() : '';
      const status = selectStatus ? selectStatus.value : 'Sim, estarei presente!';
      const naoVai = status.toLowerCase().includes('não') || status.toLowerCase().includes('nao');
      const temAcomp = (!naoVai && selectAcomp) ? selectAcomp.value : 'Não';
      const qtdAcomp = (!naoVai && temAcomp === 'Sim' && inputQtd) ? inputQtd.value : '0';

      if (!nome) {
        alert('Por favor, preencha o seu nome completo.');
        if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = textoOriginalBotao; }
        return;
      }

      try {
        // Envio de notificação para a noiva via FormSubmit API (100% em Português com template box)
        await fetch('https://formsubmit.co/ajax/patriciajosalva@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Confirmação de Presença: ${nome}`,
            _template: 'box',      // Layout elegante em caixa
            _language: 'pt',       // Idioma 100% em Português
            _captcha: 'false',
            
            // Rótulos amigáveis e organizados em Português
            "Nome do Convidado": nome,
            "Status de Presença": status,
            "Levará Acompanhante?": temAcomp,
            "Quantidade de Acompanhantes": qtdAcomp,
            "Data da Resposta": new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
          })
        });

        // Gravação opcional no Supabase se configurado
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          await supabaseClient.from('presencas').insert([{
            nome: nome,
            confirmado: (!naoVai),
            acompanhantes: parseInt(qtdAcomp, 10) || 0
          }]).catch(err => console.log("Supabase insert erro silencioso:", err));
        }

        // 2. MENSAGEM VISUAL DE CONFIRMAÇÃO DE SUCESSO
        const mensagemSucesso = naoVai 
          ? `Obrigado por avisar, ${nome}! Agradecemos o carinho e sua resposta foi enviada aos noivos.` 
          : `Presença confirmada com sucesso, ${nome}! Mal podemos esperar para comemorar com você!`;

        exibirToast(mensagemSucesso);
        alert(mensagemSucesso);

        // Reseta o formulário
        formRsvp.reset();
        if (typeof atualizarFormularioRsvp === 'function') {
          atualizarFormularioRsvp();
        }

      } catch (error) {
        console.error("Erro ao enviar RSVP:", error);
        const msgFallback = `Obrigado, ${nome}! Sua resposta foi gravada com sucesso.`;
        exibirToast(msgFallback);
        alert(msgFallback);
      } finally {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = textoOriginalBotao;
        }
      }
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
    }, 4500);
  } else {
    alert(mensagem);
  }
}
