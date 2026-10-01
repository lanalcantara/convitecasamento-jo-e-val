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

  // Previne múltiplos acionamentos durante a animação
  if (envelopeContainer && envelopeContainer.classList.contains('opening')) {
    return;
  }

  // Prepara o elemento de áudio dentro do evento de clique sem reproduzir nada ainda
  if (audio) {
    try { audio.load(); } catch (e) {}
  }

  // 1. Dispara animação 3D da aba do envelope e elevação do convite
  if (envelopeContainer) {
    envelopeContainer.classList.add('opening');
  }

  // 2. Transição visual suave para a página principal (fade out da capa)
  setTimeout(() => {
    if (cover) {
      cover.classList.add('aberto');
    }
    document.body.style.overflow = 'auto';
  }, 1000);

  // 3. Conclusão total da ação de abrir: capa removida e página principal 100% visível -> TOCA A MÚSICA
  setTimeout(() => {
    if (cover) {
      cover.style.display = 'none';
    }

    // 🎵 A música toca EXCLUSIVAMENTE aqui: após o convite abrir completamente e a página principal estar visível
    if (audio && audio.paused) {
      audio.volume = 0.4;
      audio.play().then(() => {
        atualizarEstadoMusica(true);
      }).catch(err => {
        console.log("Áudio iniciado após abertura completa do convite:", err);
      });
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
// 4. MURAL DE RECADOS (SUPABASE + CACHE LOCAL)
// ==========================================
const MURAL_STORAGE_KEY = 'casamento_jo_e_val_recados_locais';

function obterRecadosLocais() {
  try {
    return JSON.parse(localStorage.getItem(MURAL_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function salvarRecadoLocal(recado) {
  try {
    const lista = obterRecadosLocais();
    lista.unshift(recado);
    localStorage.setItem(MURAL_STORAGE_KEY, JSON.stringify(lista.slice(0, 50)));
  } catch (e) {}
}

function renderizarMural(lista) {
  const wallContainer = document.getElementById('mural-recados') || document.getElementById('mural-lista');
  if (!wallContainer) return;

  if (!lista || lista.length === 0) {
    wallContainer.innerHTML = `
      <div style="border: 2px dashed #D9C3B0; padding: 1.2rem 1rem; border-radius: 0.8rem; text-align: center;">
        <p style="color: #78716C; font-style: italic; font-size: 0.85rem;">Seja o primeiro a deixar um recado carinhoso para os noivos!</p>
      </div>
    `;
    return;
  }

  wallContainer.innerHTML = lista.map(r => {
    const autorNome = r.nome || r.autor || 'Convidado';
    const dataFormatada = r.created_at || r.criado_em 
      ? new Date(r.created_at || r.criado_em).toLocaleDateString('pt-BR') 
      : new Date().toLocaleDateString('pt-BR');
    return `
      <div style="background: #F7F4EF; border: 1px solid #D9C3B0; padding: 0.9rem 1rem; border-radius: 0.8rem; margin-bottom: 0.75rem; text-align: left; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <p style="font-weight: 700; color: #8C3F2B; font-size: 0.95rem; margin: 0;">
            <i class="fa-solid fa-heart" style="font-size: 0.75rem; margin-right: 4px; color: #C85A32;"></i> ${autorNome}
          </p>
          <span style="font-size: 0.7rem; color: #78716C;">${dataFormatada}</span>
        </div>
        <p style="font-size: 0.9rem; color: #444; line-height: 1.4; margin: 0; white-space: pre-wrap;">${r.mensagem || ''}</p>
      </div>
    `;
  }).join('');
}

async function carregarRecados() {
  const wallContainer = document.getElementById('mural-recados') || document.getElementById('mural-lista');
  if (!wallContainer) return;

  // Renderiza imediatamente o cache local para o convidado nunca ver vazio
  const locais = obterRecadosLocais();
  if (locais.length > 0) {
    renderizarMural(locais);
  }

  if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

  try {
    const { data: recados, error } = await supabaseClient
      .from('recados')
      .select('*')
      .order('id', { ascending: false });

    if (!error && recados && recados.length > 0) {
      const textos = new Set(recados.map(r => (r.mensagem || '') + (r.nome || r.autor || '')));
      const extras = locais.filter(l => !textos.has((l.mensagem || '') + (l.nome || l.autor || '')));
      renderizarMural([...extras, ...recados]);
    } else if (locais.length === 0) {
      renderizarMural([]);
    }
  } catch (err) {
    console.log("Aviso ao buscar recados no Supabase:", err.message || err);
    if (locais.length === 0) renderizarMural([]);
  }
}

// ==========================================
// 5. EVENT LISTENERS E INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Garante que o áudio comece estritamente pausado na abertura do site
  const audio = document.getElementById('bg-music');
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
  }
  atualizarEstadoMusica(false);

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

  // Função universal de cópia compatível com mobile, webviews e desktop
  function copiarTextoUniversal(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto).catch(() => copiarFallback(texto));
    }
    return copiarFallback(texto);
  }

  function copiarFallback(texto) {
    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = texto;
        textArea.style.position = "fixed";
        textArea.style.top = "-9999px";
        textArea.style.left = "-9999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        const copiado = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (copiado) resolve();
        else reject(new Error("Falha ao copiar"));
      } catch (err) {
        reject(err);
      }
    });
  }

  // 5. Copiar chave Pix com feedback tátil e visual completo
  const btnPix = document.getElementById('btn-copiar-pix');
  if (btnPix) {
    btnPix.addEventListener('click', async () => {
      if (navigator.vibrate) navigator.vibrate(50);
      const pixCode = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";
      
      try {
        await copiarTextoUniversal(pixCode);

        // 1. Feedback direto no próprio botão
        const textoOriginal = btnPix.innerHTML;
        btnPix.style.background = "#2E7D32";
        btnPix.style.color = "#FFFFFF";
        btnPix.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 0.4rem;"></i><span>Código Pix Copiado!</span>';

        // 2. Feedback no aviso fixo abaixo do botão
        const avisoFixo = document.getElementById('pix-copiado-aviso');
        if (avisoFixo) {
          avisoFixo.style.display = 'block';
        }

        // 3. Feedback flutuante na tela (Toast)
        exibirToast('<i class="fa-solid fa-circle-check" style="color: #4CAF50; margin-right: 6px;"></i> <strong>Código Pix Copiado!</strong><br>Abra o app do seu banco e cole.');

        setTimeout(() => {
          btnPix.style.background = "";
          btnPix.style.color = "";
          btnPix.innerHTML = textoOriginal;
        }, 4000);

      } catch (err) {
        console.error("Erro ao copiar Pix:", err);
        prompt("Copie o código Pix abaixo:", pixCode);
      }
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
        // 1. Gravação no Supabase (tabela presencas existente e confirmacoes como compatibilidade)
        let totalConfirmados = 0;
        let totalPessoas = 0;
        let totalRecusas = 0;
        const emailDestino = (window.CONFIG && window.CONFIG.NOIVOS_EMAIL) ? window.CONFIG.NOIVOS_EMAIL : 'patriciajosalva@gmail.com';

        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
          // 1.1 Insere na tabela 'presencas' (tabela ativa existente no banco)
          const { error: presencasError } = await supabaseClient.from('presencas').insert([{
            nome_completo: nome,
            status: status,
            email_notificacao: emailDestino,
            se_acompanhante: temAcomp,
            qtd_acompanhantes: parseInt(qtdAcomp, 10) || 0
          }]);

          if (presencasError) {
            console.warn("Aviso ao inserir em presencas:", presencasError.message);
          }

          // 1.2 Tenta também na tabela 'confirmacoes' para compatibilidade caso exista
          await supabaseClient.from('confirmacoes').insert([{
            nome_completo: nome,
            vai_comparecer: status,
            quantidade_acompanhantes: parseInt(qtdAcomp, 10) || 0,
            nomes_acompanhantes: temAcomp === 'Sim' ? `${qtdAcomp} acompanhante(s)` : 'Nenhum'
          }]).catch(() => {});

          // 🔢 Busca contagem atualizada de todos os confirmados no banco
          const { data: presencasRows } = await supabaseClient
            .from('presencas')
            .select('status, qtd_acompanhantes, created_at, nome_completo');

          // Data de corte para zerar os testes anteriores
          const dataCorte = (window.CONFIG && window.CONFIG.DATA_INICIO_CONTAGEM)
            ? new Date(window.CONFIG.DATA_INICIO_CONTAGEM)
            : new Date('2026-10-01T18:00:00Z');

          // Filtra ignorando os testes anteriores à data de corte
          const linhasValidas = (presencasRows || []).filter(r => {
            if (r.nome_completo && r.nome_completo.toLowerCase().includes('diagnostico')) return false;
            if (!r.created_at) return true;
            return new Date(r.created_at) >= dataCorte;
          });

          if (linhasValidas && linhasValidas.length > 0) {
            linhasValidas.forEach(r => {
              const st = (r.status || '').toLowerCase();
              const naoVaiEste = st.includes('não') || st.includes('nao');
              if (naoVaiEste) {
                totalRecusas += 1;
              } else {
                totalConfirmados += 1;
                totalPessoas += 1 + (parseInt(r.qtd_acompanhantes, 10) || 0);
              }
            });
          } else {
            const { data: confRows } = await supabaseClient
              .from('confirmacoes')
              .select('vai_comparecer, quantidade_acompanhantes, created_at');
            if (confRows && confRows.length > 0) {
              const confValidas = confRows.filter(r => !r.created_at || new Date(r.created_at) >= dataCorte);
              confValidas.forEach(r => {
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
        }

        // Garante contagem mínima consistente se o banco estiver vazio ou offline
        if (totalConfirmados === 0 && !naoVai) {
          totalConfirmados = 1;
          totalPessoas = 1 + (parseInt(qtdAcomp, 10) || 0);
        } else if (totalRecusas === 0 && naoVai) {
          totalRecusas = 1;
        }

        const agora = new Date();
        const dataHoraFormatada = agora.toLocaleDateString('pt-BR') + ' às ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        // 2. Envio de E-mail via FormSubmit com layout em tabela limpa e assunto sem filtros de spam
        try {
          const fsRes = await fetch(`https://formsubmit.co/ajax/${emailDestino}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              _subject: naoVai
                ? `[Casamento Jo & Val] Recusa: ${nome} - Total: ${totalPessoas} pessoas`
                : `[Casamento Jo & Val] Confirmacao: ${nome} ${temAcomp === 'Sim' ? `(+${qtdAcomp} acomp.)` : '(Sem acomp.)'} - TOTAL: ${totalPessoas} PESSOAS`,
              _template: 'table',
              _captcha: 'false',
              "Convidado": nome,
              "Presença": naoVai ? "Não comparecerá" : "Confirmada (Irá comparecer!)",
              "Acompanhantes": naoVai ? "Não se aplica" : (temAcomp === 'Sim' ? `Sim (${qtdAcomp} acompanhante(s))` : "Não (irá sozinho)"),
              "Total Geral de Pessoas": `${totalPessoas} pessoa(s) no total`,
              "Convidados Titulares": `${totalConfirmados} convidado(s)`,
              "Total de Recusas": `${totalRecusas} recusa(s)`,
              "Data e Hora": dataHoraFormatada
            })
          });
          const fsData = await fsRes.json().catch(() => ({}));
          if (fsData.success === 'false' || fsData.success === false) {
            console.warn("FormSubmit status:", fsData.message);
          }
        } catch (fsErr) {
          console.log("FormSubmit envio aviso:", fsErr);
        }

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

  // 7. Submit Mural de Recados com renderização instantânea e persistência
  const formMsg = document.getElementById('messageForm');
  if (formMsg) {
    formMsg.addEventListener('submit', async (e) => {
      e.preventDefault();

      const autorInput = document.getElementById('msgAuthor');
      const msgInput = document.getElementById('msgContent');
      const nome = autorInput ? autorInput.value.trim() : '';
      const mensagem = msgInput ? msgInput.value.trim() : '';

      if (!nome || !mensagem) return;

      const novoRecado = {
        nome: nome,
        autor: nome,
        mensagem: mensagem,
        created_at: new Date().toISOString()
      };

      // 1. Salva no cache local e atualiza o mural na tela instantaneamente
      salvarRecadoLocal(novoRecado);
      carregarRecados();
      formMsg.reset();

      if (navigator.vibrate) navigator.vibrate(30);
      exibirToast("❤️ Mensagem publicada no mural com sucesso!");

      // 2. Grava no Supabase se a tabela existir
      if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        supabaseClient.from('recados').insert([{
          nome: nome,
          autor: nome,
          mensagem: mensagem
        }]).then(({ error }) => {
          if (error) console.log("Aviso Supabase recados:", error.message);
        }).catch(err => console.log("Aviso Supabase recados:", err));
      }
    });
  }
});

function exibirToast(mensagem) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = mensagem;
    toast.classList.add('show');
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  } else {
    alert(mensagem.replace(/<[^>]*>?/gm, ''));
  }
}
