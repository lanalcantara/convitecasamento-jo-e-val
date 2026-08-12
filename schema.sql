-- ==========================================================================
-- ESTRUTURA DA TABELA SUPABASE: confirmacoes
-- Execute este script no SQL Editor do seu painel do Supabase
-- ==========================================================================

CREATE TABLE IF NOT EXISTS confirmacoes (
  id BIGSERIAL PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  vai_comparecer TEXT NOT NULL,
  quantidade_acompanhantes INTEGER DEFAULT 0,
  nomes_acompanhantes TEXT,
  mensagem_noivos TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar RLS (Row Level Security) e permitir inserções públicas (Anon)
ALTER TABLE confirmacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção pública de confirmações" 
ON confirmacoes FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir leitura de confirmações" 
ON confirmacoes FOR SELECT 
USING (true);
