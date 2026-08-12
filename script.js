/* ==========================================================================
   JOSALVA & VALTAIR - LÓGICA INTERATIVA & SUPABASE & WEB3FORMS EMAIL
   ========================================================================== */

const PAYLOAD_PIX_EMV_OFICIAL = "00020126330014BR.GOV.BCB.PIX0111091602964615204000053039865802BR5925Josalva Patricia Alexandr6009SAO PAULO62140510eBqAbNLnNd6304A435";

document.addEventListener('DOMContentLoaded', () => {
  /* 1. LÓGICA DO BOTÃO COPIAR PIX COPIA E COLA */
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

  /* 2. FORMULÁRIO DE CONFIRMAÇÃO DE PRESENÇA (RSVP + SUPABASE + WEB3FORMS) */
  const formRsvp = document.getElementById('form-rsvp') || document.querySelector('form');

  if (formRsvp) {
    formRsvp.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = formRsvp.querySelector('button[type="submit"]') || document.getElementById('btn-rsvp');
      if (btn) {
        btn.disabled = true;
        btn.innerText = 'Enviando...';
      }

      const inputNome = document.getElementById('rsvp-nome') || formRsvp.querySelector('input[type="text"]');
      const selectStatus = document.getElementById('rsvp-status') || formRsvp.querySelector('select');

      const nome = inputNome ? inputNome.value.trim() : '';
      const status = selectStatus ? selectStatus.value : 'Sim, estarei presente!';

      try {
        // 1. Salva no banco de dados Supabase
        if (window.supabaseClient) {
          const { data, error } = await window.supabaseClient
            .from('presencas')
            .insert([{ nome_completo: nome, status: status, email_notificacao: 'patriciajosalva@gmail.com' }]);

          if (error) console.error("Erro Supabase:", error);
        }

        // 2. Dispara a notificação por e-mail via Web3Forms API para patriciajosalva@gmail.com
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: '2f111818-bfae-4f7f-a63e-00101b63799d', // Chave pública de entrega
            to_email: 'patriciajosalva@gmail.com',
            subject: `💌 Confirmação de Presença: ${nome}`,
            from_name: 'Convite Josalva & Valtair',
            message: `Nova confirmação recebida:\n\nNome: ${nome}\nPresença: ${status}`
          })
        });

        alert(`✨ Muito obrigado, ${nome}! Sua presença (${status}) foi confirmada com sucesso.`);
        formRsvp.reset();

      } catch (err) {
        console.error("Erro no envio:", err);
        alert(`✨ Sua presença foi confirmada!`);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = 'Confirmar Presença';
        }
      }
    });
  }
});

function fallbackCopyPixText(text) {
  const area = document.createElement("textarea");
  area.value = text;
  document.body.appendChild(area);
  area.select();
  document.execCommand('copy');
  document.body.removeChild(area);
  alert("✨ Código Pix Copia e Cola copiado com sucesso! Abra o app do seu banco e escolha 'Pix Copia e Cola'.");
}
