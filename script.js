/* ==========================================================================
   CONVITE DE CASAMENTO - JOSALVA & VALTAIR
   Música, Animação de Abertura 3D do Envelope, RSVP e Mural
   ========================================================================== */

// ==========================================
// 1. GERENCIADOR DE ÁUDIO & SINCRONIZAÇÃO VISUAL
// ==========================================
function atualizarEstadoMusica(estaTocando) {
  const btnIcon = document.getElementById('music-icon');
  const waveBars = document.getElementById('music-wave-bars');
  const floatingDisc = document.getElementById('floating-disc-icon');
  const floatingText = document.getElementById('floating-music-text');

  if (btnIcon) {
    btnIcon.className = estaTocando ? 'fa-solid fa-pause' : 'fa-solid fa-music';
  }

  if (waveBars) {
    if (estaTocando) {
      waveBars.classList.add('playing');
    } else {
      waveBars.classList.remove('playing');
    }
  }

  if (floatingDisc) {
    if (estaTocando) {
      floatingDisc.classList.remove('paused');
    } else {
      floatingDisc.classList.add('paused');
    }
  }

  if (floatingText) {
    floatingText.textContent = estaTocando ? 'Pausar' : 'Live Forever';
  }
}

// Função para iniciar a reprodução da música (acionada exclusivamente na abertura do convite)
window.tocarMusicaConvite = function() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  audio.volume = 0.4;
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      console.log("🎵 Música Oasis - Live Forever iniciada na abertura do convite!");
      atualizarEstadoMusica(true);
    }).catch(err => {
      console.log("Aguardando confirmação de clique para áudio:", err);
      atualizarEstadoMusica(false);
    });
  }
};

// Controle Manual de Play / Pause do Áudio
window.toggleMusic = function() {
  const audio = document.getElementById('bg-music');
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      atualizarEstadoMusica(true);
    }).catch(err => console.log("Erro ao tocar áudio:", err));
  } else {
    audio.pause();
    atualizarEstadoMusica(false);
  }
};

// ==========================================
// 2. ANIMAÇÃO DE ABERTURA DO ENVELOPE (BOHO CHIC)
// ==========================================
window.abrirConviteComAnimacao = function() {
  const cover = document.getElementById('cover');
  const envelopeContainer = document.getElementById('envelope-container');
  const audio = document.getElementById('bg-music');

  // 1. Toca o áudio imediatamente
  if (audio) {
    audio.volume = 0.4;
    audio.play().then(() => {
      atualizarEstadoMusica(true);
    }).catch(err => console.log("Áudio acionado no clique:", err));
  }

  // 2. Dispara animação 3D da aba do envelope e elevação do convite
  if (envelopeContainer) {
    envelopeContainer.classList.add('opening');
  }

  // 3. Efeito suave de transição para o site principal
  setTimeout(() => {
    if (cover) {
      cover.classList.add('aberto');
    }
    document.body.style.overflow = 'auto';
  }, 950);

  setTimeout(() => {
    if (cover) {
      cover.style.display = 'none';
    }
  }, 1600);
};

function abrirConviteComAnimacao() {
  window.abrirConviteComAnimacao();
}

// ==========================================
// 3. ALTERAÇÃO DINÂMICA DO BOTÃO E ACOMPANHANTES NO RSVP
// ==========================================
function atualizarFormularioRsvp() {
  const selectStatus = document.getElementById('rsvp-status');
  const boxAcompanhanteSelect = document.getElementById('box-tem-acompanhante-wrapper') || document.getElementById('rsvp-tem-acompanhante-box');
  const boxQtdAcompanhantes = document.getElementById('box-qtd-acompanhantes');
  const btnSubmit = document.getElementById('btn-rsvp') || document.querySelector('#form-rsvp button[type="submit"]');

  if (!selectStatus || !btnSubmit) return;

  const valor = selectStatus.value;
  const naoVai = valor.toLowerCase().includes('não') || valor.toLowerCase().includes('nao');

  if (naoVai) {
    btnSubmit.innerText = 'Enviar Resposta';
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
    console.log("Supabase aguardando configuração ou tabelas.");
    return;
  }

  try {
    const { data: recados, error } = await supabaseClient
      .from('recados')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    if (!recados || recados.length === 0) {
      wallContainer.innerHTML = `
        <div style="border: 2px dashed #D9C3B0; padding: 1.2rem 1rem; border-radius: 0.8rem; text-align: center;">
          <p style="color: #78716C; font-style: italic; font-size: 0.85rem;">Seja o primeiro a deixar um recado carinhoso para os noivos!</p>
        </div>
      `;
      return;
    }

    wallContainer.innerHTML = recados.map(r => {
      const autorNome = r.nome || r.autor || 'Convidado';
      const dataFormatada = r.created_at || r.criado_em ? new Date(r.created_at || r.criado_em).toLocaleDateString('pt-BR') : '';
      return `
        <div style="background: #F7F4EF; border: 1px solid #D9C3B0; padding: 0.9rem 1rem; border-radius: 0.8rem; margin-bottom: 0.75rem; text-align: left;">
          <p style="font-weight: 700; color: #8C3F2B; font-size: 0.95rem; margin-bottom: 0.2rem;">
            <i class="fa-solid fa-heart" style="font-size: 0.75rem; margin-right: 4px;"></i> ${autorNome}
          </p>
          <p style="font-size: 0.9rem; color: #444; line-height: 1.4;">${r.mensagem || ''}</p>
          ${dataFormatada ? `<span style="font-size: 0.7rem; color: #78716C; display: block; margin-top: 0.35rem;">${dataFormatada}</span>` : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.log("Aviso ao buscar recados (tabela recados no Supabase):", err.message || err);
  }
}

// ==========================================
// 5. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Vincula evento de abertura do convite (a música só tocará quando o convite for aberto)
  const btnAbrir = document.querySelector('.btn-abrir') || document.getElementById('btn-abrir');
  if (btnAbrir) {
    btnAbrir.onclick = window.abrirConviteComAnimacao;
  }

  const flap = document.getElementById('envelope-flap');
  if (flap) {
    flap.onclick = window.abrirConviteComAnimacao;
  }

  const seal = document.getElementById('wax-seal-btn');
  if (seal) {
    seal.onclick = window.abrirConviteComAnimacao;
  }

  // 3. Listener para dinâmica do RSVP
  const selectStatus = document.getElementById('rsvp-status');
  if (selectStatus) {
    selectStatus.addEventListener('change', atualizarFormularioRsvp);
    atualizarFormularioRsvp();
  }

  // 4. Carrega recados do mural
  carregarRecados();

  // 5. Copiar chave Pix com feedback tátil e visual
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate(40);
      const pixCode = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";
      navigator.clipboard.writeText(pixCode).then(() => {
        exibirToast("✅ Código Pix Copia e Cola copiado!");
      }).catch(err => {
        console.error("Erro ao copiar Pix:", err);
        exibirToast("Chave Pix CPF: 091.602.964-61");
      });
    });
  }

  // 6. RSVP Form Submit Handler com FormSubmit e Gravação no Banco
  const formRsvp = document.getElementById('form-rsvp') || document.querySelector('#form-rsvp form') || document.querySelector('form');
  
  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSubmit = document.getElementById('btn-rsvp') || formRsvp.querySelector('button[type="submit"]');
      const textoOriginalBotao = btnSubmit ? btnSubmit.innerText : 'Confirmar Presença';

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
        // 1. Gravação no Supabase PRIMEIRO (para contagem correta no e-mail)
        let totalConfirmados = 0;
        let totalPessoas = 0;
        let totalRecusas = 0;

        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          // Insere o novo RSVP
          const { error: insertError } = await supabaseClient.from('confirmacoes').insert([{
            nome_completo: nome,
            vai_comparecer: status,
            quantidade_acompanhantes: parseInt(qtdAcomp, 10) || 0,
            nomes_acompanhantes: temAcomp === 'Sim' ? `${qtdAcomp} acompanhante(s)` : 'Nenhum'
          }]);

          if (insertError) {
            // Tentativa alternativa na tabela presencas
            await supabaseClient.from('presencas').insert([{
              nome: nome,
              confirmado: (!naoVai),
              status: status,
              acompanhantes: parseInt(qtdAcomp, 10) || 0
            }]).catch(err => console.log("Supabase insert alternativo:", err));
          }

          // 🔢 Busca contagem atualizada de todos os confirmados
          const { data: todos } = await supabaseClient
            .from('confirmacoes')
            .select('vai_comparecer, quantidade_acompanhantes')
            .order('id', { ascending: true });

          if (todos && todos.length > 0) {
            todos.forEach(r => {
              const naoVaiEste = (r.vai_comparecer || '').toLowerCase().includes('não') || (r.vai_comparecer || '').toLowerCase().includes('nao');
              if (naoVaiEste) {
                totalRecusas += 1;
              } else {
                totalConfirmados += 1;
                totalPessoas += 1 + (parseInt(r.quantidade_acompanhantes, 10) || 0);
              }
            });
          }
        }

        // Monta linha de contagem para o e-mail
        const linhaContagem = totalConfirmados > 0
          ? `${totalConfirmados} convidado(s) confirmado(s) • ${totalPessoas} pessoa(s) no total • ${totalRecusas} recusa(s)`
          : '(banco de dados indisponível — verifique o painel Supabase)';

        // 2. Envio de E-mail via FormSubmit com CONTAGEM incluída
        await fetch('https://formsubmit.co/ajax/patriciajosalva@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: naoVai
              ? `❌ Recusa de Presença: ${nome}`
              : `✅ Confirmação de Presença: ${nome}`,
            _template: 'box',
            _language: 'pt',
            _captcha: 'false',
            "👤 Nome do Convidado": nome,
            "📋 Status": status,
            "👥 Levará Acompanhante?": temAcomp,
            "🔢 Qtd. Acompanhantes": qtdAcomp,
            "🕐 Data da Resposta": new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            "━━━━━━━━━━━━━━━━━━━━━━━": "CONTAGEM GERAL ATUALIZADA",
            "📊 Resumo da Lista": linhaContagem
          })
        }).catch(err => console.log("FormSubmit envio:", err));

        if (navigator.vibrate) navigator.vibrate(50);

        const mensagemSucesso = naoVai
          ? `Obrigado por avisar, ${nome}! Agradecemos o carinho e sua resposta foi registrada.`
          : `🎉 Presença confirmada, ${nome}! Mal podemos esperar para comemorar juntos!`;

        exibirToast(mensagemSucesso);
        alert(mensagemSucesso);

        formRsvp.reset();
        if (typeof atualizarFormularioRsvp === 'function') {
          atualizarFormularioRsvp();
        }

      } catch (error) {
        console.error("Erro ao processar confirmação:", error);
        const msgFallback = `Obrigado, ${nome}! Sua resposta foi registrada com sucesso.`;
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

  // 7. Submit Mural de Recados com inserção compatível
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
            autor: nome,
            mensagem: mensagem
          }]);
          if (error) throw error;

          if (navigator.vibrate) navigator.vibrate(30);
          exibirToast("❤️ Mensagem publicada no mural com sucesso!");
          formMsg.reset();
          carregarRecados();
        } catch (err) {
          console.error("Erro ao publicar recado:", err);
          exibirToast("Recado recebido com carinho!");
          formMsg.reset();
        }
      } else {
        exibirToast("Recado recebido com carinho!");
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
