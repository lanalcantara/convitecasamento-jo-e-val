# Convite Digital - Josalva & Valtair

> Convite digital interativo para a Recepcao de Comemoracao de Josalva & Valtair.
> Acesse em: https://jo-e-val.vercel.app/

---

## Funcionalidades

- Musica ambiente - Live Forever do Oasis toca automaticamente ao abrir o convite
- Animacao de envelope 3D - O convite abre com um envelope interativo com selo de cera J&V
- Countdown ao vivo - Contagem regressiva ate o dia do evento (30/10/2026)
- Confirmacao de presenca (RSVP) - Formulario enviado por e-mail via FormSubmit e salvo no banco (Supabase)
- Chave Pix - Codigo Pix Copia e Cola para presentear os noivos com 1 clique
- Mural de Recados - Convidados podem deixar mensagens carinhosas (salvas no Supabase)
- 100% responsivo - Design otimizado para celular e desktop

---

## Detalhes do Evento

| Campo | Informacao |
|---|---|
| Data | 30 de Outubro de 2026 (Sexta-feira) |
| Horario | 18h00 |
| Local | Restaurante Setima Arte - Rua Conselheiro Portela, 389, Espinheiro, Recife-PE |
| E-mail de notificacao | patriciajosalva@gmail.com |
| Chave Pix | 091.602.964-61 (CPF) |

---

## Tecnologias

- HTML5 / CSS3 / JavaScript - Frontend 100% estatico, sem frameworks
- Supabase (https://supabase.com/) - Banco de dados PostgreSQL para RSVPs e mural
- FormSubmit (https://formsubmit.co/) - Envio de e-mail de confirmacao de presenca
- Vercel (https://vercel.com/) - Hospedagem e deploy automatico
- Font Awesome 6 - Icones
- Google Fonts - Tipografia (Cormorant Garamond, Great Vibes, Playfair Display)

---

## Banco de Dados (Supabase)

O projeto usa o Supabase (PostgreSQL) para armazenar RSVPs e recados.

Execute o arquivo schema.sql no painel SQL do Supabase para criar as tabelas.

Credenciais ficam no config.js:
- SUPABASE_URL: https://ssfgxswkdbrjvqcpxcfp.supabase.co

---

## Confirmacao por E-mail (FormSubmit)

Quando um convidado confirma presenca, um e-mail e enviado automaticamente para patriciajosalva@gmail.com.

ATENCAO: Na primeira vez que usar, o FormSubmit enviara um e-mail de ativacao para patriciajosalva@gmail.com.
E necessario clicar no link de confirmacao para que os envios funcionem.

---

## Deploy

O projeto e hospedado na Vercel com deploy automatico via GitHub.

Para atualizar o site:
  git add .
  git commit -m "sua mensagem"
  git push origin main

A Vercel fara o deploy automaticamente em poucos segundos.

---

## Estrutura do Projeto

`
convitecasamento-jo-e-val/
|-- index.html              # Pagina principal do convite
|-- styles.css              # Estilos (design boho rustico-chique)
|-- script.js               # Logica: audio, envelope, RSVP, mural, Pix
|-- config.js               # Configuracoes centrais (datas, Supabase, Pix)
|-- vercel.json             # Configuracao de deploy na Vercel
|-- live-forever.mp3        # Musica de fundo (Oasis - Live Forever)
|-- foto-de-inicio.png      # Foto do casal (capa do convite)
|-- foto-marco-zero.jpg     # Foto no Marco Zero (hero section)
|-- local-setima-arte.png   # Foto do local (Setima Arte)
|-- convite.jpg             # Imagem floral de decoracao
|-- qrcode-pix.png          # QR Code do Pix
|-- schema.sql              # Script SQL para criar as tabelas no Supabase
|-- assets/                 # Copias de seguranca das imagens e audio
`

---

Feito com carinho para celebrar o amor de Josalva & Valtair
